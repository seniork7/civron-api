/**
 * ? Validates the import-draft cell-edit (PATCH) body before it reaches the controller
 */

import Joi from 'joi';
import { mappableFieldPaths } from '../../config/uploadFieldMap.js';

// Editable fields are the mappable ones except the custom-field
const editableFieldPaths = mappableFieldPaths.filter(
	(path) => path !== '$custom',
);

const importDraftEditSchema = Joi.object({
	rowId: Joi.string().required(),
	schemaField: Joi.string()
		.valid(...editableFieldPaths)
		.required(),
	value: Joi.alternatives()
		.try(Joi.string().allow(''), Joi.number())
		.allow(null)
		.required(),
});

const validateImportDraftEdit = (req, res, next) => {
	const { error } = importDraftEditSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	next();
};

export default validateImportDraftEdit;
