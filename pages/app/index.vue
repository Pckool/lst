<template>
	<div id="inner-tasks">
		<h1 class="tasks-header">tasks</h1>
		<div class="tasks_cont">
			
			<div class="tasks-inner">
				<small class="small-header">in progress</small>
				<transition-group name="tasks" class="task-list">
					<task v-for="taskId in tasks" :key="taskId" :taskId="taskId" @change="changeSections"/>
				</transition-group>
				<span class="no-data" v-if="!tasks.length">hover over the plus icon or go to the calendar!</span>
			</div>
			<div class="tasks-inner">
				<small class="small-header">complete</small>
				<transition-group name="tasks" class="task-list">
					<task v-for="taskId in completed" :key="taskId" :taskId="taskId" @change="changeSections"/>
				</transition-group>
				<span class="no-data" v-if="!completed.length && !tasks.length">create a task to get things going!</span>
				<span class="no-data" v-else-if="!completed.length">click the circle on the left side of a task!</span>
			</div>
			
		</div>
		
		
	</div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onBeforeMount, onMounted, onUpdated, reactive, ref} from '@vue/composition-api'
import core, { emitters, PendingTask, Task, tasks } from '~/core'

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
			vue.$forceUpdate()
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
			emitters.tasks.DELETE.on(() => {
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
$bp1: 1800px;
$bp2: 1400px;
$bp3: 1200px;
$bp4: 816px;
$bp5: 711px;
$bp6: 520px;
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
		padding: 3em 6em 3em 6em;
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
		
		overflow: auto;
		@media screen and (max-width: $bp5) {
			padding: 1em 3em 3em 3em;
		}
		@media screen and (max-width: $bp6) {
			padding: 1em 0.5em 3em 0.5em;
		}
		
		
		.tasks-inner{
			margin: 0 1em;
			// max-height: 53%;
			overflow-y: auto;
			.small-header{
				margin-top: 0.6em;
				margin-bottom: 1.1em;
				color: var(--darkGrey);
				user-select: none;
				text-transform: capitalize;
				display: block;
			}
			.task-list{
				flex-flow: column nowrap;
				display: flex;
				
				
				padding: 0.5em;
				min-width: 400px;
				@media screen and (max-width: 711px) {
					min-width: unset;
				}
				
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