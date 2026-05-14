/**
 * ? This file host the logics that hadle delete requests to
 * ? '/:id' route. It queries the DB based on the incident id in req.body
 */

import Incident from '../models/incidentSchema.js';

const deleteIncident = async (req, res) => {
	try {
		const incident = await Incident.findOneAndDelete({
			_id: req.params.id,
			orgID: req.staff.orgID,
		});

		if (!incident) {
			return res.status(404).json({ message: 'Incident not found' });
		}

		res.json({ message: 'Incident deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export default deleteIncident;
