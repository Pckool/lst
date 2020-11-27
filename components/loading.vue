<template>
	<div class="loading-page" v-if="loading">
		<p>Loading...</p>
	</div>
</template>
<script lang="ts">
import {defineComponent, ref} from '@vue/composition-api'
export default defineComponent({
	setup(){
		const loading = ref<boolean>(false);
		const start = () => {
			loading.value  = true;
		}
		const finish = () => {
			loading.value  = false;
		}
		return {
			loading,
			start,
			finish,
		}
	}
})
</script>
<style lang="scss" scoped>
	.loading-page {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.8);
		text-align: center;
		padding-top: 200px;
		font-size: 30px;
		font-family: sans-serif;
	}
</style>