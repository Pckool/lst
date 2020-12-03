<template>
	<div :class="'task '+task.tag.color" :id="task.id" :status="task.status" :waiting="waiting">
		<div class="bar">
			<div class="bar_check_text" :blur="openMore">
				<checkbox v-model="checked"/>
				<div class="text_cont">
					<reg-input class="text" v-model="task.text" v-if="task.status === 'inprogress'"/>
					<span class="text" v-else>{{task.text}}</span>
					<!-- <div class="line"></div> -->
					<div class="date-time_cont">
						<small class="date">{{new Date(task.ts).toLocaleDateString()}}</small>
						<small class="time">{{new Date(task.ts).toLocaleTimeString()}}</small>
					</div>
				</div>
			</div>
			
			<span class="more" ref="moreEl">
				<svg-icon src="/images/more.svg" @click="openMore=!openMore" :opened="openMore"/>
				<div class="more-drop" v-if="openMore">
					<small @click="deleteTask(task)"><i class="fas fa-trash fa-sm"></i></small>
				</div>
			</span>
			
		</div>
		
		<div class="loading-bar"></div>
	</div>
</template>
<script lang="ts">
import {computed, defineComponent, onBeforeMount, onMounted, ref, watch} from '@vue/composition-api'
import checkbox from '~/components/general/checkbox.vue'
import { emitters, Task, tasks } from '~/core';

export default defineComponent({
  components: { checkbox },
	props: {
		taskId: {
			type: String,
			default: null
		}
	},
	setup(props, ctx){
		let timeout = ref();
		let prevValue = null;
		const task = ref<Task>(tasks.collection.getValueById(props.taskId))
		const checked = ref<boolean>(task.value.status === "complete")
		const waiting = ref<boolean>(false)
		const openMore = ref<boolean>(false)
		const moreEl = ref<HTMLElement>()

		// const strikethrough = ref<string>('')
		onBeforeMount(() => {
			if(props.taskId){
				// task.value = tasks.collection.getValueById(props.taskId)
				// checked.value = task.value.status === "complete"
			}
			
		})
		let eventListener;
		watch(openMore, () => {
			const elFnc = function(e) {
				const target = (<HTMLElement>e.target)
				// console.log(target !== moreEl.value, Array.from(moreEl.value.children).indexOf(target))

				if(target !== moreEl.value && Array.from(moreEl.value.children).indexOf(target) === -1){
					openMore.value = false
				}
			}
			console.log(openMore.value)
			if(openMore.value){
				console.log('in first')
				eventListener = document.addEventListener('click', elFnc)
			}
			else{
				document.removeEventListener('click', elFnc)
			}
		})
		
		watch(checked, () => {
			waiting.value = false;
			if(timeout.value){
				clearTimeout(timeout.value);
				timeout.value = null;
			}
			
			// This logic is to autosave after 3 seconds, if the user changes their mind within 3 seconds, it cancels the save and returns the state to it's original path
			if(checked.value){
				if(prevValue && prevValue === 'complete'){
					prevValue = null;
					return;
				}
				prevValue = task.value.status;
				task.value.status = 'complete'
				ctx.emit('complete', props.taskId)
			}
			else{
				if(prevValue && prevValue === 'inprogress'){
					prevValue = null;
					return;
				}
				prevValue = task.value.status;
				task.value.status = 'inprogress'
				ctx.emit('inprogress', props.taskId)
			}
			
			console.log('waiting to update...')
			waiting.value = true;
			timeout.value = setTimeout(async () => {
				tasks.collection.remove(task.value.id).fromGroups(prevValue)
				prevValue = null;
				console.log('Updating task...')
				await tasks.update(task.value)
				ctx.emit('change', {id: task.value.id, status: task.value.status})
				console.log('Task updated...')
				waiting.value = false;
			}, 3000)
		})

		const deleteTask = async (task: Task) => {
			try{
				console.log('Deleting task...')
				await tasks.del(task);
				emitters.alerts.ALERT.emit({message: 'task removed'})
				console.log('Task removed...')
				ctx.emit('close')
			}
				
			catch(err){
				
			}
		}

		const strikethrough = computed(() => task.value.status === 'complete' ? 'extend' : '' )
		return {
			checked,
			task,
			strikethrough,
			waiting,
			deleteTask,
			openMore,
			moreEl,
		}
	}
})
</script>
<style lang="scss">
.task{
	// height: 90px;
	position: relative;
	padding: 2em 2.5em ;
	margin-bottom: 1em;
	width: 400px;
	border-radius: 25px;
	color: var(--black);
	font-weight: 600;
	min-height: fit-content;
    height: max-content;
	.loading-bar{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 0%;
		height: 4px;
		background: var(--white);
		transition: all 3s var(--ease);
	}
	.bar{
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		.bar_check_text{
			display: flex;
			flex-wrap: nowrap;
			align-items: flex-start;
			flex-grow: 1;

		}
		
	}
	.text_cont{
		position: relative;
		flex-grow: 1;
		padding-right: 1em;

		.text{
			overflow-wrap: anywhere;
			color: var(--black);
			
		}
		.line{
			position: absolute;
			left: 0;
			top: 50%;
			height: 2px;
			width: 0%;
			transition: all 0.2s var(--ease) 0.2s;
			background: var(--dark);
			opacity: 0;
			// &.extend{
			// 	width: 100%;
			// 	opacity: 1;
			// }
		}
		.date-time_cont{
			color: var(--darkBlueGrey)
		}
	}
	
	.more{
		cursor: pointer;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		position: relative;
		height: fit-content;
		width: 17px;
		&[opened="true"]{
			background: var(--white);
		}
		svg{
			circle, rect{
				fill: var(--black) !important;
			}
			
		}
		.more-drop{
			position: absolute;
			top: 100%;
			left: 50%;
			transform: translateX(-50%);
			background: var(--white);
			padding: 12px;
			display: flex;
			flex-flow: column nowrap;
			border-radius: 7px;

		}
	}
	&[status="complete"]{
		background: var(--darkGrey) !important;
		.line{
			width: 100%;
			opacity: 1;
		}
		.text{
			color: var(--dark);
		}
	}
	&[waiting="true"]{
		.loading-bar{
			width: 100%;
		}
	}
}
</style>