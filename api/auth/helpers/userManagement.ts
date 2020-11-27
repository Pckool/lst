let randomstring = require("randomstring");
let path = require('path');
let fs = require('fs');
import { DataStorage} from './fs_man'
import { EventEmitter } from 'events';
const {Store, Cookie} = require("express-session");

interface Session {
	id: string;
	data: any;
}
interface Sessions{
	sessions: Array<Session>;
}


export class SessionStorage extends EventEmitter{
	store: DataStorage;
	constructor(){
		super();
		this.store = new DataStorage('sessions');
		console.log('Initializing the session storage...');
		console.log(this.store.get());
		if (!(this.store.get().sessions)){
			console.log('Creating Dynamic Session Array...');
			this.store.set([], 'sessions');
			
		};

		
	}
	destroy(sid, callback){
		try{
			console.log('Destroying a sessions...');
			var storage = this.store.get();
			let session = storage.sessions?.find(session => session.id === sid);
			if (!session) new Error('There was no session found with that id.');
			session = undefined;
			console.log('Session destroyed!')
			this.store.set(storage);
		} catch(err){
			callback(err);
		}
		
	}
	get(sid, callback){
		try {
			console.log('Getting one session...');
			var storage = this.store.get();
			if (!storage) throw new Error('Failed to fetch session storage');
			let session = storage.sessions?.find(session => session.id === sid);
			if (!session) throw new Error('There was no session found with that id.');
			console.log('got session!')
			callback(undefined, session.data);

		} catch (err) {
			callback(err);
		}
	}
	all(callback) {
		try {
			console.log('Getting all sessions...');
			var storage = this.store.get();
			if (!storage) throw new Error('There was no session found.');
			callback(undefined, storage.sessions.map(session => session.data));

		} catch (err) {
			callback(err);
		}
	}
	set(sid, session, callback){
		try{
			console.log('Setting a new session...');
			var storage = this.store.get();
			if (!storage) throw new Error('Failed to fetch session storage');
			let old_session = storage.sessions?.find(_session => _session.id === sid);
			
			let new_session = {
				id: sid,
				data: { ...old_session, ...session }
			};

			if (!old_session) storage.sessions.push(new_session);
			else old_session.data = new_session.data;

			
			this.store.set(storage);
			console.log('session set!');
		} catch(err){
			callback(err);
		}
		
	}
	// touch(sid, session, callback){

	// }
	length(callback){
		try{
			console.log('Getting sessions length...');
			var storage = this.store.get();
			if (!storage) throw new Error('Failed to fetch session storage');
			callback(undefined, storage.sessions.length);
		}
		catch(err) {
			callback(err);
		}
	}
	clear(callback){
		try {
			console.log('Clearing sessions...');
			var storage = this.store.get();
			if (!storage) throw new Error('Failed to fetch session storage');
			storage.sessions = [];
			this.store.set(storage);
		} catch (err) {
			callback(err);
		}
	}
	// createSession(req, sess){
	// 	var expires = sess.cookie.expires
  	// 	var originalMaxAge = sess.cookie.originalMaxAge

  	// 	sess.cookie = new Cookie(sess.cookie);

  	// 	if (typeof expires === 'string') {
    // 		// convert expires to a Date object
    // 		sess.cookie.expires = new Date(expires)
  	// 	}

  	// 	// keep originalMaxAge intact
  	// 	sess.cookie.originalMaxAge = originalMaxAge

  	// 	req.session = new Session(req, sess);
 	// 	return req.session;
	// }
	// load(){

	// }
	// regenerate(){

	// }
}