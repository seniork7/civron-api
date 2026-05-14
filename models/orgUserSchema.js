/**
 * ? This file contains the schema for employees
 */

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orgUserSchema = new Schema(
	{
		orgID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Organization',
			required: true,
		},
		fName: { type: String },
		lName: { type: String },
		email: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		title: { type: String },
		role: { type: String, enum: ['admin', 'staff'], default: 'staff' },
	},
	{ timestamps: true },
);

const OrgUser = model('OrgUser', orgUserSchema);

export default OrgUser;
