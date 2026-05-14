/**
 * ? This file contains the schema for incident reports
 *
 */

import mongoose from 'mongoose';

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
		type: {
			type: String,
			enum: [
				'flood',
				'hurricane',
				'earthquake',
				'landslide',
				'drought',
				'tsunami',
				'fire',
				'explosion',
				'homicide',
				'shooting',
				'robbery',
				'assault',
				'kidnapping',
				'domestic_violence',
				'drug_related',
				'gang_related',
				'disease_outbreak',
				'food_contamination',
				'chemical_exposure',
				'mass_casualty',
				'road_accident',
				'power_outage',
				'water_disruption',
				'building_collapse',
				'marine_incident',
				'oil_spill',
				'coastal_flooding',
				'pollution',
				'deforestation',
				'hazardous_waste',
				'civil_unrest',
				'missing_person',
				'other',
			],
			required: true,
		},
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

const Incident = model('Incident', incidentSchema);

export default Incident;
