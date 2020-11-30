import express from 'express'
const app = express();
const { loadNuxt, build } = require('nuxt');
const consola = require('consola')
import {authInit} from './auth'
import {tasksInit} from './tasks'
const cors = require('cors');
const cookieParser = require('cookie-parser');
import Log from './logger';

let ORIGIN = '';
const whitelist = [
	
];
const corsOptions = {
	origin(origin: any, callback: any) {
		Log.info("Origin: "+origin);
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			ORIGIN = origin;
			Log.info("Request accepted...");
			callback(undefined, true)
		} else {
			Log.info("Request rejected...");
			callback(new Error('Not allowed by CORS.'))
		}
	},
	credentials: true
}


    
app.set('trust proxy', 1) // trust first proxy
app.use(cors());
app.use(cookieParser());
// app.use(express.bodyParser({limit: '50mb'}));
app.use(express.json({
	limit: '2mb',
})); // for parsing application/json
app.use(express.urlencoded({
	extended: true,
	limit: '2mb'
})); // for parsing application/x-www-form-urlencoded

// custom routes
const authRoutes = authInit(app);
const taskRoutes = tasksInit(app);
app.use('/user', authRoutes)
app.use('/task', taskRoutes)
// Init Nuxt.js
const isDev = process.env.NODE_ENV !== 'production';
console.log("is dev?", isDev);

// Listen the server
export default app;

	
	
