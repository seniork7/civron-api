/**
 * ? This file contains the schema for incident reports
 *
 */

import mongoose from 'mongoose';
import { incidentTypeValues } from '../config/incidentTypes.js';

const { Schema, model } = mongoose;

const incidentSchema = new Schema(
	{
		orgID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},
		country: { type: String, required: true },
		location: {
			state: { type: String, required: true },
			address: { type: String },
		},
		date: { type: Date, required: true },
		details: { type: String, required: true },
		type: { type: String, enum: incidentTypeValues, required: true },
		severity: {
			type: String,
			enum: ['high', 'medium', 'low', 'none'],
			default: 'low',
		},
		status: {
			type: String,
			enum: ['pending', 'ongoing', 'resolved'],
			default: 'pending',
		},
		warnings: [{ type: String }],
		reportedBy: { type: String },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'OrgUser',
			required: true,
		},
		source: { name: { type: String }, url: { type: String } },
		evidence: [{ type: String }],
	},
	{ timestamps: true },
);

incidentSchema.index({ country: 1, type: 1 });

incidentSchema.index({ orgID: 1, status: 1 });

export default model('Incident', incidentSchema);
