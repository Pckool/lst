
import { Task } from '~/core';
import DB from '../connectors/fauna'
import {} from '../interfaces'


export default {
    async add(newTask: Task) {
        try{
            let res = await DB.add('tasks', newTask);
            console.log("Task Generated: %o", res);
            return res;
        } catch(err){
            throw err;
        }
        
    },

    async getUserTasks(userId: string): Promise<Task[]> {
        try{
            return await DB.useIndexGetDocs('tasks_by_owner', userId);
        } catch(err){
            throw err;
        }
        
    },

    async remove(task: Task) {
        try{
            if(!task._id){
                task = await DB.useIndexGetDocs<Task[]>('task_by_id', task.id)[0];
            }
            await DB.delete('tasks', task._id);
            return;
        } catch(err){
            throw err;
        }
        
    },

    async update(_id: string, data: any) {
        try{
            const res = await DB.update('tasks', _id, data);
        } catch(err){
            throw err;
        }
        
    },

    async findTask(un: string, callback?: Function): Promise<Task|undefined>{
        try{
            un = un.toLowerCase();
            let tasks = await this.getAll();
            let task: Task = <Task>tasks.find(task => task.email === un);
            if(task){
                console.log(`found task ${JSON.stringify(task, null, 2)}`);
            } 
            else{ 
                console.log(`Found no task matching that name`);
                throw new Error('Task not found!');
                
            } 
            if(callback) 
                callback(undefined, task)
            return task;
        } catch(err){
            if(callback) callback(err);
            else throw err;
        }
    },
    async findById(id: string, callback?: Function): Promise<Task|undefined>{
        try{
            let tasks = await this.getAll();
            let task: Task = <Task>tasks.find(task => task.id === id);
            if(callback) 
                callback(undefined, task)
            return task;
        } catch(err){
            if(callback) 
                callback(err);
            else 
                throw err;
        }
    },

}
