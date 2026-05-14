/**
 * ? This file contains the middleware logics to verify staffs
 * ? by checking the token inside the cookie in the request body
 */

import jwt from 'jsonwebtoken';

const verifyStaff = (req, res, next) => {
	const token = req.cookies.staff_token;
	if (!token) return res.status(401).json({ message: 'Not authenticated' });

	try {
		const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
		req.staff = verifiedToken;

		next();
	} catch (err) {
		res.status(401).json({ message: 'Token invalid or expired' });
	}
};

export default verifyStaff;
