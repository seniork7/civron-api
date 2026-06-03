import { incidentTypes } from '../config/incidentTypes.js';

const getIncidentMeta = (req, res) => {
	res.json({ types: incidentTypes });
};

export default getIncidentMeta;
