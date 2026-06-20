/**
 * ? This file saves a single cell edit on an import draft: applies the new value to the
 * ? row, re-validates it, then persists. Calls Mongoose's markModified first so
 * ? it notices the change inside the Mixed `records` field before saving
 */

import mongoose from 'mongoose';
import ImportDraft from '../../models/importDraftSchema.js';
import { applyCellEdit } from '../../utils/importRecords.js';

const updateImportDraft = async (req, res) => {
	const { orgID, id: staffID } = req.staff;
	const { id } = req.params;
	const { rowId, schemaField, value } = req.body;

	try {
		if (!mongoose.isValidObjectId(id)) {
			return res.status(404).json({ error: 'Import draft not found' });
		}

		const draft = await ImportDraft.findOne({ _id: id, orgID });

		if (!draft) {
			return res.status(404).json({ error: 'Import draft not found' });
		}

		if (draft.status === 'committed') {
			return res
				.status(409)
				.json({ error: 'This draft has already been committed' });
		}

		const record = draft.records.find((row) => row.rowId === rowId);

		if (!record) {
			return res.status(404).json({ error: 'Row not found' });
		}

		applyCellEdit(record, schemaField, value, draft.dateFormat);
		draft.markModified('records');
		draft.updatedBy = staffID;
		await draft.save();

		res.status(200).json({
			rowId: record.rowId,
			data: record.data,
			errors: record.errors,
		});
	} catch (error) {
		console.error('Error updating import draft:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default updateImportDraft;
