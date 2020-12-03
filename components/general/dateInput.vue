<template>
	<span class="date-input_cont">
		<span><large-input v-model="month" name="month" @mousewheel="scroll"/></span>
		<span class="sep">/</span>
		<span><large-input v-model="date" name="date" @mousewheel="scroll"/></span>
		<span class="sep">/</span>
		<span><large-input v-model="year" name="year" @mousewheel="scroll"/></span>
	</span>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, ref, watch, watchEffect} from '@vue/composition-api'
import largeInput from '~/components/general/largeInput.vue'

export default defineComponent({
	components: {largeInput},
	model: {
		prop: 'value',
		event: 'change'
	},
	props: {
		value: {
			type: String,

		}
	},
	setup(props, ctx){
		const now = new Date(props.value||null)
		const month = ref<string>(`${now.getMonth()+1}`.padStart(2, '0'))
		const date = ref<string>(`${now.getDate()}`.padStart(2, '0'))
		const year = ref<string>(`${now.getFullYear()}`.padStart(4, '0'))
		const vue = getCurrentInstance();
		
		const getLastDateInMonth = (month: number, year?: number) => {
			// dont forget to add 1 to the month value BEFORE passing it to this function
			if(month > 0 && month < 13){
				const d = new Date(year||new Date().getFullYear(), month, 0);
				// console.log(d)
				return d.getDate() 
			}
			console.warn('Month was invalid; defaulting to 31...')
			return 31;
			
		}

		const scroll = (e: WheelEvent) => {
			// TODO: add logic here to check if the date is valid
			const el = <HTMLElement>e.target;
			const name = el.getAttribute('name')

			
			

			if(e.deltaY < 0){
				// going up
				let val;
				switch(name){
					case 'date':
						val = Number(date.value)
						
						if(!isNaN(val)){
							const lastDate = getLastDateInMonth(Number(month.value), Number(year.value))
							if(val === lastDate){
								
								date.value = `${1}`
								break;
							}
							date.value = `${++val}`
						}
						break;
					case 'month':
						val = Number(month.value)
						if(!isNaN(val)){
							
							if(val === 12){
								month.value = `${1}`
								break;
							}
							
							month.value = `${++val}`
						}
						break;
					case 'year':
						val = Number(year.value)
						if(!isNaN(val)){
							
							year.value = `${++val}`
						}
						break;
				}
			}
			else{
				// going down
				let val;
				switch(name){
					case 'date':
						val = Number(date.value)
						if(!isNaN(val)){
							if(val === 1){
								const lastDate = getLastDateInMonth(Number(month.value), Number(year.value))
								date.value = `${lastDate}`
								break;
							}
							date.value = `${--val}`
						}
						break;
					case 'month':
						val = Number(month.value)
						if(!isNaN(val)){
							if(val === 1){
								month.value = `${12}`
								break;
							}
							month.value = `${--val}`
						}
						break;
					case 'year':
						val = Number(year.value)
						if(!isNaN(val)){
							year.value = `${--val}`
						}
						break;
				}
			}
		}
        
		watch(month, () =>{
			// init variables
			let newVal = month.value
			
			// checking logic
			if(month.value.length > 2){
				newVal = month.value.substring(0, 2);
			}
			newVal = newVal.replace(/[A-z]/g, '').padStart(2, '0').trim();
			let newValNum = Number(newVal);
			if(!isNaN(newValNum) && newValNum < 1){
				newVal = `${1}`
			}
			else if(!isNaN(newValNum) && newValNum > 12){
				newVal = `${12}`
			}
			month.value = newVal;
			// console.log('month', month.value)
		})

		watch(date, () =>{
			// init variables
			const lastDate = getLastDateInMonth(Number(month.value), Number(year.value))
			// console.log(lastDate)
			let newVal = date.value

			// checking logic
			if(date.value.length > 2){
				newVal = date.value.substring(0, 2);
			}
			newVal = newVal.replace(/[A-z]/g, '').padStart(2, '0').trim();

			const newValNum = Number(newVal);
			// console.log(newValNum)
			if(!isNaN(newValNum) && newValNum < 1){
				newVal = `${1}`
			}
			else if(!isNaN(newValNum) && newValNum > lastDate){
				newVal = `${lastDate}`
			}
			date.value = newVal;
			// console.log('date', date.value)

		})

		

		watch(year, () =>{
			// init variables
			let newVal = year.value

			// checking logic
			if(year.value.length > 4){
				newVal = year.value.substring(0, 4);
			}
			newVal = newVal.replace(/[A-z]/g, '').padStart(4, '0').trim();
			let newValNum = Number(newVal);
			if(!isNaN(newValNum) && newValNum < 1990){
				newVal = `${new Date().getFullYear()}`
			}
			year.value = newVal;
			// console.log('year', year.value)

		})

		const backup = ref<string>()
		watchEffect(() => {
			const value = `${year.value}-${month.value}-${date.value}`
			const dateValue = new Date(value + "T00:00:00")
			// console.log(dateValue)
			if(dateValue){
				backup.value = value
				ctx.emit('change', value)
				ctx.emit('date', dateValue)
			}
			// TODO: check to seee if the generated date differs from the component values (essentially, check to see if the date is valid)
			
		})
		return {
			month,
			date,
			year,
			scroll
		}
	}
})
</script>
<style lang="scss">
.date-input_cont{
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: 1.3em;
	margin: 0.5em 0 0 0;
	.text_large{
		padding-bottom: 0em;
		margin: 0px;
		
	}

	.sep{
		padding: 0 0.4em;
		@media screen and (max-width: 3830px){
			font-size: 95px;
		}
		@media screen and (max-width: 1830px){
			font-size: 61px;
		}
		@media screen and (max-width: 1280px){
			font-size: 47px;
		}
		@media screen and (max-width: 1080px){
			font-size: 34px;
			padding: 0 0.2em;
		}
	}
}
</style>