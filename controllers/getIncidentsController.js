/**
 * ? This file host the logics that hadle public get requests to
 * ? '/incidents' route. It queries the DB based on the
 * ? queries from req.query. If everything is satisfied it
 * ? responds with a json object containing the data
 */

import Incident from '../models/incidentSchema.js';

const getIncidents = async (req, res) => {
	try {
		const { country, type, status, severity } = req.query;

		const filter = Object.fromEntries(
			Object.entries({ country, type, status, severity }).filter(
				([_, value]) => value !== undefined,
			),
		);

		const nextParams = new URLSearchParams({
			...req.query,
			offset: req.offset + req.limit,
			limit: req.limit,
		}).toString();

		const prevParams = new URLSearchParams({
			...req.query,
			offset: req.offset - req.limit,
			limit: req.limit,
		}).toString();

		const total = await Incident.countDocuments(filter);
		const incidents = await Incident.find(filter)
			.skip(req.offset)
			.limit(req.limit)
			.select('-__v')
			.lean();

		if (incidents.length === 0) {
			return res.status(404).json({ message: 'Incident not found!' });
		}

		res.json({
			previous:
				req.offset > 0
					? `${process.env.BASE_URL}/api/v1/incidents?${prevParams}`
					: null,
			total,
			filters: filter,
			next:
				req.offset + req.limit < total
					? `${process.env.BASE_URL}/api/v1/incidents?${nextParams}`
					: null,
			data: incidents,
			disclaimer:
				'Please do your due diligence to verify the data before use.',
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default getIncidents;
