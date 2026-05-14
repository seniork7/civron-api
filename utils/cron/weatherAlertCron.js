/**
 *  ? This file serves the purpose of scheduling node-cron to
 *  ? automatically make fetch request and update the weather
 *  ? alerts in the DB.
 */

import cron from 'node-cron';
import saveWeatherAlerts from '../fetchers/alerts/weather/saveWeatherAlerts.js';

// cron.schedule('0 * * *  *', async () => {
// 	saveWeatherAlerts('cron');
// });
