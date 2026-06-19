/**
 * ? This file commits an import draft: re-validates every row, then promotes the staged
 * ? records into the live incidents collection.
 * ? Marks the draft committed and stores the new incident ids so there's no duplication
 * ? on repeated uploads
 */

import mongoose from 'mongoose';
import ImportDraft from '../../models/importDraftSchema.js';
import Incident from '../../models/incidentSchema.js';
import { validateRecord } from '../../utils/importRecords.js';

const commitImportDraft = async (req, res) => {
	const { orgID } = req.staff;
	const { id } = req.params;

	try {
		if (!mongoose.isValidObjectId(id)) {
			return res.status(404).json({ error: 'Import draft not found' });
		}

		const draft = await ImportDraft.findOne({ _id: id, orgID });

		if (!draft) {
			return res.status(404).json({ error: 'Import draft not found' });
		}

		// Idempotency: if it's already committed, return the same result and
		// do not insert again
		if (draft.status === 'committed') {
			return res
				.status(200)
				.json({
					insertedCount: draft.committedIncidentIds.length,
					incidentIds: draft.committedIncidentIds,
				});
		}

		// Re-validate every row
		const invalidRowIds = draft.records
			.filter(
				(record) =>
					Object.keys(validateRecord(record.data, draft.dateFormat))
						.length > 0,
			)
			.map((record) => record.rowId);

		if (invalidRowIds.length > 0) {
			return res
				.status(400)
				.json({
					error: 'Some rows still have errors and cannot be committed',
					invalidRowIds,
				});
		}

		// Shape real incidents from the staged records
		const incidents = draft.records.map((record) => ({
			...record.data,
			orgID: draft.orgID,
			createdBy: draft.createdBy,
		}));

		// Start a transaction session so the insert and the draft update happen together
		const session = await mongoose.startSession();
		try {
			// Everything inside here either all saves, or all undoes if something fails
			await session.withTransaction(async () => {
				const inserted = await Incident.insertMany(incidents, {
					session,
				});

				// Mark the draft as committed and store the ids of the incidents created
				draft.status = 'committed';
				draft.committedIncidentIds = inserted.map((doc) => doc._id);

				// Save the draft changes
				await draft.save({ session });
			});

			// Send back how many incidents were created and their ids
			res.status(201).json({
				insertedCount: draft.committedIncidentIds.length,
				incidentIds: draft.committedIncidentIds,
			});
		} finally {
			session.endSession();
		}
	} catch (error) {
		console.error('Error committing import draft:', error);

		// If duplicate externalID
		if (error.code === 11000) {
			return res
				.status(409)
				.json({
					error: 'One or more records duplicate an existing incident',
				});
		}

		res.status(500).json({ error: 'Internal server error' });
	}
};

export default commitImportDraft;
