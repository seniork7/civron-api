/**
 * ? This file contains the schema for organization's uploaded
 * ? incident records. The uploaded incidents get saved in the DB as
 * ? draft before the organization validates and promotes them to
 * ? their official records
 */

import mongoose from 'mongoose';
import { mappableFieldPaths } from '../config/uploadFieldMap.js';

const { Schema, model } = mongoose;

// Schema for the column mappings for the draft records
const columnMappingSchema = new Schema(
	{
		schemaField: { type: String, enum: mappableFieldPaths, required: true },
		fileHeader: { type: String, required: true },
	},
	{ _id: false },
);

const importRecordSchema = new Schema(
	{
		rowId: { type: String, required: true },
		data: { type: Schema.Types.Mixed },
		errors: { type: Schema.Types.Mixed, default: {} },
	},
	{ _id: false },
);

const importDraftSchema = new Schema(
	{
		orgID: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'OrgUser',
			required: true,
		},
		dateFormat: { type: String, required: true },
		// The mapped columns for current draft. If the agency later uploads another file
		// and changes their template, this draft's columns stay preserved
		columnMappings: [columnMappingSchema],
		records: [importRecordSchema],
		status: {
			type: String,
			enum: ['reviewing', 'committed'],
			default: 'reviewing',
		},
		committedIncidentIds: [
			{ type: Schema.Types.ObjectId, ref: 'Incident' },
		],
	},
	{ timestamps: true },
);

// Auto cleanup so drafts do not stay in the DB for too long
importDraftSchema.index(
	{ createdAt: 1 },
	{ expireAfterSeconds: 60 * 60 * 24 * 7 },
);

export default model('ImportDraft', importDraftSchema);
