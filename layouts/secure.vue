<template>
	<div id="app">
		<div id="app_side" v-if="!loading">
			<add-task-btn/>
		</div>
		<div id="app_core" v-if="!loading">
			
			<div class="top_cont">
				
				<div class="right_cont">
					<div class="links">
							<nice-link :text="link.text"  v-for="link in links" :key="link.id" :to="link.route"/>
					</div>	
					<profile-img/>
				</div>
				<div class="title_cont">
					<p class="title">{{taskNumber}} {{currentTag}}</p>
					<div class="bar"></div>
				</div>
				<div class="search_side">
					<search/>
				</div>
				
			</div>
			
			
			<nuxt/>
			
		</div>
		<alert/>
		
	</div>
</template>

<script lang="ts">

import {defineComponent, getCurrentInstance, onBeforeMount, onMounted, reactive, ref} from '@vue/composition-api'
import Alert from '~/components/general/Alert.vue'
import NiceLink from '~/components/general/niceLink.vue'
import Navigation from '~/components/app/navigation.vue'
import Search from '~/components/app/search.vue'
import AddTaskBtn from '~/components/app/addTaskBtn.vue'
import ProfileImg from '~/components/app/profileImg.vue'
import { tasks, user } from '~/core'
import { emitters } from '~/core/emitters'
import anime from 'animejs' 
const linkArr = [
	{id: 0, route: '/app/', text: 'Dashboard'},
	{id: 2, route: '/app/calendar', text: 'Calendar'},
]
export default defineComponent({
	components: {Alert, Navigation, NiceLink, Search,
	ProfileImg},
	setup(props, ctx){
		const verified = ref<boolean>(false)
		const links = reactive(linkArr)
		const currentTag = ref('Tasks');
		const loading = ref<boolean>(true)
		const vue = getCurrentInstance();

		onBeforeMount(() => {
			verified.value = user.state.verified.value;
			if(!verified.value){
				console.log('user is unverified... redirecting to the verification page...')
				
				vue.$router.push('/unverified')
			}
		})

		const taskNumber = ref<number>();
		const getTasksAmo = () =>  tasks.collection.getGroup('default').value.length;
		onMounted(async () => {
			vue.$nextTick(async () => {
				vue.$nuxt.$loading.start()
				await tasks.load();
				loading.value = false;
				vue.$nuxt.$loading.finish()
				taskNumber.value = getTasksAmo();
				anime({
					targets: vue.$el.querySelectorAll('.link'),
					translateX: ['50%', '0%'],
					duration: 2000,
					opacity: [0, 1],
					delay: anime.stagger(100, {start: 400}),
					easing: 'easeInOutQuad'
				})
			})
			
			
			emitters.tasks.CREATED.on(() => {
				taskNumber.value = getTasksAmo();
			})
		})
		
		return {
			verified,
			links,
			currentTag,
			taskNumber,
			loading
		}
	}
})
</script>
<style lang="scss" scoped>
#app{
	height: 100%;
	min-height: 100vh;
	max-height: 100vh;
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
	.nav-enter-active, .nav-leave-active{
		transition: all 0.2s var(--ease);
	}
	.nav-enter, .nav-leave-to{
		width: 0px;
		height: 0px;
	}

	.page-enter-active, .page-leave-active{
		transition: all 0.4s var(--ease);
	}
	.page-enter, .page-leave-to{
		opacity: 0;
		transform: translateY(30%);
	}
				
}
</style>
