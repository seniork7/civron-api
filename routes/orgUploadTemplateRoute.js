/**
 * ? Template routes
 */

import express from 'express';
import getTemplateFieldsController from '../controllers/templates/getTemplateFieldsController.js';
import verifyStaff from '../middleware/verifyStaff.js';
import getTemplate from '../controllers/templates/getTemplateController.js';
import postTemplate from '../controllers/templates/postTemplateController.js';
import validateCSVTemplate from '../middleware/joi/orgUploadTemplateValidation.js';
import updateTemplate from '../controllers/templates/updateTemplateController.js';

const router = express.Router();

router.get('/fields', verifyStaff, getTemplateFieldsController);
router.get('/', verifyStaff, getTemplate);
router.post('/', verifyStaff, validateCSVTemplate, postTemplate);
router.patch('/', verifyStaff, validateCSVTemplate, updateTemplate);

export default router;
