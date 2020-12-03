import faunadb, { Client, ExprArg, QueryOptions } from 'faunadb';
import { Task } from '~/core';
interface Query {
    Create: (collection: any, data: any) => (ExprArg);
    Collection: (name: string) => (ExprArg);
    Delete: (name: string) => (ExprArg);
}
class Fauna {
    secret: string;
    q: any;
    client: Client;
    constructor(){
        this.q = faunadb.query;
        this.secret = (process.env.NODE_ENV==="production"?process.env.FAUNADB_SECRET:process.env.FAUNA_DEV_SECRET)||'';
        this.client = new faunadb.Client({secret: this.secret});
    }
    async add(collectionName:string, data: any) {
        try{
            let res: any = await this.client.query(
                this.q.Create(this.q.Collection(collectionName), {data})
            )
            if(res.data){
                return {...res.data, _id: res.ref.id};
            }
            
            
        } catch(err){
            throw err;
        }
        
    }
    
    async delete(collectionName:string, _id: any) {
        try{
            await this.client.query(
                this.q.Delete(this.q.Ref(this.q.Collection(collectionName), _id))
            )
            
        } catch(err){
            throw err;
        }
        
    }

    async update(collectionName:string, _id: string, data: any) {
        try{
            let res = await this.client.query(
                this.q.Update(this.q.Ref(this.q.Collection(collectionName), _id), {data})
            )
            
        } catch(err){
            throw err;
        }
        
    }
    async getAll <T>(collectionName: string): Promise<T[]> {
        try{
            let page = (await this.client.query(
                this.q.Paginate(this.q.Documents(this.q.Collection(collectionName))) // @ts-ignore
            )).data
            
            let ret: any[] = (await this.client.query(
                page.map((document) => this.q.Get(document)) // this wraps all of the document refs in a get function
            ))

            return <any[]>ret.map((dataObj) => ({...dataObj.data, _id: dataObj.ref.id})) // flattens the array to only have the data
        } catch(err){
            throw err;
        }
        
    }
    async getOne <T>(collectionName: string, id: string): Promise<T[]> {
        try{
            let page = (await this.client.query(
                this.q.Map(
                    this.q.Paginate(this.q.Documents(this.q.Collection(collectionName))),
                    (data) => {
                        this.q.Get(data)
                    } 
                )
                // @ts-ignore
            ))?.data

            return <any[]>page.map((dataObj) => ({...dataObj.data, _id: dataObj.ref.id})) // flattens the array to only have the data
        } catch(err){
            throw err;
        }
        
    }
    async useIndex <T>(indexName: string, terms?: Array<string>|string): Promise<T[]> {
        try{
            const page = (await this.client.query(
                this.q.Paginate(this.q.Match(this.q.Index(indexName), terms)) // @ts-ignore
            )).data
            
            

            return <any[]>page // flattens the array to only have the data
        } catch(err){
            throw err;
        }
        
    }
    async useIndexGetDocs <T>(indexName: string, terms?: Array<string>|string): Promise<T[]> {
        try{
            const pageOfDocs: any = (await this.client.query(
                this.q.Map(
                    this.q.Paginate(this.q.Match(this.q.Index(indexName), terms)),
                    this.q.Lambda((data) => this.q.Get(this.q.Var('data')))
                )
            ))
            
            if(Array.isArray(pageOfDocs.data)){
                const result = <T[]>pageOfDocs.data.map((dataObj) => ({...dataObj.data, _id: dataObj.ref.id})) // flattens the array to only have the data
                return result
            }
            else{
                return;
            }

            
        } catch(err){
            throw err;
        }
        
    }
}
export default new Fauna();