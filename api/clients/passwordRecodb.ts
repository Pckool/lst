
import DB from '../connectors/fauna';
import {PasswdRecoObj, userID} from '../interfaces'

export default {
    add: async (newReco: PasswdRecoObj) => {
        try{
            await DB.add('password-recovery', newReco);
        } catch(err){
            throw err;
        }
        
    },
    getAll: async (): Promise<PasswdRecoObj[]> => {
        try{
            return await DB.getAll('password-recovery')
        } catch(err){
            throw err;
        }
        
    },
    async findById(uid: userID, callback?: Function): Promise<PasswdRecoObj|undefined>{
        try{
            let users = await this.getAll();
            let user: PasswdRecoObj = <PasswdRecoObj>users.find(passreco => passreco.uid === uid);
            if(callback) callback(undefined, user)
            else return user;
        } catch(err){
            if(callback) callback(err);
            else throw err;
        }
    }
}