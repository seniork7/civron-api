/**
 * ? Controller for updating an existing CSV template. It checks
 * ? for the existence of a template for the organization, validates
 * ? the completeness of the column mappings against required fields,
 * ? and updates the template in the database
 */

import OrgUploadTemplate from '../../models/orgUploadTemplateSchema.js';
import { requiredFieldPaths } from '../../config/uploadFieldMap.js';

const updateTemplateController = async (req, res) => {
	const { columnMappings, dateFormat } = req.body;
	const { orgID } = req.staff;

	try {
		const existingTemplate = await OrgUploadTemplate.findOne({ orgID });

		if (!existingTemplate) {
			res.status(404).json({ error: 'No template found!' });
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

		// Update the existing template with the new data from the request body
		existingTemplate.columnMappings = columnMappings;
		existingTemplate.dateFormat = dateFormat;
		existingTemplate.isMappingComplete = isMappingComplete;

		// Save the updated template to the database
		await existingTemplate.save();

		res.status(200).json({
			message: 'Template updated successfully',
			template: existingTemplate,
		});
	} catch (error) {
		console.error('Error updating template:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default updateTemplateController;
