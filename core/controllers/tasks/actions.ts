import {collection, state} from './state';
import user from './../user';
import routes from '../../api/api.tasks';
import {PendingTask, Task} from '../../interfaces';
import dayjs from 'dayjs'
dayjs().format()
export const actions = {
	add(task: PendingTask): Promise<Task> {
		return new Promise((resolve, reject) => {
			// send the new coupon to the database
			if(!task.status){
				task.status = 'inprogress'
			}
			routes.add(task).then((res:any) => {
				// collect the new coupon
				collection.collect(res.data, ['default', res.data.status]);
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
				collection.remove(task.id).everywhere
				resolve(res);
			}).catch(err => {


				reject(err)
			});
		})
	},
	async update(task: Task): Promise<void> {
		try{
			await routes.change(task)
			// collection.remove(task.id).everywhere
			// collection.collect(task, ['default', task.status]);
			collection.update(task.id, task)
			collection.put(task.id, task.status)
			console.log(collection, task)

			// return res;
		} catch(err) {
			throw err
		};
		
	},
	get(id:string|number) {
		let task = collection.findById(id);
		// task = Array.isArray(taskArr) && taskArr.length > 0 ? taskArr[0] : {};
		// console.log(task);

		return task.value;
	},

	
	findTask(id: string) {
		return collection.findById(id);
	},
	findByDate(_date: string|number): Task[]|undefined{
		try{
			let date = new Date(_date);
			return Object.values(collection.data).map(data => data.value).filter(task => dayjs(task.ts).isSame(date, 'date'));
		} catch(err){

		}
		

	},
	findByMonth(date: number|Date|string): Task[]|undefined{
		try{
			const _date = new Date(date);
			_date.setHours(0, 0, 0)
			const tasks = Object.values(collection.data).map(data => data.value)
			const result = tasks?.filter(task => {
				return dayjs(new Date(task.ts)).isSame(_date, 'month')
			});
			return result
		} catch(err){

		}
		

	},
	findByYear(year: number): Task[]|undefined{
		try{
			const date = new Date();
			date.setFullYear(year, 0, 1)
			date.setHours(0, 0, 0)

			return Object.values(collection.data).map(data => data.value).filter(task => dayjs(task.ts).isSame(date, 'year'));
		} catch(err){

		}
		

	},
	load() {
		return new Promise((resolve, reject) => {
			routes.getAll({id: user.state.id.value}).catch(err => {
				reject(err);
			}).then(res => {
				console.log('got all tasks.');
				
				res.data.forEach((task: Task) => {
					collection.collect(task, ['default', task.status]);
				})
				
				resolve(undefined);
			}).catch(err => {
				reject(err);
			});
		});
	},
	length: () => collection.getGroup('default').value.length,
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