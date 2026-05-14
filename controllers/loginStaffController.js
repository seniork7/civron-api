/**
 * ? This file contains the logics that check the employee's credentials
 * ? during login
 */

import Organization from '../models/orgSchema.js';
import OrgUser from '../models/orgUserSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const loginStaff = async (req, res) => {
	try {
		const { email, password } = req.body;

		const staff = await OrgUser.findOne({ email });
		if (!staff) {
			return res.status(401).json({ message: 'Invalid credentials!' });
		}

		const isValid = await bcrypt.compare(password, staff.passwordHash);
		if (!isValid) {
			return res.status(401).json({ message: 'Invalid credentials!' });
		}

		const org = await Organization.findById(staff.orgID);
		if (!org) {
			return res.status(404).json({ message: 'Organization not found!' });
		}

		const payload = {
			id: staff._id,
			role: staff.role,
			fName: staff.fName,
			lName: staff.lName,
			title: staff.title,
			orgID: staff.orgID,
			orgName: org.name,
			country: org.country,
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '7d',
		});

		res.cookie('staff_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		res.json({
			message: 'Login successful',
			role: staff.role,
			fName: staff.fName,
			lName: staff.lName,
			title: staff.title,
			orgID: staff.orgID,
			orgName: org.name,
			country: org.country,
			createdAt: staff.createdAt,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

export default loginStaff;
