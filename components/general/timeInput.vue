<template>
	<span class="time-input_cont">
		<span><large-input v-model="hour" name="hour" @mousewheel="scroll"/></span>
		<span class="sep">:</span>
		<span><large-input v-model="minute" name="minute" @mousewheel="scroll"/></span>
		<span class="sep"> &nbsp;</span>
		<span><large-input v-model="seg" name="seg" @mousewheel="scroll"/></span>
	</span>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, ref, watch, watchEffect} from '@vue/composition-api'
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
		const now = new Date()
		try{
			const [hr, mn] = props.value.split(':').map(str => Number(str.trim()));
			now.setHours(hr, mn)
		}
		catch(err){
			console.warn(err)
		}
		const hour = ref<string>()
		const minute = ref<string>()
		const seg = ref<string>(`${now.getHours() < 12 ? 'am': 'pm'}`)
		const vue = getCurrentInstance();
		

		const populateValues = (d: Date|number|string) => {
			const date = new Date(d||Date.now())
			hour.value = `${date.getHours() < 12 ? date.getHours() : date.getHours()-12}`.padStart(2, '0')
			minute.value = `${date.getMinutes()}`.padStart(2, '0')
		}
		const scroll = (e: WheelEvent) => {
			// TODO: add logic here to check if the date is valid
			const el = <HTMLElement>e.target;
			const name = el.getAttribute('name')
			

			if(e.deltaY < 0){
				// going up
				let val;
				switch(name){
					case 'hour':
						val = Number(hour.value)
						if(!isNaN(val)){
							if(val === 12){
								hour.value = `${1}`
								break;
							}
							hour.value = `${++val}`
						}
						break;
					case 'minute':
						val = Number(minute.value)
						if(!isNaN(val)){
							if(val === 59){
								minute.value = `${1}`
								break;
							}
							minute.value = `${++val}`
						}
						break;
					case 'seg':
						seg.value === 'pm' ? seg.value = `am` : seg.value = `pm`
						break;
				}
			}
			else{
				// going down
				let val;
				switch(name){
					case 'hour':
						val = Number(hour.value)
						if(!isNaN(val)){
							if(val === 1){
								hour.value = `${12}`
								break;
							}
							hour.value = `${--val}`
						}
						break;
					case 'minute':
						val = Number(minute.value)
						if(!isNaN(val)){
							if(val === 1){
								minute.value = `${59}`
								break;
							}
							
							minute.value = `${--val}`
						}
						
						break;
					case 'seg':
						seg.value === 'pm' ? seg.value = `am` : seg.value = `pm`
						break;
				}
			}
		}
        
		watch(hour, () =>{
			let newVal = hour.value
			if(hour.value.length > 2){
				newVal = hour.value.substring(0, 2);
			}
			newVal = newVal.replace(/[A-z]/g, '').padStart(2, '0').trim();
			// console.log(newVal)
			let newValNum = Number(newVal);
			if(!isNaN(newValNum) && newValNum <= 0){
				newVal = `${1}`
			}
			else if(!isNaN(newValNum) && newValNum > 12){
				newVal = `${12}`
			}
			else if(isNaN(newValNum)){
				console.warn(newVal, newValNum)
			}
			hour.value = newVal;
		})
		watch(minute, () =>{
			let newVal = minute.value
			if(minute.value.length > 2){
				newVal = minute.value.substring(0, 2);
			}
			newVal = newVal.replace(/[A-z]/g, '').padStart(2, '0').trim();
			// console.log(newVal)
			let newValNum = Number(newVal);
			if(!isNaN(newValNum) && newValNum < 0){
				newVal = `${0}`
			}
			else if(!isNaN(newValNum) && newValNum >= 60){
				newVal = `${59}`
			}
			else if(isNaN(newValNum)){
				console.warn(newVal, newValNum)
			}
			minute.value = newVal

		})

		

		watch(seg, () =>{
			let newVal = seg.value
			if(seg.value.length > 2){
				newVal = seg.value.substring(0, 2);
			}
			// if the resulkt is not 'am' or 'pm', default to 'pm'
			if(newVal.match(/(am)|(pm)/g).length){
				seg.value = newVal.trim();
			}
			else {
				seg.value = 'pm';
			}
			
			

		})

		const backup = ref<string>()
		watchEffect(() => {
			let hour24 = seg.value === 'am' ? hour.value : `${Number(hour.value)+12}`
			const value = `${hour24}:${minute.value}`
			const dateValue = new Date(`T${value}:00`)
			if(dateValue){
				backup.value = value
				ctx.emit('change', value)
				ctx.emit('date', dateValue)
			}
			// TODO: check to seee if the generated date differs from the component values (essentially, check to see if the date is valid)
			
		})

		onMounted(() => {
			// console.log(now);
			populateValues(now)
		})
		return {
			hour,
			minute,
			seg,
			scroll,
			now
		}
	}
})
</script>
<style lang="scss">
.time-input_cont{
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