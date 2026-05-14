/**
 * ? This file host the logics that hadle get requests to
 * ? '/:id' route. It queries the DB using a single incident
 * ? id to find that specific incident
 */

import Incident from '../models/incidentSchema.js';

const getIncident = async (req, res) => {
	try {
		const incident = await Incident.findById(req.params.id)
			.select('-__v -createdBy -orgID')
			.lean();

		if (!incident) {
			return res.status(404).json({ message: 'Incident not found' });
		}

		res.json({
			data: incident,
			disclaimer: `This data was pulled from ${incident.source.name} database, please do your due diligence to verify the data before use.`,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default getIncident;
