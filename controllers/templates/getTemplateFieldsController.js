/**
 * ? Controller for retrieving the fields of a CSV template so that staff
 * ? can see which fields are available for mapping when creating or updating a template
 */

import { mappableFields } from '../../config/uploadFieldMap.js';

const getTemplateFieldsController = (req, res) => {
	res.json({ fields: mappableFields });
};

export default getTemplateFieldsController;
