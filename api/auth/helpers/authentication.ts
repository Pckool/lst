import passport from 'passport';
import LocalStrategy from 'passport-local';
import UDB from '../../clients/userdb';
import {User} from '../../interfaces';
const bcrypt = require('bcrypt');
passport.use(
	new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	},
	function(username, password, done) {
		UDB.findUser(username, function (err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }

			if (!verify(password, user.credentials.pass)) { return done(null, false); }
			return done(null, user);
		});
	}
));

async function verify(password, hash){
	let stat;
	try{
		stat = await bcrypt.compare(password, hash);
		return;
	} catch (err) {
		return err;
	};

}

type Password = string|number; // eventually make a way to ensure the password meets security standards (probably a client side thing too)
interface hashObj {
	hash: string;
	salt?: string;
}
async function hashPass(pass: Password): Promise<hashObj>{
	let saltRounds = 12;
	let id=Date.now()
	console.time('passwordHash-'+id);
	try{
		let salt = await bcrypt.genSalt(saltRounds);

		let hash = await bcrypt.hash(pass, salt);
		console.timeLog('passwordHash-'+id);
		return {hash};
	} catch(err) {
		console.error(err)
		throw err;
	} finally{
		console.timeEnd('passwordHash-'+id);
	}
	
}
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	UDB.findById(id, function (err, user) {
		if (err) { 
			console.error(err);
			return done(err); 
		}
		done(null, user);
	});
});
export {passport, hashPass, verify}