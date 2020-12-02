<template>
	<span class="custom-icon" @click="$emit('click')">
	</span>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onBeforeMount, onMounted, ref} from '@vue/composition-api'
export default defineComponent({
	props: {
		src: {
			type: String
		},
		
	},
	setup(props){
		// require(`~/static${props.src}`)
		try{
			const svgString = ref<string|null>();
			const vue = getCurrentInstance();
			
			onBeforeMount(async () => {
				console.log()
				const res = await fetch(props.src)
				svgString.value = await res.text()
				vue.$el.innerHTML = svgString.value;
			})
			return {

			}
		} catch(err){
			console.warn(`The SVG file ${props.src} could not be read`)
		}
	}
})
</script>
<style lang="scss">
.custom-icon{
	
}
</style>