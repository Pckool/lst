<template>
	<span class="custom-icon" @click="$emit('click')">
	</span>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, ref} from '@vue/composition-api'
export default defineComponent({
	props: {
		src: {
			type: String
		},
		
	},
	setup(props){
		try{
			const svgString = ref<string|null>();
			const vue = getCurrentInstance();

			onMounted(async () => {
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