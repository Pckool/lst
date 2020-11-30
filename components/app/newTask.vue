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
import {defineComponent, getCurrentInstance, reactive, ref} from '@vue/composition-api'
import core, { PendingTask, Task, tasks, user } from '~/core'
import DynamicInput from '~/components/general/dynamicInput.vue'
import SvgIcon from '~/components/general/svgIcon.vue'
import LargeInput from '~/components/general/largeInput.vue'
import DateInput from '~/components/general/dateInput.vue'
import TimeInput from '~/components/general/timeInput.vue'

export default defineComponent({
	components: {DynamicInput, SvgIcon, LargeInput, DateInput, TimeInput},
	setup(props, ctx){
		const task = reactive<PendingTask>(tasks.state.pending.value)
		const text = ref<string>('Pick up dog food')
		const ts = new Date(task.ts)
		const time = ref<string>(`${ts.getHours()}`.padStart(2, '0') + ':' + `${ts.getMinutes()}`.padStart(2, '0'))
		const date = ref<string>(`${ts.getFullYear()}`+'-'+`${ts.getMonth()+1}`.padStart(2, '0')+'-'+`${ts.getDate()}`.padStart(2, '0'))

		const submit = () => {
			const newTs = new Date(ts);
			const splitTime = time.value.split(':').map(v => Number(v))
			const splitDate = date.value.split('-').map(v => Number(v))
			
			newTs.setHours(splitTime[0], splitTime[1])
			newTs.setFullYear(splitDate[0], splitDate[1], splitDate[2])
			task.ts = newTs.getTime()
			task.text = text.value
			task.owner = user.state.id.value
			task.status = 'inprogress'
			tasks.add(task).then((genTask: Task) => {
				core.emitters.tasks.CREATED.emit(genTask);
				ctx.emit('close')
				
			});
		}
		return {
			task,
			text,
			time,
			date,
			submit,
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
		flex-shrink: 1;
		padding: 5em 6em 1em 6em;
		
		
	}
	.spread{
		justify-content: space-between;
	}
}    
</style>