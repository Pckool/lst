<template>
	<div id="app">
		<div id="app_side">
			<add-task-btn/>
		</div>
		<div id="app_core">
			
			<div class="top_cont">
				
				<div class="right_cont">
					<div class="links">
						<nice-link :text="link.text"  v-for="link in links" :key="link.id" :to="link.route"/>
					</div>
					<div id="profile-icon_nav">

					</div>
				</div>
				<div class="title_cont">
					<p class="title">{{currentTag}}</p>
					<div class="bar"></div>
				</div>
				<div class="search_side">
					<search/>
				</div>
				
			</div>
			
			
			<nuxt />
		</div>
		<alert/>
		
	</div>
</template>

<script lang="ts">
import Alert from '~/components/general/Alert.vue'
import NiceLink from '~/components/general/niceLink.vue'
import Navigation from '~/components/app/navigation.vue'
import Search from '~/components/app/search.vue'
import AddTaskBtn from '~/components/app/addTaskBtn.vue'
import {defineComponent, getCurrentInstance, onBeforeMount, reactive, ref} from '@vue/composition-api'
import { user } from '~/core'
const linkArr = [
	{id: 0, route: '/app/', text: 'Dashboard'},
	{id: 1, route: '/app/groups', text: 'Groups'},
	{id: 2, route: '/app/calendar', text: 'Calendar'},
]
export default defineComponent({
	components: {Alert, Navigation, NiceLink, Search},
	setup(props, ctx){
		const verified = ref<boolean>(false)
		const links = reactive(linkArr)
		const currentTag = ref('Tasks');
		onBeforeMount(() => {
			verified.value = user.state.verified.value;
			if(!verified.value){
				console.log('user is unverified... redirecting to the verification page...')
				const ctx = getCurrentInstance();
				ctx.$router.push('/unverified')
			}
		})
		return {
			verified,
			links,
			currentTag
		}
	}
})
</script>
<style lang="scss" scoped>
#app{
	height: 100%;
	min-height: 100vh;
	margin: auto;
	position: relative;
	top: 0;
	left: 0;
	display: flex;
	flex-flow: row;
	#app_side{
		display: flex;
		flex-flow: column;
		border-right: 1px solid var(--darkGrey);
		padding: 8em 2em;
		
	}
	#app_core{
		display: flex;
		flex-flow: column;
		flex-grow: 1;
	}
	.top_cont{
		position: relative;
		top: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-flow: row-reverse nowrap;
		justify-content: flex-start;
		align-items: center;
		z-index: 200;
		pointer-events: none;
		.right_cont{
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			align-items: center;
			padding: 3em;
			pointer-events: all;
			.links{
				display: flex;
				flex-flow: row nowrap;
				
			}
			#profile-icon_nav{
				height: 50px;
				width: 50px;
				margin-left: 1.5em;
				background: white;
				border-radius: 50%;
				cursor: pointer;
			}
		}
		.title_cont{
			pointer-events: all;
			padding: 3em 5em;
			display: flex;
			align-items: center;
			justify-content: center;
			.title{

			}
			.bar{
				height: 1px;
				width: 50px;
				margin-left: 1em;
				background: var(--white);
			}
		}
		.search_side{
			padding: 3em 5em;
			display: flex;
			align-items: center;
			justify-content: flex-start;
			flex-grow: 1;
		}
		
		
		.nuxt-link-exact-active{
			color: var(--red);
			& + .effect {
				&:hover{
					width: 0% !important;
				}
			}
		}
		
		
	}		
	
				
}
</style>
