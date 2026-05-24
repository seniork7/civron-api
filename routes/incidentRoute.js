/**
 * ? Incident routes
 */

import express from 'express';
import validateIncident from '../middleware/joi/incidentValidation.js';
import postIncident from '../controllers/postIncidentsController.js';
import paginate from '../middleware/paginate.js';
import getIncidents from '../controllers/getIncidentsController.js';
import verifyStaff from '../middleware/verifyStaff.js';
import updateIncident from '../controllers/updateIncidentController.js';
import deleteIncident from '../controllers/deleteIncidentController.js';
import getIncident from '../controllers/getIncidentController.js';
import getIncidentMeta from '../controllers/getIncidentMetaController.js';

const router = express.Router();

router.post('/', verifyStaff, validateIncident, postIncident);
router.get('/', paginate, getIncidents);
router.get('/meta', verifyStaff, getIncidentMeta);
router.get('/:id', getIncident);
router.patch('/:id', verifyStaff, updateIncident);
router.delete('/:id', verifyStaff, deleteIncident);

export default router;
