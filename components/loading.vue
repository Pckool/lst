<template>
	<transition name="loading">
		<div class="loading-page" v-if="loading">
			<p>Loading...</p>
		</div>
	</transition>
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
		background: var(--black);
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30px;
		font-family: 'Inter', sans-serif;
		z-index: 1000;
		opacity: 1;
		transform: translateY(0%);
	}
	.loading-leave-active{
		transition: all 0.4s var(--ease);
	}
	.loading-enter-active{
		transition: all 0.4s var(--ease);
	}
	.loading-enter, .loading-leave-to{
		// opacity: 0;
		transform: translateY(100%);
	}
</style>