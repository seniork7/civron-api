import { INCIDENT_TYPES } from '../config/incidentTypes.js';

const getIncidentMeta = (req, res) => {
	res.json({ types: INCIDENT_TYPES });
};

export default getIncidentMeta;
