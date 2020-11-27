import faunadb from 'faunadb';

class Fauna {
    secret: string;
    q: any;
    client: any;
    constructor(){
        this.q = faunadb.query;
        this.secret = (process.env.NODE_ENV==="production"?process.env.FAUNADB_SECRET:process.env.FAUNA_DEV_SECRET)||'';
        this.client = new faunadb.Client({secret: this.secret});
    }
    async add(collectionName:string, data: any) {
        try{
            let res = await this.client.query(
                this.q.Create(this.q.Collection(collectionName), {data})
            )
            
        } catch(err){
            throw err;
        }
        
    }
    
    async delete(collectionName:string, id: any) {
        try{
            let res = await this.client.query(
                this.q.Delete(this.q.Ref(this.q.Collection(collectionName), id))
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
    async getAll (collectionName: string): Promise<any[]> {
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
    async getOne (collectionName: string): Promise<any[]> {
        try{
            let page = (await this.client.query(
                this.q.Paginate(this.q.Documents(this.q.Collection(collectionName))) // @ts-ignore
            )).data
            
            let ret: any[] = (await this.client.query(
                page.map((document) => this.q.Get(document)) // this wraps all of the document refs in a get function
            ))

            return <any[]>ret.map((dataObj) => dataObj.data) // flattens the array to only have the data
        } catch(err){
            throw err;
        }
        
    }
}
export default new Fauna();