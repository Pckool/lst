<template>
	<div id="inner-tasks">
		<div class="tasks_cont">
			<h1>tasks</h1>
			<small class="small-header">in progress</small>
			<transition-group name="tasks" class="task-list">
				<task v-for="taskId in tasks" :key="taskId" :taskId="taskId" @change="changeSections"/>
			</transition-group>
			<small class="small-header">complete</small>
			<transition-group name="tasks" class="task-list">
				<task v-for="taskId in completedTaskIds" :key="taskId" :taskId="taskId" @change="changeSections"/>
			</transition-group>
			
		</div>
		<div class="right-tasks_cont">
			<div class="today_cont">
				<small>today</small>
				<div class="today-inner">
					<transition-group name="tasks" class="task-list">
						<task v-for="taskId in todayTaskIds" :key="'today_'+taskId" :taskId="taskId" @change="changeSections"/>
						
					</transition-group>
					<h4 v-if="todayTaskIds.length === 0">No Tasks today!</h4>
				</div>
				
			</div>
			
		</div>
		
		<transition name="new-task">
			<new-task v-if="openNewTask" @close="openNewTask=false"/>
		</transition>
	</div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onBeforeMount, onMounted, onUpdated, reactive, ref} from '@vue/composition-api'
import core, { PendingTask, Task, tasks } from '~/core'
import newTask from '~/components/app/newTask.vue'
import TaskComp from '~/components/app/task.vue'
import svgIcon from '~/components/general/svgIcon.vue'

export default defineComponent({
	components: {newTask, svgIcon, Task: TaskComp},
	setup(){
		const ids = [...tasks.collection.getGroup('inprogress').index]
		const idsComp = [...tasks.collection.getGroup('completed').index]
		const taskIds = ref<Array<string|number>>(ids)
		const completedTaskIds = ref<Array<string|number>>(idsComp)
		const todayTaskIds = ref<Array<Task>>(tasks.state.today.value)
		const openNewTask = ref<boolean>(false)
		const vue = getCurrentInstance();

		const populateGrid = () => {
			taskIds.value.length = 0;
			completedTaskIds.value.length = 0;
			console.log('populating list')
			console.log(tasks.collection)
			tasks.collection.getGroup('inprogress').value.forEach(taskId => 
				taskIds.value.push(taskId)
			)
			tasks.collection.getGroup('complete').value.forEach(taskId => 
				completedTaskIds.value.push(taskId)
			)
			// .output.forEach(task => {
				
			// })
		}
		onMounted(async () => {
			vue.$nextTick(() => {
				populateGrid()
			})
			
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

		const changeSections = (payload) => {
			populateGrid()
		}
		// onUpdated(() => {
		// 	populateGrid()
		// })

		// TODO: This doesn't make a lot of sense. Clean it up
		const deleteTask = (taskId: string|number) => {
			const i = taskIds.value.indexOf(taskId)
			taskIds.value.filter(task => task !== tasks[i])
			let loop = 0;
			let loopTask = null
			do{
				taskIds.value.pop()
				if(loop > 0){
					taskIds.value.push(taskId)
				}
				loop++
			} while(loop < taskIds.value.length)
		}
		
		return {
			tasks: taskIds,
			deleteTask,
			openNewTask,
			completedTaskIds,
			changeSections,
			todayTaskIds,
		}
	}
})
</script>
<style lang="scss">
#inner-tasks{
	position: relative;
	flex-grow: 1;
	display: flex;
	flex-flow: row wrap;
	.tasks_cont{
		flex-shrink: 1;
		padding: 6em 6em;
		display: flex;
    	flex-flow: column nowrap;
		h1{
			margin-top: 0px;
			margin-bottom: 0.5em;
		}
		.small-header{
			margin-top: 0.6em;
			margin-bottom: 0.9em;
			color: var(--darkGrey);
		}
		.task-list{
			
			display: flex;
			flex-flow: column wrap;
			
		}
	}
	.right-tasks_cont{
		padding: 6em 6em;
		flex-grow: 1;
		.today_cont{
			position: relative;
			
			small{
				transform: rotate(-90deg) translateX(50%);
				position: absolute;
				top: 100%;
				left: 0;
				margin-left: -13px;
				padding-bottom: 1em;
			}
			.today-inner{
				padding-left: 13px;
				h4{
					margin: 0;
					color: var(--darkGrey);
				}
		}
			}
			
		
	}
	
	
	.tasks-enter-active, .tasks-leave-active{
		transition: all 0.2s var(--ease);
	}
	.tasks-enter, .tasks-leave-to{
		width: 0px;
		height: 0px;
	}
	.new-task-enter-active, .new-task-leave-active{
		transition: all 0.2s var(--ease);
	}
	.new-task-enter, .new-task-leave-to{
		height: 0px;
	}
}
</style>