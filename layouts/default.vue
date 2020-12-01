<template>
	<div id="app">
		<div class="top_cont">
			
			<div class="toggle">
				<nice-link to="/" text="login"/>
				<nice-link to="/register" text="signup"/>

				<!-- <div class="bar"></div> -->
			</div>
			<div class="logo_main">
				
			</div>
			
		</div>
		<alert/>
		<nuxt />
	</div>
</template>

<script lang="ts">
import Alert from '~/components/general/Alert.vue'
import NiceLink from '~/components/general/niceLink.vue'
import {defineComponent} from '@vue/composition-api'
export default defineComponent({
	components: {Alert, NiceLink},
})
</script>
<style lang="scss">
#app{
	height: 100%;
	background: var(--black);
	min-height: 100vh;
	margin: auto;
	position: relative;
	top: 0;
	left: 0;
	display: flex;
	flex-flow: column;
	.top_cont{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-flow: row-reverse nowrap;
		justify-content: space-between;
		align-items: center;
		z-index: 200;
		pointer-events: none;
		.logo_main{
			margin: 3em;
			pointer-events: all;
		}
		.nuxt-link-exact-active{
			color: var(--red) !important;
		}
		.toggle{
			margin: 3em;
			position: relative;
			pointer-events: all;
			display: flex;
			
			.bar{
				height: 1px;
				width: 0%;
				position: absolute;
				bottom: 0;
				left: 0;
				background: var(--black);
			}
		}
		
	}	
	.main-cont{
		height: 100%;
		padding-top: 3em;
		flex-grow: 1;
	}	
				
}
</style>
