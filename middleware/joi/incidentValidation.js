/**
 * ? This file contains validation logics using Joi to ensure the
 * ? data from the client matches the expected response
 */

import Joi from 'joi';
import { incidentTypeValues } from '../../config/incidentTypes.js';

const incidentValidationSchema = Joi.object({
	location: Joi.object({
		state: Joi.string().min(2).max(100).required(),
		address: Joi.string().max(255).allow(''),
	}).required(),

	force: Joi.boolean().default(false),

	date: Joi.date().required(),

	details: Joi.string().min(10).max(5000).required(),

	type: Joi.string().valid(...incidentTypeValues).required(),

	severity: Joi.string()
		.valid('high', 'medium', 'low', 'none')
		.default('low'),

	status: Joi.string()
		.valid('pending', 'ongoing', 'resolved')
		.default('pending'),

	warnings: Joi.array().items(Joi.string().max(255)),

	reportedBy: Joi.string().max(100),

	source: Joi.object({
		name: Joi.string().max(255),

		url: Joi.string().uri(),
	}),

	evidence: Joi.array().items(Joi.string().uri()),
});

const validateIncident = (req, res, next) => {
	const { error } = incidentValidationSchema.validate(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	next();
};

export default validateIncident;
