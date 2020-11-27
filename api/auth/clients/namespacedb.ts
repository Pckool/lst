
import DB from '../connectors/fauna';
import {Namespace, namespaceID} from '../interfaces'
// const q = faunadb.query;
// const client = new faunadb.Client({secret: process.env.FAUNADB_SECRET||''});

export default {
    add: async (newNS: Namespace) => {
        try{
            await DB.add('namespaces', newNS);
        } catch(err){
            throw err;
        }
        
    },
    getAll: async (): Promise<Namespace[]> => {
        try{
            return await DB.getAll('namespaces')
        } catch(err){
            throw err;
        }
        
    },
    async findById(id: namespaceID, callback?: Function): Promise<Namespace|undefined>{
        try{
            let users = await this.getAll();
            let user: Namespace = <Namespace>users.find(namespace => namespace.id === id);
            if(callback) callback(undefined, user)
            else return user;
        } catch(err){
            if(callback) callback(err);
            else throw err;
        }
    }
}