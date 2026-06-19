/**
 * ? Import draft routes
 */

import express from 'express';
import verifyStaff from '../middleware/verifyStaff.js';
import validateImportDraft from '../middleware/joi/importDraftValidation.js';
import createImportDraft from '../controllers/importDraft/createImportDraftController.js';
import getImportDraft from '../controllers/importDraft/getImportDraftController.js';
import updateImportDraft from '../controllers/importDraft/updateImportDraftController.js';
import commitImportDraft from '../controllers/importDraft/commitImportDraftController.js';
import validateImportDraftEdit from '../middleware/joi/importDraftEditValidation.js';

const router = express.Router();

router.post('/', verifyStaff, validateImportDraft, createImportDraft);
router.post('/:id/commit', verifyStaff, commitImportDraft);
router.get('/:id', verifyStaff, getImportDraft);
router.patch('/:id', verifyStaff, validateImportDraftEdit, updateImportDraft);

export default router;
