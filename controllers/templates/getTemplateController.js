/**
 * ? Get template for a specific organization so that
 * ? the frontend can check if the organization has a
 * ? template set up and display the appropriate UI for
 * ? mapping csv headers to incident fields
 */

import OrgUploadTemplate from '../../models/orgUploadTemplateSchema.js';

const getTemplate = async (req, res) => {
	const { orgID } = req.staff;

	try {
		const template = await OrgUploadTemplate.findOne({ orgID })
			.select('-__v')
			.lean();

		if (!template) {
			res.json({ template: null });
			return;
		}

		res.json({ template });
	} catch (error) {
		console.error('Error fetching template:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

export default getTemplate;
