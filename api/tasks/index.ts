console.log(process.env.NODE_ENV)

require('dotenv').config();
import {Router, Express} from 'express';
const router = Router();
const Nonce = require('nonce-fast');
// import { SessionStorage} from './userManagement';

const randomString = require('crypto-random-string');

var bodyParser = require('body-parser');


import Log from '../logger';
import TDB from './../clients/tasks';


// let RedisStore = require('connect-redis')(session)
// let redisClient = redis.createClient()

const nonce = Nonce(34);



function tasksInit(app: Express){
	
	router.post('/add', async (req: any, res: any) => {
		let task;
		try{
			Log.info('checking if the user exists...');
			
			// if (err) throw err;
			task = {
				text: req.body.text,
				ts: req.body.ts,
				tag: req.body.tag,
				owner: req.body.owner,
				created: Date.now(),
				id: `${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 12)}`,
			}
			Log.info('Task generated...');
			
			await TDB.add(task);

			Log.info('Task added to DB...');

			res.status(200).json(task);
				
			Log.info(`Task successfully generated!`);
			
		} catch(err){
			Log.error("Error when trying to create user "+JSON.stringify(task, null, 2))
			res.status(500).json(err);
		}

		try{
			let recipients = '';
			// (await UDB.getAll()).forEach((el:any) => {
			// 	if (el.level > 2) recipients = `${recipients}${el.email};`
			// })
			// if(!recipients || recipients === '') return;
			// sendEmail(recipients, `<p>A new person has signed up for your Loxly instance!</p> 
			// 	<p>Name: <b>${user.name}</b></p>
			// 	<p>Email: <b>${user.email}</b></p>
			// 	<p>If you recognize this person as an employee, please use the staff page on your Loxly instance to promote them to a higher clearance level!`, {
			// 	subject: 'A new Account was Created! Please Verify.'
			// })
		} catch(err){
			Log.error(err);
			res.status(500).json(err);
		}
	});


	router.post('/getall', async (req: any, res: any) => {
		try{
			const userId = req.body.id;
			
			const tasks = await TDB.getUserTasks(userId)
			return res.status(200).json(tasks);
		}
		catch(err){
			return res.status(500).json(err);
		}
		
	});

	
	return router;
}



export default router;
export {
	tasksInit
}

