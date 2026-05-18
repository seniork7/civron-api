# Civron

A multi-tenant public safety data platform that enables government agencies to upload, manage, and expose structured safety data through a unified REST API.

> **Status:** In active development. Agency auth, incident pipeline, and manual input ingestion are live. CSV ingestion pipeline in progress.

---

## Why this exists

I spent six years as a firefighter in Jamaica before transitioning to tech in Canada. On both sides I kept running into the same problem: public safety information exists, but it's scattered, inconsistent, and impossible to work with programmatically.

In Canada, data is spread across federal and provincial agencies with no unified access layer. In Jamaica and across the Caribbean, the problem is worse - many agencies have no structured data infrastructure at all. Reports are handwritten, filed in spreadsheets, or buried in PDFs on government websites.

Civron solves this at the source. Instead of scraping and normalizing data from the outside, Civron gives agencies the tools to upload their own data in whatever format they have, CSV exports, manual dashboard entries - and normalizes everything into a consistent schema behind a single REST API. The result is reliable, queryable, multi-agency safety data that developers can actually build on.

---

## How it works

Civron is a B2G (business-to-government) platform with three layers:

**Agency layer** - Government agencies log into a dashboard and submit safety data via CSV upload or manual input. Each agency's data is normalized, validated, and stored under their account.

**Data layer** - All submitted data is normalized into consistent schemas, tagged by agency and country, and stored in a shared multi-tenant MongoDB database. Agencies can only access and manage their own data.

**API layer** - Any developer or citizen can query the public REST API to retrieve safety data by content type, country, incident type, severity, status, and more.

---

## Tech stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT via httpOnly cookies
- **Validation:** Joi
- **File ingestion:** Multer, csv-parse
- **Scheduling:** node-cron
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Hosting:** Render (API), Vercel (frontend)

---

## Architecture

### Multi-tenancy

All data lives in a shared database. Every document is tagged with `orgID` and `country` at the point of ingestion - enforced server-side from the verified JWT. Agencies can only read, update, or delete their own records.

### Ingestion methods (MVP)

| Method       | Description                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Manual input | Schema-driven dashboard form with dropdowns, date pickers, and validated text fields            |
| CSV upload   | File upload with agency-defined column mapping templates and exception queue for unknown values |

PDF ingestion and AI-assisted normalization are planned for v2.

### Template system (CSV)

When an agency uploads a CSV for the first time, they map their column names to Civron's standard fields and define value mappings for enum fields (e.g. "KGN" → Kingston). That template is saved and applied automatically to every future upload from that agency. Unknown values that don't match a saved mapping are routed to an exception queue for the agency to resolve - resolutions are added to the template automatically.

### Duplicate detection

Incidents are checked against a time window before saving. The window varies by incident type - a hurricane has a 72 hour window, a robbery has 2 hours. If a potential duplicate is detected the submission returns a 409 with the existing record. Agency staff can review and force-submit if it's a genuine new incident.

### Endpoint structure

```js
GET    /v1/incidents?country=Jamaica&type=robbery&severity=high
GET    /v1/incidents/:id
POST   /v1/incidents         (protected - agency staff only)
PATCH  /v1/incidents/:id     (protected - agency staff only)
DELETE /v1/incidents/:id     (protected - agency staff only)
```

### Project structure

```
civron-api/
├── config/
│   └── duplicateWindows.js
├── controllers/
├── middleware/
│   ├── joi/
│   ├── paginate.js
│   └── verifyStaff.js
├── models/
├── routes/
└── utils/
    ├── cron/
    ├── fetchers/
    └── transformers/
```

---

## User types

| User         | Access                                                             |
| ------------ | ------------------------------------------------------------------ |
| Agency staff | Dashboard login, data upload, template management, exception queue |
| Developers   | Public API access, API docs                                        |
| Public       | Public homepage with safety stats                                  |

---

## What's built

- Organization and OrgUser schemas with JWT auth
- Agency login, verifyStaff middleware
- Incident schema with full enum validation, compound indexes, and duplicate detection
- Joi validation middleware per content type
- Manual input pipeline - POST, GET list, GET single, PATCH, DELETE
- Pagination middleware - limit, offset, next/previous links

---

## Roadmap

### MVP (in progress)

- CSV ingestion pipeline - Multer, csv-parse, template system, exception queue
- Remaining content type pipelines
- Agency dashboard frontend
- Public homepage with live safety stats
- API documentation site

---

## Sample response

`GET /v1/incidents?country=Jamaica&type=robbery&severity=high&limit=1`

```json
{
	"previous": null,
	"total": 12,
	"filters": { "country": "Jamaica", "type": "robbery", "severity": "high" },
	"next": "https://api.civron.io/v1/incidents?country=Jamaica&type=robbery&severity=high&offset=1&limit=1",
	"data": [
		{
			"country": "Jamaica",
			"location": {
				"state": "Kingston",
				"address": "Seaview Gardens, Kingston 11"
			},
			"date": "2026-05-13T00:00:00.000Z",
			"details": "Armed robbery reported outside a local supermarket",
			"type": "robbery",
			"severity": "high",
			"status": "ongoing",
			"warnings": ["Area is considered dangerous", "Avoid the location"],
			"reportedBy": "Citizen report",
			"source": {
				"name": "JCF Kingston Division",
				"url": "https://jcf.gov.jm"
			},
			"evidence": [],
			"createdAt": "2026-05-13T20:36:15.592Z",
			"updatedAt": "2026-05-13T20:36:15.592Z"
		}
	],
	"disclaimer": "This data was pulled from JCF Kingston Division database, please do your due diligence to verify the data before use."
}
```

---

## Deployment

- **API:** [`api.civron.io`](https://api.civron.io) - Render
- **DNS:** Configured through Namecheap
