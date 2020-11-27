<template>
	<div id="app">
		<div class="top_cont">
			
			<div class="toggle">
				<nuxt-link :to="{name: 'index'}">login</nuxt-link>
				<nuxt-link :to="{name: 'register'}">signup</nuxt-link>

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
import {defineComponent} from '@vue/composition-api'
export default defineComponent({
	components: {Alert},
})
</script>
<style lang="scss">
#app{
	height: 100%;
	background: var(--loxBeige);
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
					color: var(--loxOrange) !important;
		}
		.toggle{
			margin: 3em;
			position: relative;
			pointer-events: all;
			a{
				margin-left: 1em;
				position: relative;
				// &::after{
				// 	content: "";
				// 	position: absolute;
				// 	top: 50%;
				// 	left: 50%;
				// 	transform: translate(-50%, -50%);
				// 	transition: all 0.1s ease-out;
				// 	width: 0%;
				// 	height: 0px;
				// 	// border-radius: 10em;
				// 	background: rgba(0,0,0,0);
				// 	mix-blend-mode: difference;
				// }
				&:hover {
					color: var(--loxOrange);
					// &::after{
					// 	width: 100%;
					// 	height: 21px;
					// 	padding: 1em;
					// 	background: var(--loxBlack);
					// }
				}
			}
			.bar{
				height: 1px;
				width: 0%;
				position: absolute;
				bottom: 0;
				left: 0;
				background: var(--loxBlack);
			}
		}
		
	}		
	.branding{
		font-family: 'Roboto';
		.logo{
			height: 17px;
			width: auto;
		}
	}
				
}
</style>
