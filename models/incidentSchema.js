/**
 * ? This file contains the schema for incident reports
 *
 */

import mongoose from 'mongoose';
import { incidentTypeValues } from '../config/incidentTypes.js';
import { severityValues, statusValues } from '../config/incidentEnums.js';

const { Schema, model } = mongoose;

const incidentSchema = new Schema(
	{
		orgID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},
		externalID: { type: String },
		country: { type: String, required: true },
		location: {
			state: { type: String, required: true },
			address: { type: String },
			city: { type: String },
			latitude: { type: Number },
			longitude: { type: Number },
		},
		date: { type: Date, required: true },
		details: { type: String, required: true },
		type: { type: String, enum: incidentTypeValues, required: true },
		severity: { type: String, enum: severityValues, default: 'low' },
		injuries: { type: Number },
		fatalities: { type: Number },
		status: { type: String, enum: statusValues, default: 'pending' },
		warnings: [{ type: String }],
		reportedBy: { type: String },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'OrgUser',
			required: true,
		},
		source: { name: { type: String }, url: { type: String } },
		evidence: [{ type: String }],
		customFields: { type: Map, of: mongoose.Schema.Types.Mixed },
	},
	{ timestamps: true },
);

// Filter by country & incident type
incidentSchema.index({ country: 1, type: 1 });

// Filter incidents by status
incidentSchema.index({ orgID: 1, status: 1 });

// Prevent duplicate external IDs within an org (only when one exists)
incidentSchema.index(
	{ orgID: 1, externalID: 1 },
	{
		unique: true,
		partialFilterExpression: { externalID: { $exists: true } },
	},
);

// Makes any customFields.* key queryable
incidentSchema.index({ 'customFields.$**': 1 });

export default model('Incident', incidentSchema);
