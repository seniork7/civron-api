/**
 * ? This file creates a new import draft by transforming the raw uploaded rows into
 * ? incident-shaped, validate records and saves them as a draft for staff
 * ? to review before committing to the incidents collection
 */

import ImportDraft from '../../models/importDraftSchema.js';
import { buildRecords } from '../../utils/importRecords.js';

const createImportDraft = async (req, res) => {
	const { orgID, id } = req.staff;
	const { rows, columnMappings, dateFormat } = req.body;

	try {
		const records = buildRecords(rows, columnMappings, dateFormat);

		const draft = await ImportDraft.create({
			orgID,
			createdBy: id,
			dateFormat,
			columnMappings,
			records,
		});

		res.status(201).json({ draftId: draft._id });
	} catch (error) {
		console.error('Error creating import draft:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default createImportDraft;
