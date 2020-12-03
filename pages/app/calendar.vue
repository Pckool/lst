<template>
	<div id="task-calendar_cont">
		<div class="calendar" @mousewheel="scroll">
			<div class="calendar_center-col">
				<div class="labels">
					<span class="label" v-for="label in labels" :key="label">{{label}}</span>
				</div>
				
				<div v-for="week in cal" :key="cal.indexOf(week)" class="week">
					<div v-for="day in week" :key="day.iso" class="day">
						<div class="top">
							<span v-if="day.type === 'previous'" class="prev date-num">{{day.date}}</span>
							<span v-if="day.type === 'current'" class="curr date-num">{{day.date}}</span>
							<span v-if="day.type === 'next'" class="next date-num">{{day.date}}</span>

							<svg-icon src="/images/plus.svg" @click="newTask(day.iso)" class="plus-btn"/>
						</div>
						<div class="bottom">
							<div v-for="task in getDaysTasks(day.iso)" :key="task.id" :class="'task-dot '+task.tag.color" ></div>
						</div>
						
						<!-- <div class="task-card" v-if=""></div> -->
					</div>
				</div>
			</div>
			<div class="calendar_left-col">
				<h1 class="month-label">{{monthLabel}}</h1>
			</div>
			<small class="helper">scroll to change the month.</small>
		</div>
		
	</div>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive, ref, computed, watch} from '@vue/composition-api'
import core, { PendingTask, Task, tasks } from '~/core'
import CalendarDates from 'calendar-dates'
import { emitters } from '~/core/emitters'
import dayjs from 'dayjs'
const calDates = new CalendarDates()
export default defineComponent({
	setup(props, ctx){
		const tasksThisMonth = ref<Task[]>()
		const cal = ref()
		const month = ref<number>(new Date().getMonth())
		const year = ref<number>(new Date().getFullYear())
		const labels = reactive<string[]>([
			'sun',
			'mon',
			'tue',
			'wed',
			'thu',
			'fri',
			'sat',
		])
		const monthLabels = reactive<string[]>([
			'jan',
			'feb',
			'mar',
			'apr',
			'may',
			'jun',
			'jul',
			'aug',
			'sep',
			'oct',
			'nov',
			'dec',
		])
		const monthLabel = computed(() => monthLabels[month.value])
		onMounted(async () => {
			cal.value = await calDates.getMatrix(new Date())
			tasksThisMonth.value = tasks.findByMonth(new Date())
		})

		watch(month, async () => {
			const date = new Date()
			
			date.setFullYear(year.value, month.value, 1)
			date.setHours(0,0,0)
			cal.value = await calDates.getMatrix(date)
			tasksThisMonth.value = tasks.findByMonth(date)
			// extracting ISO date value from the ts
			tasksThisMonth.value = tasksThisMonth.value.map(task => ({...task, iso: new Date(task.ts).toISOString().split('T')[0]}))
			console.log(tasksThisMonth.value)
			
		})

		const scroll = (e: WheelEvent) => {
			if(e.deltaY < 0){
				// going up
				if(month.value+1 >11){
					year.value++;
					return month.value = 0;
				}
				month.value = ++month.value;
				// month.value = 
			}
			else{
				// going down
				if(month.value-1 < 0){
					year.value--;
					return month.value = 11;
				}
				month.value = --month.value;
			}
		}

		const newTask = (isoDate) => {
			let pending: PendingTask = {
				tag: {title: 'important', color: 'red' },
				ts: new Date(isoDate).getTime()
			}
			emitters.tasks.NEW.emit(pending)
			// console.log(pending)
		}

		const getDaysTasks = (iso: string) => {
			return tasksThisMonth.value.filter(task => dayjs(iso).isSame(task.ts, 'day'))
		}
		return {
			month,
			cal,
			labels,
			tasks: tasksThisMonth,
			scroll,
			monthLabel,
			newTask,
			getDaysTasks
		}
	}
})
</script>
<style lang="scss">
#task-calendar_cont{
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	
	
	.calendar{
		
		padding: 3em 6em;
		display: flex;
		position: relative;
		.helper{
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translateX(-50%);
			margin-bottom: 3px;
			color: var(--darkGrey)
		}
		.calendar_center-col{
			.labels{
				display: flex;
				align-items: center;
				justify-content: center;
				flex-grow: 1;
				.label{
					display: inline-block;
					width: 100px;
					margin: 0.6em;
					padding: 0.7em 1em;
					text-align: center;
					border: 2px solid var(--darkGrey);
				}
			}
			.week{
				display: flex;
				flex-flow: nowrap;
				.day{
					
					display: flex;
					flex-flow: column nowrap;
					justify-content: space-between;
					height: 100px;
					width: 100px;
					border: 2px solid var(--darkGrey);
					margin: 0.6em;
					padding: 1em;
					transition: all 0.2s var(--ease);
					
					.prev, .next{
						color: var(--darkGrey);
					}
					.curr{

					}
					.date-num{
						user-select: none;
						cursor: pointer;
						pointer-events: none;
					}
					.top{
						display: flex;
						justify-content: space-between;
						align-items: center;
						.plus-btn{
							cursor: pointer;
							transition: all 0.2s var(--ease);
							opacity: 0;
						}
					}
					.task-dot{
						height: 20px;
						width: 20px;
					}

					&:hover{
						background: rgba(243, 243, 243, 0.1);
						.top{
							.plus-btn{
								opacity: 1;
							}
						}
					}
				}
			}
		}
		
		.calendar_left-col{
			border: 2px solid var(--darkGrey);
			padding: 1em;
			margin: 0.6em;
			min-width: 150px;
			width: 300px;
			display: inline-block;
			.month-label{
				text-align: center;
				margin: 0;

			}
		}
	}
	
	
	
}
</style>