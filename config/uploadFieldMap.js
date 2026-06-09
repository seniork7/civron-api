/**
 * ? This file defines the template version and the fields that can be
 * ? mapped to the organization's upload file column headers. Each field has a label for
 * ? display purposes, a path that corresponds to the field in the incident
 * ? object, and a required flag that indicates whether the field is required
 * ? for a valid incident report. The `mappableFieldPaths` and `requiredFieldPaths`
 * ? arrays provide a list of all the field paths and their required status for
 * ? validation purposes.
 */

export const currentTemplateVersion = 0.1;

export const mappableFields = [
	{ label: 'Record ID', path: 'externalID', required: false },
	{ label: 'Country', path: 'country', required: true },
	{ label: 'State / Region', path: 'location.state', required: true },
	{ label: 'City / Town', path: 'location.city', required: false },
	{ label: 'Address', path: 'location.address', required: false },
	{ label: 'Latitude', path: 'location.latitude', required: false },
	{ label: 'Longitude', path: 'location.longitude', required: false },
	{ label: 'Date of Occurrence', path: 'date', required: true },
	{ label: 'Incident Type', path: 'type', required: true },
	{ label: 'Severity', path: 'severity', required: false },
	{ label: 'Injuries', path: 'injuries', required: false },
	{ label: 'Fatalities', path: 'fatalities', required: false },
	{ label: 'Details', path: 'details', required: true },
	{ label: 'Status', path: 'status', required: false },
	{ label: 'Reported By', path: 'reportedBy', required: false },
	{ label: 'Source Name', path: 'source.name', required: false },
	{ label: 'Source URL', path: 'source.url', required: false },
	{ label: 'Warnings', path: 'warnings', required: false },
	{ label: 'Store as custom field', path: '$custom', required: false },
];

export const mappableFieldPaths = mappableFields.map((f) => f.path);

export const requiredFieldPaths = mappableFields
	.filter((f) => f.required)
	.map((f) => f.path);
