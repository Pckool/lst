<template>
	<div id="inner-tasks">
		<transition-group name="tasks" class="task-list">
			<div class="task" v-for="task in tasks" :key="task.id">
				<span @click="deleteTask(task)" :id="task.id"><img src="/images/more.svg" alt=""></span>
				<span>{{task.text}}</span>
			</div>
		</transition-group>
		<transition name="new-task">
			<new-task v-if="openNewTask" @close="openNewTask=false"/>
		</transition>
	</div>
</template>
<script lang="ts">
import hash from 'object-hash'
import {defineComponent, onMounted, reactive, ref} from '@vue/composition-api'
import core, { PendingTask, Task, tasks } from '~/core'
import newTask from '~/components/app/newTask.vue'

export default defineComponent({
	components: {newTask},
	setup(){
		const _tasks = reactive<Array<Task>>(tasks.collection.getGroup('all').output)
		const openNewTask = ref<boolean>(false)
		const populateGrid = () => {
			_tasks.length = 0;
			tasks.collection.getGroup('all').output.forEach(task => {
				_tasks.push(task)
			})
		}
		onMounted(async () => {
			populateGrid()
			core.emitters.tasks.NEW.on(payload => {
				openNewTask.value = true;
				tasks.state.pending.set(payload);
				
				// const id = tasks.length-1 !== -1 ? tasks.length-1 : tasks.length
				// const task = tasks[id]
				// tasks.push({id: `${hash(task||{})}`, ...payload})
				// if(tasks.length > 3) {
				//     tasks.pop()
				// }
			})
			core.emitters.tasks.CREATED.on(payload => {
				openNewTask.value = true;
				populateGrid()
			})
		})
		const deleteTask = (task: Task) => {
			console.log('yup')
			const i = _tasks.indexOf(task)
			_tasks.filter(task => task !== tasks[i])
			let loop = 0;
			let loopTask = null
			do{
				_tasks.pop()
				if(loop > 0){
					_tasks.push(task)
				}
				loop++
			} while(loop < _tasks.length)
		}
		
		return {
			tasks: _tasks,
			deleteTask,
			openNewTask
		}
	}
})
</script>
<style lang="scss">
#inner-tasks{
	position: relative;
	flex-grow: 1;
	.task-list{
		padding: 6em 6em;
		display: flex;
		flex-flow: column wrap;
		.task{
			height: 90px;
			padding: 2em 2.5em ;
			margin-bottom: 1em;
			width: 400px;
			border-radius: 25px;
			background: var(--blueGrey);
		}
	}
	
	.tasks-enter-active, .tasks-leave-active{
		transition: all 0.2s var(--ease);
	}
	.tasks-enter, .tasks-leave-to{
		width: 0px;
	}
	.new-task-enter-active, .new-task-leave-active{
		transition: all 0.2s var(--ease);
	}
	.new-task-enter, .new-task-leave-to{
		height: 0px;
	}
}
</style>