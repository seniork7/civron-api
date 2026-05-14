/**
 * ? This file contains a list of time periods (windows) for which an
 * ? incident can happen. This is imported in the postIncidentController file
 * ? to use to check the DB for any incident that are the same and prevent duplication
 */

export const duplicateWindows = {
	flood: 48 * 60 * 60 * 1000, // 48 hours
	hurricane: 72 * 60 * 60 * 1000, // 72 hours
	earthquake: 24 * 60 * 60 * 1000, // 24 hours
	landslide: 24 * 60 * 60 * 1000, // 24 hours
	drought: 72 * 60 * 60 * 1000, // 72 hours
	tsunami: 24 * 60 * 60 * 1000, // 24 hours
	fire: 24 * 60 * 60 * 1000, // 24 hours
	explosion: 12 * 60 * 60 * 1000, // 12 hours
	homicide: 1 * 60 * 60 * 1000, // 1 hour
	shooting: 1 * 60 * 60 * 1000, // 1 hour
	robbery: 2 * 60 * 60 * 1000, // 2 hours
	assault: 2 * 60 * 60 * 1000, // 2 hours
	kidnapping: 6 * 60 * 60 * 1000, // 6 hours
	domestic_violence: 2 * 60 * 60 * 1000, // 2 hours
	drug_related: 3 * 60 * 60 * 1000, // 3 hours
	gang_related: 2 * 60 * 60 * 1000, // 2 hours
	disease_outbreak: 72 * 60 * 60 * 1000, // 72 hours
	food_contamination: 48 * 60 * 60 * 1000, // 48 hours
	chemical_exposure: 24 * 60 * 60 * 1000, // 24 hours
	mass_casualty: 12 * 60 * 60 * 1000, // 12 hours
	road_accident: 3 * 60 * 60 * 1000, // 3 hours
	power_outage: 24 * 60 * 60 * 1000, // 24 hours
	water_disruption: 24 * 60 * 60 * 1000, // 24 hours
	building_collapse: 24 * 60 * 60 * 1000, // 24 hours
	marine_incident: 12 * 60 * 60 * 1000, // 12 hours
	oil_spill: 72 * 60 * 60 * 1000, // 72 hours
	coastal_flooding: 48 * 60 * 60 * 1000, // 48 hours
	pollution: 48 * 60 * 60 * 1000, // 48 hours
	deforestation: 72 * 60 * 60 * 1000, // 72 hours
	hazardous_waste: 48 * 60 * 60 * 1000, // 48 hours
	civil_unrest: 12 * 60 * 60 * 1000, // 12 hours
	missing_person: 24 * 60 * 60 * 1000, // 24 hours
	other: 2 * 60 * 60 * 1000, // 2 hours default
};
