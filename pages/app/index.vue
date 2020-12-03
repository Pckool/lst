<template>
	<div id="inner-tasks">
		<h1 class="tasks-header">tasks</h1>
		<div class="tasks_cont">
			
			<div class="tasks-inner">
				<small class="small-header">in progress</small>
				<transition-group name="tasks" class="task-list">
					<task v-for="taskId in tasks" :key="taskId" :taskId="taskId" @change="changeSections"/>
				</transition-group>
				<span class="no-data" v-if="!tasks.length">Add a task by hovering over the plus icon</span>
			</div>
			<div class="tasks-inner">
				<small class="small-header">complete</small>
				<transition-group name="tasks" class="task-list">
					<task v-for="taskId in completed" :key="taskId" :taskId="taskId" @change="changeSections"/>
				</transition-group>
				<span class="no-data" v-if="!completed.length">Complete a task by clicking on the circle on the left side of a task</span>
			</div>
			
		</div>
		
		
	</div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onBeforeMount, onMounted, onUpdated, reactive, ref} from '@vue/composition-api'
import core, { PendingTask, Task, tasks } from '~/core'

import TaskComp from '~/components/app/task.vue'
import svgIcon from '~/components/general/svgIcon.vue'

export default defineComponent({
	components: {svgIcon, Task: TaskComp},
	setup(){
		const ids = [...tasks.collection.getGroup('inprogress').index]
		const idsComp = [...tasks.collection.getGroup('completed').index]
		const taskIds = ref<Array<string|number>>(ids)
		const completedTaskIds = ref<Array<string|number>>(idsComp)
		const todayTaskIds = ref<Array<string|number>>(tasks.state.today.value.map(task => task.id))
		
		const vue = getCurrentInstance();

		const populateGrid = () => {
			taskIds.value.length = 0;
			completedTaskIds.value.length = 0;
			console.log('populating list')
			tasks.collection.getGroup('inprogress').value.forEach(taskId => 
				taskIds.value.push(taskId)
			)
			tasks.collection.getGroup('complete').value.forEach(taskId => 
				completedTaskIds.value.push(taskId)
			)
			todayTaskIds.value = tasks.state.today.value.map(task => task.id)
			// .output.forEach(task => {
				
			// })
		}
		onMounted(async () => {
			vue.$nextTick(() => {
				populateGrid()
			})
			
			core.emitters.tasks.CREATED.on(payload => {
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
			completed: completedTaskIds,
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
	flex-flow: column wrap;
	h1.tasks-header{
		margin: 0;
		padding: 0em 0em 0.5em 1em;
	}
	.tasks_cont{
		flex-grow: 1;
		padding: 6em 6em 3em 6em;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		@media screen and (max-width: 711px) {
			padding: 6em 3em 3em 3em;
		}
		
		.task-list{
			flex-flow: column nowrap;
			display: flex;
			max-height: 53%;
    		overflow: auto;
			padding: 0.5em;
			min-width: 400px;
			@media screen and (max-width: 711px) {
				min-width: unset;
			}
			@media screen and (max-height: 1000px) {
				max-height: 90%;
			}
		}
		.tasks-inner{
			margin: 0 1em;
			
			.small-header{
				margin-top: 0.6em;
				margin-bottom: 0.9em;
				color: var(--darkGrey);
				user-select: none;
			}
			
		}
		.no-data{
			color: var(--darkGrey);
			user-select: none;
			word-wrap: normal;
		}
	}
	
	
	.tasks-enter-active, .tasks-leave-active{
		transition: all 0.2s var(--ease);
	}
	.tasks-enter, .tasks-leave-to{
		width: 0px;
		height: 0px;
	}
	
}
</style>