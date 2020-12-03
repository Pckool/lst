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
			Log.info('checking if the task exists...');
			
			// if (err) throw err;
			task = {
				...req.body,
				created: Date.now(),
				id: `${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 12)}`,
			}
			Log.info('Task generated...');
			
			const newTask = await TDB.add(task);

			Log.info('Task added to DB...');

			res.status(200).json(newTask||task);
				
			Log.info(`Task successfully generated!`);
			
		} catch(err){
			Log.error("Error when trying to create task "+JSON.stringify(task, null, 2))
			res.status(500).json(err);
		}
	});

	router.post('/remove', async (req: any, res: any) => {
		let task;
		try{
			Log.info('checking if the user exists...');
			
			// if (err) throw err;
			task = {
				...req.body,
			}
			
			await TDB.remove(task);

			Log.info('Task removed from DB...');

			res.sendStatus(200);
			
		} catch(err){
			Log.error("Error when trying to delete task "+JSON.stringify(task, null, 2))
			res.status(400).json(err);
		}
	});


	router.post('/getall', async (req: any, res: any) => {
		try{
			const userId = req.body.id;
			
			const tasks = await TDB.getUserTasks(userId)
			res.status(200).json(tasks);
		}
		catch(err){
			console.error(err)
			res.status(500).json(err);
		}
		
	});

	router.post('/update', async (req: any, res: any) => {
		try{
			const taskId = req.body._id;
			let task = req.body;
			delete task._id;
			
			const tasks = await TDB.update(taskId, task)
			res.status(200).json(task);
		}
		catch(err){
			console.error(err)
			res.status(500).json(err);
		}
		
	});

	
	return router;
}



export default router;
export {
	tasksInit
}

