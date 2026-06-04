/**
 * ? This file contains validation logic using Joi to ensure the
 * ? upload template data from the client matches the expected shape
 * ? before saving to the database
 */

import Joi from 'joi';
import { mappableFieldPaths } from '../../config/uploadFieldMap.js';

const uploadTemplateValidationSchema = Joi.object({
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

const validateCSVTemplate = (req, res, next) => {
	const { error } = uploadTemplateValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	next();
};

export default validateCSVTemplate;