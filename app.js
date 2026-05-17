/**
 * ? Root Server File
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import limiter from './middleware/rateLimiter.js';
import connectDB from './database/app_db.js';
import './utils/cron/weatherAlertCron.js';
import routes from './routes/index.js';
import saveWeatherAlerts from './utils/fetchers/alerts/weather/saveWeatherAlerts.js';

dotenv.config();
const port = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOrigin =
	process.env.NODE_ENV === 'production'
		? 'https://safepoint.kevonsenior.com'
		: 'http://localhost:3000';

app.use(
	cors({
		origin: corsOrigin,
		credentials: true,
		methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.use(limiter);
app.use('/api/v1', routes);

connectDB().catch((error) => console.error('Database connection error', error));

app.listen(port, async () => {
	console.log(`App running on port ${port}`);

	// saveWeatherAlerts('startup');
	// console.log(
	// 	`${new Date().toLocaleTimeString()}] Initial weather alerts loaded to DB - server ready!`,
	// );
});
