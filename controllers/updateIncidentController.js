/**
 * ? This file host the logics that hadle update requests to
 * ? '/:id' route. It queries the DB based on the incident id in req.body
 */

import Incident from '../models/incidentSchema.js';

const updateIncident = async (req, res) => {
	try {
		const incident = await Incident.findOneAndUpdate(
			{ _id: req.params.id, orgID: req.staff.orgID },
			{ $set: req.body },
			{ returnDocument: 'after', runValidators: true },
		)
			.select('-__v')
			.lean();

		if (!incident) {
			return res.status(404).json({ message: 'Incident not found' });
		}

		res.json({ message: 'Incident updated successfully', data: incident });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default updateIncident;
