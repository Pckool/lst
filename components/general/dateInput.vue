<template>
	<span class="date-input_cont">
		<span><large-input v-model="month"/></span>
		<span class="sep">/</span>
		<span><large-input v-model="date"/></span>
		<span class="sep">/</span>
		<span><large-input v-model="year"/></span>
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
		const now = new Date()
		const month = ref<string>(`${now.getMonth()+1}`)
		const date = ref<string>(`${now.getDate()+1}`)
		const year = ref<string>(`${now.getFullYear()}`)
		const vue = getCurrentInstance();
        
		watch(month, () =>{
			let newVal = month.value
			if(month.value.length > 2){
				newVal = month.value.substring(0, 2);
			}
			newVal = newVal.replace(/[A-z]/g, '');
			month.value = newVal.padStart(2, '0').trim();
		})
		watch(date, () =>{
			let newVal = date.value
			if(date.value.length > 2){
				newVal = date.value.substring(0, 2);
			}
			newVal = newVal.replace(/[A-z]/g, '');
			date.value = newVal.padStart(2, '0').trim();

		})
		watch(year, () =>{
			let newVal = year.value
			if(year.value.length > 4){
				newVal = year.value.substring(0, 4);
			}
			newVal = newVal.replace(/[A-z]/g, '');
			year.value = newVal.padStart(4, '0').trim();

		})
		watchEffect(() => {
			ctx.emit('change', `${year.value}-${month.value}-${date.value}`)
		})
		return {
			month,
			date,
			year
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
		font-size: 95px;
	}
}
</style>