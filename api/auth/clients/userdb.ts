
import DB from '../connectors/fauna'
import {sendEmail} from '../connectors/mail'
import {User} from '../interfaces'


export default {
    async add(newUser: User) {
        try{
            const res = await DB.add('users', newUser);
            const verifKey = Math.trunc(Math.random()*Math.pow(10, 6))
            const pendingres = await DB.add('pendingusers', {
                email: newUser.email,
                id: newUser.id,
                ver_key: verifKey
            });
            sendEmail(newUser.email, `
            <h3>Welcome to LST!</h3>
            <h5>Here is your 6-digit verification code:</h5>
            <h2>${verifKey}</h2>
            `, {subject: 'Account Verification from LST'})
            console.log("User Generated: %o", res);
        } catch(err){
            throw err;
        }
        
    },

    async verify() {
        findPendingUser
    },

    async getAll(): Promise<User[]> {
        try{
            return await DB.getAll('users');
        } catch(err){
            throw err;
        }
        
    },
    async getAllPending(): Promise<User[]> {
        try{
            return await DB.getAll('pendingusers');
        } catch(err){
            throw err;
        }
        
    },
    async findUser(un: string, callback?: Function): Promise<User|undefined>{
        try{
            un = un.toLowerCase();
            let users = await this.getAll();
            let user: User = <User>users.find(user => user.email === un);
            if(user){
                console.log(`found user ${JSON.stringify(user, null, 2)}`);
            } 
            else{ 
                console.log(`Found no user matching that name`);
                throw new Error('User not found!');
                
            } 
            if(callback) 
                callback(undefined, user)
            return user;
        } catch(err){
            if(callback) callback(err);
            else throw err;
        }
    },
    async findPendingUser(un: string, callback?: Function): Promise<User|undefined>{
        try{
            un = un.toLowerCase();
            let users = await this.getAllPending();
            let user: User = <User>users.find(user => user.email === un);
            if(user){
                console.log(`found user ${JSON.stringify(user, null, 2)}`);
            } 
            else{ 
                console.log(`Found no user matching that name`);
                throw new Error('User not found!');
                
            } 
            if(callback) 
                callback(undefined, user)
            return user;
        } catch(err){
            if(callback) callback(err);
            else throw err;
        }
    },
    async findById(id: string, callback?: Function): Promise<User|undefined>{
        try{
            let users = await this.getAll();
            let user: User = <User>users.find(user => user.id === id);
            if(callback) 
                callback(undefined, user)
            return user;
        } catch(err){
            if(callback) 
                callback(err);
            else 
                throw err;
        }
    },

}
