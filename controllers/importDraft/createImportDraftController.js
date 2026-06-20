/**
 * ? This file creates a new import draft by transforming the raw uploaded rows into
 * ? incident-shaped, validate records and saves them as a draft for staff
 * ? to review before committing to the incidents collection
 */

import { createHash } from 'node:crypto';
import ImportDraft from '../../models/importDraftSchema.js';
import OrgUser from '../../models/orgUserSchema.js';
import { buildRecords } from '../../utils/importRecords.js';

const createImportDraft = async (req, res) => {
	const { orgID, id } = req.staff;
	const { rows, columnMappings, dateFormat } = req.body;

	try {
		// Produce a short code (hash) from the file (rows)
		const contentHash = createHash('sha256')
			.update(JSON.stringify(rows))
			.digest('hex');

		// Check if there is a draft for the same file (matching short code)
		const existingDraft = await ImportDraft.findOne({
			orgID,
			status: 'reviewing',
			contentHash,
		});

		// If a draft exist for that same file, route the staff to
		// it instead of creating a duplicate
		if (existingDraft) {
			// Check how many minutes since anyone last edited that draft
			const minutesIdle =
				(Date.now() - new Date(existingDraft.updatedAt).getTime()) /
				60000;

			// Get the ID of the last staff that edited the draft
			const isMine = existingDraft.updatedBy.equals(id);

			const isAbandoned = minutesIdle > 30;

			// Block a different staff member while someone is actively reviewing it
			if (!isMine && !isAbandoned) {
				// Get the staff's name thats reviewing the draft
				const reviewer = await OrgUser.findById(
					existingDraft.updatedBy,
				).select('fName lName title');

				const reviewerName = reviewer
					? `${reviewer.fName} ${reviewer.lName}, ${reviewer.title}`
					: 'a colleague';

				return res
					.status(409)
					.json({
						error: `This file is already being imported by ${reviewerName}.`,
					});
			}

			// Set the ID for the staff now working on the draft
			existingDraft.updatedBy = id;

			// Refresh the draft so it shows the lastest updatedAt
			await existingDraft.save();

			return res
				.status(200)
				.json({ draftId: existingDraft._id, resumed: true });
		}

		// If its a new file, shape the raw rows into records
		const records = buildRecords(rows, columnMappings, dateFormat);

		// Save a new draft
		const draft = await ImportDraft.create({
			orgID,
			createdBy: id,
			updatedBy: id,
			dateFormat,
			columnMappings,
			records,
			contentHash,
		});

		res.status(201).json({ draftId: draft._id, resumed: false });
	} catch (error) {
		console.error('Error creating import draft:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default createImportDraft;
