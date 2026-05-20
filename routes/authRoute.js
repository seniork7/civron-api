/**
 * ? Auth routes
 */

import express from 'express';
import loginStaff from '../controllers/loginStaffController.js';
import verifyStaff from '../middleware/verifyStaff.js';

const router = express.Router();

router.post('/login', loginStaff);
router.get('/check-auth', verifyStaff, async (req, res) => {
	const staff = req.staff;
	res.json({
		message: 'Authenticated',
		role: staff.role,
		fName: staff.fName,
		lName: staff.lName,
		title: staff.title,
		orgID: staff.orgID,
		orgName: staff.orgName,
		country: staff.country,
	});
});

export default router;
