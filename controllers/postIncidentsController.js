/**
 * ? This file host the logics that hadle post requests to the /incidents route
 */

import Incident from '../models/incidentSchema.js';
import { duplicateWindows } from '../config/duplicateWindows.js';

const postIncident = async (req, res) => {
	try {
		const { force } = req.body;
		const { orgID, country, id } = req.staff;
		const {
			location,
			date,
			details,
			type,
			status,
			severity,
			warnings,
			reportedBy,
			source,
			evidence,
		} = req.body;

		const window = duplicateWindows[type] || duplicateWindows.other;
		const windowStart = new Date(Date.now() - window);

		if (!force) {
			const duplicate = await Incident.findOne({
				orgID,
				type,
				'location.state': location.state,
				date: { $gte: windowStart },
			});

			if (duplicate) {
				return res
					.status(409)
					.json({
						message:
							'A similar incident was recently reported. Possible duplicate.',
						existing: duplicate,
					});
			}
		}

		const incident = await Incident.create({
			orgID,
			country,
			location,
			date,
			details,
			type,
			severity,
			status,
			warnings,
			createdBy: id,
			reportedBy,
			source,
			evidence,
		});

		res.status(201).json({
			message: 'Incident created successfully',
			data: incident,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

export default postIncident;
