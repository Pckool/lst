<template>
	<div id="task-calendar_cont">
		<div class="calendar" @mousewheel="scroll">
			<div class="calendar_center-col">
				<div class="labels">
					<span class="label" v-for="label in labels" :key="label">{{label}}</span>
				</div>
				
				<div v-for="week in cal" :key="cal.indexOf(week)" class="week">
					<div v-for="day in week" :key="day.iso" class="day" @click="populateList(day.iso)">
						<div class="top">
							<span v-if="day.type === 'previous'" class="prev date-num">{{day.date}}</span>
							<span v-if="day.type === 'current'" class="curr date-num">{{day.date}}</span>
							<span v-if="day.type === 'next'" class="next date-num">{{day.date}}</span>

							<span @click="newTask(day.iso)" class="plus-btn">+</span>
						</div>
						<div class="bottom">
							<div v-for="task in getDaysTasks(day.iso, 10)" :key="task.id" :class="'task-dot '+task.tag.color" ></div>
						</div>
						
						<!-- <div class="task-card" v-if=""></div> -->
					</div>
				</div>
			</div>
			<div class="calendar_left-col_cont">
				<div class="calendar_left-col">
					<div class="left-col_top">
						<h1 class="month-label">{{monthLabel}}</h1>
						<small class="year-label">{{yearLabel}}</small>
					</div>
					<div class="left-col_body">
						<div v-for="task in displayedTasks" :key="'visual_'+task.id" :class="'cal-task '+task.tag.color">
							<div class="task-text">{{task.text}}</div>
							<small class="task-time">{{new Date(task.ts).toLocaleTimeString()}}</small>
						</div>
					</div>
					
				</div>
			</div>
			
			<small class="helper">scroll to change the month.</small>
		</div>
		
	</div>
</template>
<script lang="ts">
import {defineComponent, onMounted, reactive, ref, computed, watch} from '@vue/composition-api'
import core, { PendingTask, Task, tasks, emitters } from '~/core'
import CalendarDates from 'calendar-dates'
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
		const yearLabel = computed(() => year.value)
		onMounted(async () => {
			cal.value = await calDates.getMatrix(new Date())
			tasksThisMonth.value = tasks.findByMonth(new Date())
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

		// new task stuff
		const creatingNewTask = ref<boolean>(false);

		const newTask = (isoDate) => {
			creatingNewTask.value = true
			let pending: PendingTask = {
				tag: {title: 'important', color: 'red' },
				ts: new Date(isoDate).getTime()
			}
			emitters.tasks.NEW.emit(pending)
		}
		onMounted(() => {
			emitters.tasks.CREATED.on(() => {
				creatingNewTask.value = false;
			})
			emitters.tasks.CANCEL.on(() => {
				creatingNewTask.value = false;
			})
		})

		// reading the tasks for a specific date
		const getDaysTasks = (iso: string, max?:number) => {
			if(max)
				return tasksThisMonth.value.filter(task => dayjs(iso).isSame(task.ts, 'day')).slice(0, max)
			else
				return tasksThisMonth.value.filter(task => dayjs(iso).isSame(task.ts, 'day'))
		}

		const displayedTasks = ref<Array<Task>>([])
		const populateList = (iso: string) => {
			if(!creatingNewTask.value){
				const tasks = getDaysTasks(iso);
				displayedTasks.value.length = 0;
				displayedTasks.value.push(...tasks)
			}
			
		}
		
		// watch for month chnage
		watch(month, async () => {
			const date = new Date()
			displayedTasks.value.length = 0;
			date.setFullYear(year.value, month.value, 1)
			date.setHours(0,0,0)
			cal.value = await calDates.getMatrix(date)
			tasksThisMonth.value = tasks.findByMonth(date)
			// extracting ISO date value from the ts
			tasksThisMonth.value = tasksThisMonth.value.map(task => ({...task, iso: new Date(task.ts).toISOString().split('T')[0]}))
			
		})
		


		
		return {
			month,
			cal,
			labels,
			tasks: tasksThisMonth,
			scroll,
			monthLabel,
			yearLabel,
			newTask,
			getDaysTasks,
			populateList,
			displayedTasks
		}
	}
})
</script>
<style lang="scss">
// I should really use css grid for this. I would change that in the future
$bp1: 1800px;
$bp2: 1400px;
$bp3: 1200px;
$bp4: 816px;
$bp5: 711px;
$bp6: 520px;
#task-calendar_cont{
	display: flex;
	align-items: center;
	justify-content: center;
	flex-grow: 1;
	.calendar{
		display: flex;
		position: relative;
		flex-wrap: wrap;
		padding: 3em 0;
    	
    	margin: 0 auto;
		@media screen and (max-width: $bp3){
			padding: 2em 0em;
			width: min-content;
		}
		@media screen and (max-width: $bp6){
			align-items: center;
			justify-content: center;
			
		}
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
					width: 80px;
					margin: 0.6em;
					padding: 0.7em 1em;
					text-align: center;
					border: 2px solid var(--darkGrey);
				}
				@media screen and (max-width: $bp1){
					.label{
						width: 50px;
					}
				}
				@media screen and (max-width: $bp2){
					.label{
						width: 35px;
					}
				}
				@media screen and (max-width: $bp4){
					.label{
						padding: 0.2em 0.5em;
						
					}
				}
				@media screen and (max-width: $bp5){
					.label{
						margin: 0.2em;
						
					}
				}
				@media screen and (max-width: $bp6){
					.label{
						margin: 0.1em;
						padding: 0.3em;
					}
				}
			}
			.week{
				display: flex;
				flex-flow: nowrap;
				.day{
					
					display: flex;
					flex-flow: column nowrap;
					justify-content: space-between;
					height: 80px;
					width: 80px;
					border: 2px solid var(--darkGrey);
					margin: 0.6em;
					padding: 1em;
					transition: all 0.2s var(--ease);
					cursor: pointer;
					
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
							font-weight: 900;
							font-size: 23px;
							&:hover{
								color: var(--red);
							}
						}
					}
					.bottom{
						display: flex;
						flex-wrap: wrap;
						justify-content: space-around;
						.task-dot{
							height: 10px;
							width: 10px;
							border-radius: 50%;
							margin-right: 2px;
							margin-left: 2px;
							@media screen and (max-width: $bp4){
								height: 5px;
								width: 5px;
								
							}
							@media screen and (max-width: $bp6){
								height: 3px;
								width: 3px;
								
							}
						}
					}
					

					&:hover{
						background: rgba(243, 243, 243, 0.1);
						.top{
							.plus-btn{
								opacity: 1;
								
							}
						}
					}

					@media screen and (max-width: $bp1){
						height: 50px;
						width: 50px;
						
					}
					@media screen and (max-width: $bp2){
						height: 35px;
						width: 35px;
						
					}
					@media screen and (max-width: $bp4){
						padding: 0.5em;
						.top{
							.plus-btn{
								font-size: 20px;
							}
						}
						
					}
					@media screen and (max-width: $bp5){
						margin: 0.2em;
						.top{
							.plus-btn{
								font-size: 16px;
							}
						}
						
					}
					@media screen and (max-width: $bp6){
						margin: 0.1em;
						padding: 0.3em;
					}
					
				}
			}
		}
		
		.calendar_left-col_cont{
			margin: 0.6em;
			width: 300px;
			display: flex;
			.calendar_left-col{
				border: 2px solid var(--darkGrey);
				padding: 1em;
				min-width: 150px;
				width: 100%;
				display: inline-block;

				.left-col_top{
					position: relative;
					.month-label{
						text-align: center;
						margin: 0;
						cursor: default;
						
					}
					.year-label{
						position: absolute;
						top: 0;
						right: 0;
						font-size: xx-small;
						cursor: default;
					}
				}
				.left-col_body{
					position: relative;
					padding-top: 50px;
					overflow-y: auto;
					.cal-task{
						border-radius: 25px;
						color: var(--black);
						margin-bottom: 1em;
						padding: 1em 2em;
						overflow: hidden;
						
						font-size: 16px;
						.task-text{
							margin-bottom: 13px;
							font-weight: 600;
						}
						.task-time{
							font-size: x-small;
							color: var(--dark);
						}
					}
				}
				
				
			}
			@media screen and (max-width: $bp3){
				flex: 1 1 0;
				
			}
			@media screen and (max-width: $bp5){

				
			}
			@media screen and (max-width: $bp6){
				margin: 0.1em;
				align-items: center;
				justify-content: center;
				
				.calendar_left-col{
					
				}
				
			}
		}
		
		
	}
	
	
	
}
</style>