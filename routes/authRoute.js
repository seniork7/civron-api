/**
 * ? Auth routes
 */

import express from 'express';
import loginStaff from '../controllers/loginStaffController.js';

const router = express.Router();

router.post('/login', loginStaff);

export default router;
