/**
 * ? This file defines the different types of incidents that can be
 * ? reported. Each incident type has a value and a label for display
 * ? purposes. The `incidentTypeValues` array provides the incidentValidation.js
 * ? and incidentSchema.js files with the valid incident types for validation and
 * ? database schema definition
 */

export const incidentTypes = [
	{ value: 'flood', label: 'Flood' },
	{ value: 'hurricane', label: 'Hurricane' },
	{ value: 'earthquake', label: 'Earthquake' },
	{ value: 'landslide', label: 'Landslide' },
	{ value: 'drought', label: 'Drought' },
	{ value: 'tsunami', label: 'Tsunami' },
	{ value: 'fire', label: 'Fire' },
	{ value: 'explosion', label: 'Explosion' },
	{ value: 'homicide', label: 'Homicide' },
	{ value: 'shooting', label: 'Shooting' },
	{ value: 'robbery', label: 'Robbery' },
	{ value: 'assault', label: 'Assault' },
	{ value: 'kidnapping', label: 'Kidnapping' },
	{ value: 'domestic_violence', label: 'Domestic Violence' },
	{ value: 'drug_related', label: 'Drug Related' },
	{ value: 'gang_related', label: 'Gang Related' },
	{ value: 'disease_outbreak', label: 'Disease Outbreak' },
	{ value: 'food_contamination', label: 'Food Contamination' },
	{ value: 'chemical_exposure', label: 'Chemical Exposure' },
	{ value: 'mass_casualty', label: 'Mass Casualty' },
	{ value: 'road_accident', label: 'Road Accident' },
	{ value: 'power_outage', label: 'Power Outage' },
	{ value: 'water_disruption', label: 'Water Disruption' },
	{ value: 'building_collapse', label: 'Building Collapse' },
	{ value: 'marine_incident', label: 'Marine Incident' },
	{ value: 'oil_spill', label: 'Oil Spill' },
	{ value: 'coastal_flooding', label: 'Coastal Flooding' },
	{ value: 'pollution', label: 'Pollution' },
	{ value: 'deforestation', label: 'Deforestation' },
	{ value: 'hazardous_waste', label: 'Hazardous Waste' },
	{ value: 'civil_unrest', label: 'Civil Unrest' },
	{ value: 'missing_person', label: 'Missing Person' },
	{ value: 'other', label: 'Other' },
];

export const incidentTypeValues = incidentTypes.map((type) => type.value);
