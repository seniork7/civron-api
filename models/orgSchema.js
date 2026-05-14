/**
 * ? This file contains the schema for organizations with the
 * ? company name scoped to their country
 */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orgSchema = new Schema(
	{
		name: { type: String, required: true },
		type: {
			type: String,
			required: true,
			enum: [
				'police',
				'corrections',
				'customs_and_border',
				'fire',
				'emergency_medical_services',
				'coast_guard',
				'search_and_rescue',
				'health',
				'disaster_management',
				'environmental_protection',
				'meteorological',
				'transport_safety',
				'food_and_drug',
				'workplace_safety',
				'civil_defence',
				'military',
				'other',
			],
		},
		country: { type: String, required: true, index: true },
		city: { type: String, required: true },
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
			index: true,
		},
	},
	{ timestamps: true },
);

orgSchema.index({ name: 1, country: 1 }, { unique: true });

const Organization = model('Organization', orgSchema);

export default Organization;
