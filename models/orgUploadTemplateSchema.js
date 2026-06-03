/**
 * ? This schema is a template for storing an organization csv header
 * ? values that maps to incident schema fields. This allows organizations
 * ? to upload csv files with different header names and map them to the
 * ? correct fields in the incident schema.
 * ? The `isMappingComplete` field indicates whether the required fields
 * ? are mapped, which can be used to enforce validation before allowing
 * ? incident uploads. The `columnMappings` array stores the mapping of csv
 * ? headers to incident schema fields
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
		csvHeader: { type: String, required: true },
	},
	{ _id: false },
);

const csvTemplateSchema = new Schema(
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

export default model('OrgUploadTemplate', csvTemplateSchema);
