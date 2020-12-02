
import DB from '../connectors/fauna'
import {sendEmail} from '../connectors/mail'
import {User, PendingUser} from '../interfaces'


export default {
    async add(newUser: User) {
        try{
            const res = await DB.add('users', newUser);
            await this.addVerif(newUser);
            console.log("User Generated: %o", res);
            
        } catch(err){
            throw err;
        }
        
    },

    async addVerif(user: User): Promise<{email: string, id: string, ver_key: string}> {
        try{
            try{
                const res: PendingUser = await this.findPendingUser(user.email);
                if(res){
                    await DB.delete('pendingusers', res._id)
                }
            }
            catch(err){
                console.log('...')
            }
            

            const verifKey = Math.trunc(Math.random()*Math.pow(10, 6))
            const pendingUser = {
                email: user.email,
                id: user.id,
                ver_key: `${verifKey}`.padStart(6, '0')
            }
            const pendingres = await DB.add('pendingusers', pendingUser);
            sendEmail(user.email, `
            <h3>Welcome to LST!</h3>
            <h5>Here is your 6-digit verification code:</h5>
            <h2>${verifKey}</h2>
            `, {subject: 'Account Verification from LST'})
            
            return pendingUser;
        } catch(err){
            throw err
        }
        
    },

    async remove(username: string) {
        try{
            const res = await DB.delete('users', username);
        } catch(err){
            throw err;
        }
        
    },
    async update(_id: string, data: any) {
        try{
            console.log(`searching for %s in db...`, _id)
            // const user = (await DB.useIndexGetDocs<User>('find_by_id', _id))[0];
            const res = await DB.update('users', _id, data);
            return res
        } catch(err){
            throw err;
        }
        
    },

    async verify(email: string, codeAttempt: string): Promise<boolean> {
        try{
            let status = false;
            const res: PendingUser = await this.findPendingUser(email);
            
            status = Number(res.ver_key) === Number(codeAttempt);

            if(status){
                // they entered the right code
                DB.delete('pendingusers', res._id)
            }
            return status;
        } catch(err){
            console.error(err)
            throw err;
        }
        
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
            let user: User = <User>users.find(user => user.email.toLowerCase() === un);
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

    async findPendingUser(un: string, callback?: Function): Promise<PendingUser|undefined>{
        try{
            un = un.toLowerCase();
            let users = await this.getAllPending();
            let user: PendingUser = <PendingUser>users.find(user => user.email === un);
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
