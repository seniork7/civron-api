/**
 * ? This file turns the raw rows from an agency's uploaded spreadsheet
 * ? into incident-shaped, validated records for an import draft
 * ? Two main functions are used:
 * ?   buildRecords()   — called when a draft is created (shapes + flags every row)
 * ?   validateRecord() — re-used when a row is edited and again at commit
 * ? Everything else is a small helper that these two rely on
 */

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { randomUUID } from 'node:crypto';
import { incidentTypes, incidentTypeValues } from '../config/incidentTypes.js';
import { severityValues, statusValues } from '../config/incidentEnums.js';
import { requiredFieldPaths } from '../config/uploadFieldMap.js';

// Use dayjs to parse a date string against a format
dayjs.extend(customParseFormat);

// Set the mapped fields that should be converted to numbers / dates
const numberFields = new Set([
	'location.latitude',
	'location.longitude',
	'injuries',
	'fatalities',
]);
const dateFields = new Set(['date']);

// Fields that only allow a fixed set of words
const allowedValues = {
	type: incidentTypeValues,
	severity: severityValues,
	status: statusValues,
};

// An isEmpty helper function that determines if a value
// is undefined, null, or an empty string
const isEmpty = (value) => value == null || value === '';

// Put a value into a nested object using a dotted path:
// setNestedValue(obj, 'location.state', 'Kingston') -> obj.location.state = 'Kingston'
function setNestedValue(target, path, value) {
	const keys = path.split('.');
	let node = target;

	// Loop through each part of the path, creating the level if
	// it's missing, then go into it
	for (let i = 0; i < keys.length - 1; i++) {
		node[keys[i]] ??= {};
		node = node[keys[i]];
	}
	// Set the final key
	node[keys.at(-1)] = value;
}

// Read a value from a nested object using a dotted path:
// getNestedValue(obj, 'location.state') -> obj.location.state
function getNestedValue(obj, path) {
	return path.split('.').reduce((node, key) => node?.[key], obj);
}

// Build a few versions of the chosen date format to accept dates whether or
// not they have a leading zero
function tolerantDateFormats(dateFormat) {
	return [
		...new Set([
			dateFormat,
			dateFormat.replace('MM', 'M').replace('DD', 'D'),
			dateFormat.replace('MM', 'M'),
			dateFormat.replace('DD', 'D'),
		]),
	];
}

// Tidy an enum value to the official one, ignoring case
// Returns the official value, or the original if it don't recognise it
function normaliseEnum(field, value) {
	const text = String(value).trim().toLowerCase();

	// type: match the value or its label
	if (field === 'type') {
		const match = incidentTypes.find(
			(t) =>
				t.value.toLowerCase() === text ||
				t.label.toLowerCase() === text,
		);
		return match ? match.value : value;
	}

	// severity / status: match the value, ignoring case (e.g. "High" -> "high")
	const match = allowedValues[field].find((v) => v.toLowerCase() === text);
	return match ?? value;
}

// Convert one raw spreadsheet cell into its proper type
// If a date/number can't be parsed we keep the original text so staff
// can see and fix it on the review page
function convertCell(field, rawValue, dateFormat) {
	const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
	if (isEmpty(value)) return undefined;

	// Excel dates come in already parsed (ISO), so use them as is
	// Otherwise read the text using the agency's format
	if (dateFields.has(field)) {
		const text = String(value);

		// Already a real date from Excel
		if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
			const isoDate = dayjs(text);
			if (isoDate.isValid()) return isoDate.toDate();
		}

		// Read the text against the agency's format ('true' = strict)
		const parsed = dayjs(text, tolerantDateFormats(dateFormat), true);
		return parsed.isValid() ? parsed.toDate() : value;
	}

	// Turn a number thats in text format into an actual number type
	if (numberFields.has(field)) {
		const number = Number(value);
		return Number.isNaN(number) ? value : number;
	}

	// Enum fields (type / severity / status): tidy to the official value so
	// "High" or the label "Assault" match instead of getting flagged
	if (field in allowedValues) {
		return normaliseEnum(field, value);
	}

	return value;
}

// Update one cell on a row: clean the value, convert it to its proper type
// (date or number), write it into the row, then re-check the row for errors.
export function applyCellEdit(record, schemaField, value, dateFormat) {
	const trimmed = typeof value === 'string' ? value.trim() : value;
	let converted = trimmed;

	if (isEmpty(trimmed)) {
		converted = undefined;
	} else if (dateFields.has(schemaField)) {
		const date = new Date(trimmed);
		converted = isNaN(date.getTime()) ? trimmed : date;
	} else if (numberFields.has(schemaField)) {
		const number = Number(trimmed);
		converted = Number.isNaN(number) ? trimmed : number;
	}

	setNestedValue(record.data, schemaField, converted);
	record.errors = validateRecord(record.data, dateFormat);
}

// Turn the raw uploaded rows into records to store as draft
export function buildRecords(rows, columnMappings, dateFormat) {
	return rows.map((row) => {
		const data = {};

		// Build the incident object one mapped column at a time
		for (const { fileHeader, schemaField } of columnMappings) {
			// Columns marked "store as custom field" are kept under customFields,
			// keyed by their original header. (Custom fields feature is deferred.)
			if (schemaField === '$custom') {
				(data.customFields ??= {})[fileHeader] = row[fileHeader];
				continue;
			}

			const value = convertCell(schemaField, row[fileHeader], dateFormat);
			if (value !== undefined) setNestedValue(data, schemaField, value);
		}

		// Give the row an id and flag any problems
		return {
			rowId: randomUUID(),
			data,
			errors: validateRecord(data, dateFormat),
		};
	});
}

// Check each record and return a map of the error if any
export function validateRecord(data, dateFormat) {
	const errors = {};

	// Check for empty required fields
	for (const path of requiredFieldPaths) {
		if (isEmpty(getNestedValue(data, path))) errors[path] = 'required';
	}

	// Check if fixed-choice fields has an allowed value
	for (const [field, allowed] of Object.entries(allowedValues)) {
		const value = getNestedValue(data, field);
		if (!isEmpty(value) && !allowed.includes(value)) {
			errors[field] = `must be one of: ${allowed.join(', ')}`;
		}
	}

	// Check if date is a real date
	const date = getNestedValue(data, 'date');
	if (!isEmpty(date) && !(date instanceof Date)) {
		errors.date = `does not match format ${dateFormat}`;
	}

	// Check if number fileds are of type number
	for (const path of numberFields) {
		const value = getNestedValue(data, path);
		if (!isEmpty(value) && typeof value !== 'number')
			errors[path] = 'must be a number';
	}

	return errors;
}
