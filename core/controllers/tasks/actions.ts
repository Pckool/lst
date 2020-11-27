import {collection, state} from './state';
import routes from '../../api/api.tasks';
import {PendingTask, Task} from '../../interfaces';
import dayjs from 'dayjs'
dayjs().format()
export const actions = {
	add(task: PendingTask) {
		return new Promise((resolve, reject) => {
			// send the new coupon to the database

			routes.add(task).then((res:any) => {
				// collect the new coupon
				collection.collect(res.data, 'all');
				resolve(res.data);
			}).catch(err => {
				reject(err)
			});
		})
	},
	del(task: Task) {
		return new Promise((resolve, reject) => {
			// send the new coupon to the database
			routes.remove(task).then(res => {

				// console.log('Deleting' + task.id);
				collection.removeFromGroups(task.id, 'all');
				resolve(res);
			}).catch(err => {


				reject(err)
			});
		})
	},
	change(task: Task) {
		return new Promise((resolve, reject) => {
			// send the new coupon to the database
			routes.change(task).then((res:any) => {

				// console.log('real task');
				// console.log(task)

				collection.collect(task, 'all');

				resolve(res);
			}).catch(err => {

				reject(err)
			});
		})
	},
	async update(task: Task): Promise<Error|undefined> {
		try{
			// send the new coupon to the database
			await routes.change(task)

			collection.collect(task, 'all');

			// return res;
		} catch(err) {
			return err
		};
		
	},
	get(id:string|number) {
		let task = collection.findById(id);
		// task = Array.isArray(taskArr) && taskArr.length > 0 ? taskArr[0] : {};
		// console.log(task);

		return task.value;
	},
	getGroup(group_name: string){
		return collection.getGroup(group_name).output;
	},

	
	findTask(id: string) {
		return collection.findById(id);
	},
	findByDate(_date: string|number): Task[]|undefined{
		try{
			let date = new Date(_date);
			return collection.getGroup('all').output.filter(task => dayjs(task.ts).isSame(date, 'date'));
		} catch(err){

		}
		

	},
	load() {
		return new Promise((resolve, reject) => {
			routes.getAll().catch(err => {
				reject(err);
			}).then(res => {
				console.log('got all tasks.');
				collection.collect(res.data, 'all');
				resolve(undefined);
			}).catch(err => {
				reject(err);
			});
		});
	},
	length: () => collection.getGroup('all').value.length,
	addData(data: any) {
		
		state.pending.set({
			...state.pending.value,
			...data
		})
	},
	getProp(prop: string){
		return state.pending.bind[prop];
	},
	setProp(prop:string, value:any){
		state.pending.bind[prop] = value;
	},
	getTask(){
		return state.pending.value;
	},
	clear(){
		state.pending.set({});
	},
	clearPending(){
		this.clear();
	},
	createTask(task?){
		return new Promise( (resolve, reject) => {
			this.add(this.getTask()).then( res => {
				console.log(res);
				resolve(res);
				
			}).catch( err => {
				console.log(err);
				reject(err);
			});
		});
		
	},
}

export default actions;