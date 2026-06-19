/**
 * ? This file loads a single import draft by id for the review page. Scoped to the
 * ? staff's organization so one agency can never read another's draft
 */

import mongoose from 'mongoose';
import ImportDraft from '../../models/importDraftSchema.js';

const getImportDraft = async (req, res) => {
	const { orgID } = req.staff;
	const { id } = req.params;

	try {
		if (!mongoose.isValidObjectId(id)) {
			return res.status(404).json({ error: 'Import draft not found' });
		}

		const draft = await ImportDraft.findOne({ _id: id, orgID }).select(
			'-__v -orgID -createdBy',
		);

		if (!draft) {
			return res.status(404).json({ error: 'Import draft not found' });
		}

		res.status(200).json({ draft });
	} catch (error) {
		console.error('Error fetching import draft:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default getImportDraft;
