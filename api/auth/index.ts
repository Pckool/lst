console.log(process.env.NODE_ENV)

require('dotenv').config();
import {Router, Express} from 'express';
const router = Router();
const Nonce = require('nonce-fast');
// import { SessionStorage} from './userManagement';


import {passport, hashPass} from './helpers/authentication';
import {sendEmail} from '../connectors/mail';

const randomString = require('crypto-random-string');

var bodyParser = require('body-parser');


import Log from '../logger';
import UDB from '../clients/userdb';
import {User} from '../interfaces';

var session = require('express-session');
const redis = require('redis')

// let RedisStore = require('connect-redis')(session)
// let redisClient = redis.createClient()

const nonce = Nonce(34);



function authInit(app: Express){
	app.use(session({
        secret: process.env.SESSION_SECRET,
        cookie: { 
            maxAge: 24*60*60*1000, 
            sameSite: 'none', 
            secure: true 
        },
        // rolling: true,
        // store: new RedisStore({ client: redisClient }),
        saveUninitialized: false,
        resave: false,
    }))
    app.use(passport.initialize());
	app.use(passport.session());
	
	router.post('/create', async (req: any, res: any) => {
		let user: User|null = null
		try{
			Log.info('checking if the user exists...');
			let email = req.body.username.toLowerCase();

			try{
				let existingUser = await UDB.findUser(email)
				if(existingUser) return res.status(409).json(new Error("User with that email already exists."));
			} catch(err) {
				Log.info('User does not exist; Adding to db...');
			}
			Log.info('Generating user...');
			// if we get here, the user is not in the database
			let hashObj = await hashPass(req.body.pass);
			Log.info('Password hashed...');
			// if (err) throw err;
			user = {
				email,
				name: req.body.name,
				number: req.body.number,
				credentials: {
					password: hashObj.hash,
				},
				verified: false,
				ts: Date.now(),
				id: `${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 12)}`,
				namespaces: req.body.namespaces||[],
			}
			Log.info('User generated...');
			
			await UDB.add(user);

			Log.info('User added to DB...');

			res.status(200).send(`Successfully added user ${user.email}!`);
				
			Log.info(`user ${user.email} successfully generated!`);
			
		} catch(err){
			Log.error("Error when trying to create user "+JSON.stringify(user, null, 2))
			res.status(500).json(err);
		}
	});

	router.post('/login', passport.authenticate('local'), async (req: any, res: any) => {
		
		Log.info('Login request for user'+req.body.username);
		let user = await UDB.findUser(req.body.username.toLowerCase())
		if (user) {
			try{
				// let login = util.promisify(req.login)
				// await login(user);
				req.login(user, err => {
					if(err) return res.sendStatus(400);
					if(!user) return res.sendStatus(400);
					res.status(200).json({
						user: {
							name: user.name,
							email: user.email,
							id: user.id,
							verified: user.verified,
							// pf_picture: user.img_url
						},
						namespaces: user.namespaces,
					});
					Log.info(`${user.name} Logged in with details...`);
				})
				
				// req.login(user, err => {
				// 	if(err) return res.status(400);
					
				// })
				
			}
			catch(err){
				res.status(400);
			}
		} else {
		// if we reach here, that means that the user is not in the "database"
			res.status(400).json({
				status: "failed",
				message: "You don't exist."
			});
			Log.info('User '+req.body.username+" doesn't exist.")
		}
	});

	router.post('/update', async (req: any, res: any) => {
		try{
			await UDB.update(req.body.id, req.body)
			// let login = util.promisify(req.login)
			// await login(user);
			
			res.sendStatus(200)
			// req.login(user, err => {
			// 	if(err) return res.status(400);
				
			// })
			
		}
		catch(err){
			console.error(err)
			res.status(400).send(err);
		}

	});

	router.post('/verify', async (req, res) => {
		try{
			let user = await UDB.findUser(req.body.username.toLowerCase());
			const veriStat = await UDB.verify(req.body.username.toLowerCase(), req.body.code);

			if(veriStat) {
				user.verified = true;
				UDB.update(user._id, {verified: user.verified})
			}

			res.status(veriStat ? 200 : 400).json({
				name: user.name,
				email: user.email,
				id: user.id,
				verified: user.verified,
			})
			
		}catch(err){
			res.status(400).send(err.message);
		}
	})

	router.post('/verify-redo', async (req, res) => {
		try{
			let user = await UDB.findUser(req.body.username.toLowerCase());
			await UDB.addVerif(user);

			res.sendStatus(200);
			
		}catch(err){
			res.status(400).send(err.message);
		}
	})

	router.post('/logout', async (req: any, res: any) => {
		
		Log.info('Logout request for user'+req.user);
		// let user = await UDB.findUser(req.body.username.toLowerCase());

		// if (user) {
			try{
				// let login = util.promisify(req.login)
				// await login(user);
				req.logout();
				// res
				res.sendStatus(200);
				
			}
			catch(err){
				res.sendStatus(400);
			}
		// } else {
		// // if we reach here, that means that the user is not in the "database"
		// 	res.status(400).json({
		// 		status: "failed",
		// 		message: "You don't exist."
		// 	});
		// 	Log.info('User '+req.body.username+" doesn't exist.")
		// }
	});


	router.get('/get', (req: any, res: any) => {
		try{
			let users = UDB.getAll()
			return res.status(200).json(users);
		}
		catch(err){
			return res.status(500).json(err);
		}
		
	});

	router.post('/forgot_pass', (req: any, res: any) => {
		if (!req.body.email) return res.status(400).statusMessage('You did not provide an email');

		try {
			var reset_key = randomString({
				length: 15,
				type: 'url-safe'
			})
			

			
			let message = `<div><h2>Your Requested Password Change</h2><p>If you did not request for your password to be changed, change your password <u>immediately</u>!</p><a href="https://loxly.co/reset/pass/${reset_key}">Click here</a><p>Enjoy your day!</p></div>`;
			sendEmail(req.body.email, message, {
				subject: 'Loxly: Password Reset'
			}).then(() => {
				res.sendStatus(200);
			})

		} catch(err){
			return res.status(500).json(err);
		};
	});
	router.post('/new_pass', (req: any, res: any) => {
		try {

		} catch(err){
			Log.error(err);
		}
	})
	router.post('/auth', async (req, res) => {
		// console.log(req.session)
		Log.info('Someone is attempting to authenticate their session...')
		let status: number|undefined = undefined;
		let payload: any = {};
		try{
			// let person = await UDB.findUser(req.body.username?.toLowerCase());
			// req.session.touch();
			
			// @ts-ignore
			if(req.isAuthenticated()){
				payload = { message: 'Good to go!'}
				status = 200;
				// @ts-ignore
				Log.info('Authentication success! Welcome '+req.user.email)
			}
			else{
				console.log("someone tried to auth and it didn't work...") 
				status = 400;
				payload = {status, message: 'Your session has not been stored. (unauthenticated)'}
			}
		} catch(err){
			status = 500;
			payload = {status, error: err}
			
		} finally {
			res.status(status||202).json(payload);
		}
	});
	return router;
}



export default router;
export {
	authInit
}

