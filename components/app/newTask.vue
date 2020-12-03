<template>
	<div id="new-task_cont">
		<div class="header">
			<div class="header-left">
				<small>new task</small>
				<div :class="'tag ' + task.tag.color"></div>
			</div>
			
			<p class="close_icon" @click="$emit('close')"><svg-icon src="/images/close.svg"/></p>
		</div>
		<!-- <div class="sub-header">
			
		</div> -->
		<div class="body">
			<div class="in-cont">
				<label>What would you like to do?</label>
				<large-input v-model="text"></large-input>
			</div>
			<div class="in-cont">
				<label>When is it due?</label>
				<div class="in-row spread">
					<!-- <input type="date" v-model="date"> -->
					<date-input v-model="date" />
					<time-input v-model="time" />
					<!-- <input type="time" v-model="time"> -->
				</div>
				
			</div>
			<button @click="submit">Create</button>
		</div>
	</div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onBeforeUnmount, onMounted, reactive, ref} from '@vue/composition-api'
import core, { emitters, PendingTask, Task, tasks, user } from '~/core'
import DynamicInput from '~/components/general/dynamicInput.vue'
import SvgIcon from '~/components/general/svgIcon.vue'
import LargeInput from '~/components/general/largeInput.vue'
import DateInput from '~/components/general/dateInput.vue'
import TimeInput from '~/components/general/timeInput.vue'
import anime from 'animejs'


export default defineComponent({
	components: {DynamicInput, SvgIcon, LargeInput, DateInput, TimeInput},
	setup(props, ctx){
		const task = ref<PendingTask>({...tasks.state.pending.value})
		let animation;
		const text = ref<string>('Pick up dog food')
		const ts = new Date(task.value.ts||null)
		const time = ref<string>(`${ts.getHours()}`.padStart(2, '0') + ':' + `${ts.getMinutes()}`.padStart(2, '0'))
		const date = ref<string>(`${ts.getFullYear()}`+'-'+`${ts.getMonth()+1}`.padStart(2, '0')+'-'+`${ts.getDate()}`.padStart(2, '0'))
		const genDateTime = (d: Date|number|string) => {
			const ts = new Date(d)
			time.value = `${ts.getHours()}`.padStart(2, '0') + ':' + `${ts.getMinutes()}`.padStart(2, '0')
			date.value = `${ts.getFullYear()}`+'-'+`${ts.getMonth()+1}`.padStart(2, '0')+'-'+`${ts.getDate()}`.padStart(2, '0')
		}
		// when the user is ready to create the task
		const submit = async () => {
			
			const splitTime = time.value.split(':').map(v => Number(v))
			const splitDate = date.value.split('-').map(v => Number(v))
			const newTs = new Date(splitDate[0], splitDate[1]-1, splitDate[2], splitTime[0], splitTime[1], 0, 0);
			// newTs.setHours()
			// newTs.setFullYear()
			console.log(newTs)
			task.value.ts = newTs.getTime()
			task.value.text = text.value
			task.value.owner = user.state.id.value
			task.value.status = 'inprogress'
			// try{
			// 	const genTask: Task = await tasks.add(task.value)
			// 	core.emitters.tasks.CREATED.emit(genTask);
			// 	if(animation) animation.reverse()
			// 	await animation.finished
			// 	ctx.emit('close')
			// }
			// catch(err){
			// 	console.warn(err)
			// }
				
			
		}
		// for emitter update
		onMounted(() => {
			emitters.general.BLUR.emit(true);
			// used if the user decides to change something about the new task (tag, time, etc) from an outside component
			emitters.tasks.NEW.on(payload => {
				console.log(payload)
				if(payload.ts){
					genDateTime(payload.ts)
				}
				if(payload.tag){
					task.value = {...task.value, tag: payload.tag}
				}
				if(payload.text){
					task.value = {...task.value, text: payload.text}
				}
			})
			
			
		})
		

		// for animation
		const vue = getCurrentInstance();
		
		onMounted(() => {
			animation = vue.$nextTick(() => {
				const el: HTMLElement = document.querySelector('#new-task_cont')
				anime.timeline({
					easing: 'easeInOutQuad',
				}).add({
					targets: '#new-task_cont',
					width: [0, el.offsetWidth],
					duration: 500,
				}, '+=100').add({
					targets: document.querySelectorAll('#new-task_cont .header'),
					opacity: [0, 1],
					duration: 300,
				}, '-=100').add({
					targets: document.querySelectorAll('#new-task_cont .in-cont, #new-task_cont button'),
					delay: anime.stagger(300),
					opacity: [0, 1],
					duration: 300,
				})
			})
			
		})

		// final cleanup
		onBeforeUnmount(async () => {
			emitters.general.BLUR.emit(false);
			
		})


		return {
			task,
			text,
			time,
			date,
			submit,
			ts,
		}
	}
})
</script>
<style lang="scss">
#new-task_cont{
	transition: all 0.2s var(--ease);
	position: absolute;
	z-index: 300;
	top: 0;
	left: 100%;
	width: fit-content;
	height: 100%;
	background: var(--dark);
	// border-radius: 25px 25px 0 0;
	display: flex;
	flex-flow: column;
	transform: scaleX(1);
	overflow: hidden;
	opacity: 1;
	
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 3em 6em 3em 6em;
		.header-left{
			display: flex;
			align-items: center;
		}
		h1{
			margin: 0;
		}
		.close_icon{
			cursor: pointer;
			transition: all 0.2s ease;
			&:hover{
				color: var(--red);
			}
		}
	}
	.tag{
		width: 45px;
		height: 6px;
		border-radius: 50em;
		margin: 0 1em;
		cursor: pointer;
	}
	.sub-header{
		padding: 1em 6em 3em 6em;
		
		
	}
	.in-cont{
		display: flex;
		flex-flow: column nowrap;
		padding-bottom: 1em;
		.in-row{
			display: flex;
			flex-flow: row wrap;
			margin-top: 1em;
			padding-bottom: 4rem;
			input{
				min-height: 0;
				min-width: 0;
				flex-grow: 0;
				margin-right: 1em;
				font-size: 26px;
				font-weight: 300;
			}
		}
	}
	.body{
		overflow-y: auto;
		overflow-x: hidden;
		flex-shrink: 1;
		padding: 3em 6em 3em 6em;
		button{

		}
		
		
	}
	.spread{
		justify-content: space-between;
	}
}    
</style>