/**
 * ? Controller for creating a new CSV template. It checks if a template
 * ? already exists for the organization, validates the completeness of
 * ? the column mappings against required fields, and saves the new template
 * ? to the database if valid
 */

import OrgUploadTemplate from '../../models/orgUploadTemplateSchema.js';
import { requiredFieldPaths } from '../../config/uploadFieldMap.js';

const postTemplateController = async (req, res) => {
	const { columnMappings, dateFormat } = req.body;
	const { orgID } = req.staff;

	try {
		const existingTemplate = await OrgUploadTemplate.findOne({ orgID });

		if (existingTemplate) {
			res.status(409).json({ error: 'Template already exists!' });
			return;
		}

		// Check for missing required fields in the column mappings and
		// collect them to send in the response to inform the staff which fields are missing
		const missingFields = requiredFieldPaths.filter(
			(path) =>
				!columnMappings.some((mapping) => mapping.schemaField === path),
		);

		// Check if all required fields are mapped
		const isMappingComplete = missingFields.length === 0;

		if (!isMappingComplete) {
			res.status(400).json({
				error: 'Column mappings are incomplete.',
				missingFields,
			});

			return;
		}

		const createdTemplate = await OrgUploadTemplate.create({
			orgID,
			columnMappings,
			dateFormat,
			isMappingComplete,
		});

		res.status(201).json({
			message: 'Template created successfully',
			template: createdTemplate,
		});
	} catch (error) {
		console.error('Error creating template:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default postTemplateController;
