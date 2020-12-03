<template>
	<div class="main-cont" v-show="done">
		<div class="background">

		</div>
		<div class="left">
			<!-- <img src="/images/lox_wordartcolored-words_1x.png" height="70" alt="Loxly"/> -->
			<!-- <logo style="height: 60px;width: auto;"/> -->
			<div class="catcher_cont">
				<div class="catcher">
					<h1>
						<div>LST</div> 
					</h1>
					<h6><div>Get it, together!</div></h6>
				</div>
				
				
				
			</div>
		</div>
		<div class="right login">
			<div class="inputs">
				<dynamic-input v-model="username" placeholder="email" type="email">

				</dynamic-input>
				
				<dynamic-input v-model="pass" placeholder="password" type="password">
					<small class="ho-or forgot-pass" @click="forgotPass">Forgot Password</small>
				</dynamic-input>
			</div>
				
				
			<div class="login_submit">
				<button id="submit" @click="defaultLogin" @keyup.enter="defaultLogin" >
					<i v-show="loading" class="loading-icon fas fa-circle-notch"></i>
					<span v-show="!loading">Login</span>
				</button>
				
			</div>

			
			
		</div>
		
		<forgot-pass v-if="reset"></forgot-pass>
	</div>
</template>

<script lang="ts">
import ForgotPass from '~/components/user/ForgotPass.vue';
import DynamicInput from '~/components/general/dynamicInput.vue'
import anime from 'animejs';

import Vue from 'vue'
import core, {alerts, root, user} from '~/core';


export default Vue.extend({
	// middleware: 'autoLogin',
	layout: 'StartLayout',
	data(){
		return {
			username: '',
			pass: '',
			loading: false,
			reset: false,
			done: false,
		}
	},
	components: {ForgotPass, DynamicInput},
	methods: {
		forgotPass(){
			this.reset = true;
		},
		defaultLogin(){
			var app = this;
			if(this.username && this.pass){
				// alert('You are trying to log in! I don\'t have that system yet');
				this.loading = true;
				document.getElementById('submit')?(<HTMLFormElement>document.getElementById('submit')).disabled = true:undefined;
				anime({
					targets: '.loading-icon',
					rotate: '360deg',
					duration: 700,
					loop: true,
					easing: 'easeInOutQuad'
				});
				// console.log(root)
				
				// this.$axios.post(`${root.state.authURL.value}/user/login`, {
				// 	username: this.username,
				// 	pass: this.pass
					
				// }, { withCredentials: true })
				user.login(this.username, this.pass)
				.then((res) => {
					// console.log(res);
					
					
					this.loading = false;
					document.getElementById('submit')?(<HTMLFormElement>document.getElementById('submit')).disabled = false:undefined;
					
					
					// app.$cookies.set('id', res.data.id);
					anime.timeline({
						
						easing: 'easeInOutQuad',
						duration: 1000,
						complete: () => {
							this.$router.push({name: 'app'})
						}
					}).add({
						targets: '.right .dyn-input, .right button',
						delay: anime.stagger(300),
						opacity: [1, 0],
						translateX: ['0%', '100%'],
					}, '-=1000').add({
						targets: '.left h1 div, .left h6 div',
						translateX: ['0%', '-100%'],
						delay: anime.stagger(300),
					}, '-=1000')
					
					
				})
				.catch( err => {
					console.warn(err);
					this.loading = false;
					(<HTMLFormElement>document.getElementById('submit')).disabled = false;
					if(err.msg){
						return alert(err.msg);
					}
					alerts.create({message: 'Incorrect Username or Password!'});
				});
			}
			else{
				// alert('Please enter your username and password')
				alerts.create({message: 'Please enter your username and password'});
			}
			
		}
	},
	created(){
		if(core.user.state.email.value) this.username = core.user.state.email.value;
	},
	async mounted(){
		let time_id = Date.now();
		try {
			console.time('auth-request-'+time_id)
			let res = await core.user.auth();
			if (res.status === 200) {
				console.timeLog("auth-request-"+time_id, 'authentication request successful!');
				this.$router.push('/app');
			} else {
				console.timeLog("auth-request-"+time_id, 'Authentication request failed.');
			}
		} catch (err) {
			console.timeLog("auth-request-"+time_id, 'authentication request took too long or failed...');
			// console.error(err);
			
		} finally{
			console.timeEnd('auth-request-'+time_id)
		}
		this.done=true;
		anime.timeline({
			easing: 'easeInOutQuad',
			duration: 1000,
		}).add({
			targets: '.left h1 div',
			translateX: ['-100%', '0%'],
			delay: anime.stagger(300),
		}, '+=1000').add({
			targets: '.left h6 div',
			translateX: ['-100%', '0%'],
		}, '-=800').add({
			targets: '.right .dyn-input, .right button',
			delay: anime.stagger(300),
			opacity: [0, 1],
			translateX: ['100%', '0%'],
		}, '-=200')
		
	}
})
</script>

<style lang="scss" scoped>

.main-cont{
	.background{
		background: var(--loxBeige);
		z-index: 1;
	}
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
	max-width: 100vw;
	width: 100%;
	.forgot-pass{
		white-space: nowrap;
	}
	.left {
		position: relative;
		top: 0;
		left: 0;
		// height: 100%;
		// width: max-content;
		z-index: 100;
		// background: var(--loxBeige);
		padding: 3em;
		flex-grow: 1;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		@media screen and (max-width: 990px){
			display: none;
		}
		.catcher_cont{
			// padding-top: 3rem;
			display: flex;
			flex-flow: column nowrap;
			// align-items: center;
			justify-content: center;
			height: 100%;
			padding: 3em;
			.catcher{
				display: flex;
				flex-flow: column nowrap;
				h1{
					display: inline-block;
					margin: 0;
					color: var(--loxOrange);

					padding-bottom: 0.7em;

					overflow: hidden;
					
					
					@media screen and (max-width: 3830px){
						font-size: 95px;
					}
					@media screen and (max-width: 1830px){
						font-size: 61px;
					}
					@media screen and (max-width: 1280px){
						font-size: 47px;
					}
					@media screen and (max-width: 1080px){
						font-size: 34px;
					}
				}
				h6{
					color: var(--loxGrey);
					display: inline-block;
					overflow: hidden;
					margin: 0;
					@media screen and (max-width: 1080px){
						font-size: 16px;
					}
				}
			}
			
		}

	}

	.right {
    	z-index: 50;
		position: relative;
		padding: 1em;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		// width: 36%;
		flex-grow: 1;
		@media screen and (max-width: 990px){
			width: 100%;
		}
		.inputs {
			display: flex;
			flex-flow: column nowrap;
			justify-content: center;
			align-items: center;
			margin-bottom: 1em;
		}
		.dyn-input{
			position: relative;
			// margin-bottom: 1em;
			
			.dyn-input_placeholder{
				position: absolute;
				top: 0;
				left: 0;
				
			}
			.dyn-input_extra{
				position: absolute;
				bottom: 0;
				right: 0;
			}
		}
		.login_submit{
			display: flex;
			button{
				flex-grow: 1;
			}
		}
	}
}
</style>
