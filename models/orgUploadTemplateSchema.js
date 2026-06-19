/**
 * ? This schema stores an organization's upload template — the mapping of
 * ? their file's column headers to Civron's incident schema fields. This allows
 * ? organizations to upload files with different header names and have them
 * ? automatically mapped to the correct fields on subsequent uploads.
 * ? The `isMappingComplete` field indicates whether all required fields are
 * ? mapped. The `columnMappings` array stores each header-to-field mapping.
 */

import mongoose from 'mongoose';
import {
	mappableFieldPaths,
	currentTemplateVersion,
} from '../config/uploadFieldMap.js';

const { Schema, model } = mongoose;

const columnMappingSchema = new Schema(
	{
		schemaField: { type: String, enum: mappableFieldPaths, required: true },
		fileHeader: { type: String, required: true },
	},
	{ _id: false },
);

const uploadTemplateSchema = new Schema(
	{
		orgID: {
			type: Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
			unique: true,
		},
		columnMappings: [columnMappingSchema],
		templateVersion: {
			type: Number,
			required: true,
			default: currentTemplateVersion,
		},
		isMappingComplete: { type: Boolean, default: false },
		dateFormat: { type: String, required: true },
	},
	{ timestamps: true },
);

export default model('OrgUploadTemplate', uploadTemplateSchema);
