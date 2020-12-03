<template>
	<div id="app">
		<div id="app_side" v-if="!loading">
			<add-task-btn/>
			<svg-icon src="/images/logout.svg" @click="logout" class="logout-btn"/>
			<transition name="new-task-con" :css="true" mode="out-in">
				<new-task v-if="openNewTask" @close="openNewTask=false" class=""  key="new-task-panel"/>
			</transition>
		</div>
		<div id="app_core" v-if="!loading" :blur="blur">
			
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
			<add-task-btn-mobile/>
			
		</div>
		<new-task-mobile v-if="openNewTask && mobile" @close="openNewTask=false" class=""/>
		<alert/>
		
	</div>
</template>

<script lang="ts">

import {defineComponent, getCurrentInstance, onBeforeMount, onBeforeUnmount, onMounted, reactive, ref} from '@vue/composition-api'
import Alert from '~/components/general/Alert.vue'
import NiceLink from '~/components/general/niceLink.vue'
import Navigation from '~/components/app/navigation.vue'
import Search from '~/components/app/search.vue'
import AddTaskBtn from '~/components/app/addTaskBtn.vue'
import AddTaskBtnMobile from '~/components/app/addTaskBtnMobile.vue'
import ProfileImg from '~/components/app/profileImg.vue'
import newTask from '~/components/app/newTask.vue'
import newTaskMobile from '~/components/app/newTaskMobile.vue'
import { tasks, user, emitters } from '~/core'
import anime from 'animejs' 
const linkArr = [
	{id: 0, route: '/app/', text: 'Dashboard'},
	{id: 2, route: '/app/calendar', text: 'Calendar'},
]
export default defineComponent({
	components: {Alert, Navigation, NiceLink, Search,
	ProfileImg, newTask, AddTaskBtnMobile, newTaskMobile},
	setup(props, ctx){
		const verified = ref<boolean>(false)
		const links = reactive(linkArr)
		const currentTag = ref('Tasks');
		const loading = ref<boolean>(true)
		const vue = getCurrentInstance();
		const blur = ref<boolean>(false)
		const mobile = ref<boolean>(false)

		onBeforeMount(() => {
			verified.value = user.state.verified.value;
			if(!verified.value){
				console.log('user is unverified... redirecting to the verification page...')
				
				vue.$router.push('/unverified')
			}
		})

		const findIsMobile = () => {
			if(document.body.offsetWidth < 816) {
				mobile.value = true
			}
			else{
				mobile.value = false
			}
		}

		// task stuff
		const openNewTask = ref<boolean>(false)
        onMounted(() => {
            emitters.tasks.NEW.on(payload => {
                console.log('new event being created!')
				openNewTask.value = false;
				tasks.state.pending.set(payload);
				openNewTask.value = true;
			})
			emitters.tasks.CREATED.on(payload => {
				
				openNewTask.value = false;
				taskNumber.value = getTasksAmo();
			})
        })

		// task number stuff
		const taskNumber = ref<number>();
		const getTasksAmo = () =>  tasks.collection.getGroup('default').value.length;

		// general "onMounted" 
		onMounted(async () => {
			vue.$nextTick(async () => {
				vue.$nuxt.$loading.start()
				await tasks.load();
				loading.value = false;
				vue.$nuxt.$loading.finish()
				taskNumber.value = getTasksAmo();
				findIsMobile()

				window.addEventListener('resize', findIsMobile)
				anime({
					targets: vue.$el.querySelectorAll('.link'),
					translateX: ['50%', '0%'],
					duration: 2000,
					opacity: [0, 1],
					delay: anime.stagger(100, {start: 400}),
					easing: 'easeInOutQuad'
				})
			})

			emitters.general.BLUR.on(val => {
				blur.value = val;
			})
		})
		onBeforeUnmount(() => {
			window.removeEventListener('resize', findIsMobile)
		})

		const logout = async () => {
			try{
				vue.$nuxt.$loading.start()
				await user.logout()
				vue.$nuxt.$loading.finish()
				vue.$router.push('/')
			} catch(err){
				console.error(err)
			}
			
		}
		
		return {
			verified,
			links,
			currentTag,
			taskNumber,
			loading,
			openNewTask,
			logout,
			blur,
			mobile
		}
	}
})
</script>
<style lang="scss" scoped>
$bp1: 1800px;
$bp2: 1400px;
$bp3: 1200px;
$bp4: 816px;
$bp5: 711px;
$bp6: 520px;
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
		padding: 8em 2em 2em 2em;
		position: relative;
		justify-content: space-between;
		.logout-btn{
			cursor: pointer;
		}
		@media screen and (max-width: $bp4) {
			display: none;
		}
	}
	#app_core{
		transition: all 0.4s var(--ease);
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
			padding: 3em 5em 3em 3em;
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

			@media screen and (max-width: $bp3) {
				display: none;
			}
		}
		
		
		.nuxt-link-exact-active{
			color: var(--red);
			& + .effect {
				&:hover{
					width: 0% !important;
				}
			}
		}
		@media screen and (max-width: $bp3) {
			justify-content: space-between;
		}
		@media screen and (max-width: $bp5) {
			.title_cont{
				display: none;
			}
			.right_cont{
				padding-left: 1em;
			}
		}
		@media screen and (max-width: $bp6) {
			.right_cont{
				padding-right: 1em;
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
	#blur-app{
		position: fixed;
		height: 100%;
		widows: 100%;
		top: 0;
		left: 0;
		z-index: 700;
		filter: blur(3px);
	}
	[blur="true"]{
		filter: blur(3px);
		pointer-events: none;
	}

	
				
}
.new-task-con-enter-active, .new-task-con-leave-active{
	transition: all 0.6s var(--ease);
}
.new-task-con-enter, .new-task-con-leave-to{
	// width: 0%;
	opacity: 0;
	transform: translateX(-30%);
}
</style>
