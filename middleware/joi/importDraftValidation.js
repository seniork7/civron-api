/**
 * ? This file contains validation logics for the import draft request
 */

import Joi from 'joi';
import { mappableFieldPaths } from '../../config/uploadFieldMap.js';

const importDraftValidationSchema = Joi.object({
	rows: Joi.array()
		.items(Joi.object().unknown(true))
		.min(1)
		.max(500)
		.required(),

	columnMappings: Joi.array()
		.items(
			Joi.object({
				fileHeader: Joi.string().max(100).required(),
				schemaField: Joi.string()
					.valid(...mappableFieldPaths)
					.required(),
			}),
		)
		.min(1)
		.required(),

	dateFormat: Joi.string().max(50).required(),
});

const validateImportDraft = (req, res, next) => {
	const { error } = importDraftValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	next();
};

export default validateImportDraft;
