/**
 * ? Index route file that mountes the api routes
 */

import express from 'express';
import indexController from '../controllers/indexController.js';
import authRoutes from './authRoute.js';
import tipsRoutes from './tipsRoute.js';
import resourcesRoutes from './resourcesRoute.js';
import recallsRoutes from './recallsRoute.js';
import alertsRoutes from './alertsRoute.js';
import incidentRoutes from './incidentRoute.js';

const router = express.Router();

router.get('/', indexController);
router.use('/auth', authRoutes);
router.use('/incidents', incidentRoutes);
// router.use('/tips', tipsRoutes);
// router.use('/resources', resourcesRoutes);
// router.use('/recalls', recallsRoutes);
// router.use('/alerts', alertsRoutes);

export default router;
