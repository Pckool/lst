<template>
	
	<div class="main-cont">
		<div class="background">

		</div>
		<div class="left">
			<!-- <img src="/images/lox_wordartcolored-words_1x.png" height="70" alt="Loxly"/> -->
			<!-- <logo style="height: 60px;width: auto;"/> -->
			<div class="catcher_cont">
				<div class="catcher">
					<h1>
						<div>be a do-er.</div> 
					</h1>
					<h6><div>Welcome to a minimalist's organization dream.</div></h6>
				</div>
				
				
				
			</div>
		</div>
		<div class="right login">

				<dynamic-input v-model="name" placeholder="your name" type="text">
					<small class="error">{{name_error}}</small>
				</dynamic-input>
				
				<dynamic-input v-model="username" placeholder="email" type="email" @blur="checkEmail">
					<small class="error">{{email_error}}</small>
				</dynamic-input>
				<dynamic-input v-model="number" placeholder="phone" type="tel"/>
					

				<dynamic-input v-model="pass" placeholder="password" type="password"/>
					

				
				<dynamic-input v-model="passconfirm" placeholder="password (again)" type="password" @keyup.enter="register" @blur="checkPass">
					<small class="error">{{pass_error}}</small>
				</dynamic-input>
				<div class="login_submit">
					<button id="submit" @click="register" >
						<i v-show="loading" class="loading-icon fas fa-circle-notch"></i>
						<span v-show="!loading">Signup</span>
					</button>
					
				</div>
			
			
		</div>
	</div>
</template>

<script lang="ts">
import DynamicInput from '~/components/general/dynamicInput.vue'
import anime from 'animejs';

import Vue from 'vue'
import core, {alerts, root, user} from '~/core';
// import axios from 'axios'

export default Vue.extend({
	
	data(){
		return {
			name: '',
			username: '',
			pass: '',
			passconfirm: '',
			pass_error: '',
			email_error: '',
			name_error: '',
			number: '',
			valid: false,
			loading: false, 
		}
	},
	components: {DynamicInput},
	methods: {
		register(){
			if(this.username && this.pass && this.name && this.pass === this.passconfirm){
				this.loading = true;
				(<HTMLFormElement>document.getElementById('submit')).disabled = true;
				anime({
					'targets': '.loading-icon',
					'rotate': '360deg',
					
					'duration': 700,
					'loop': true,
					'easing': 'easeInOutQuad'
				});
				user.register({
					username: this.username,
					pass: this.pass,
					name: this.name,
					namespaces: [],
					number: this.number
				})
				.then((res) => {
					this.loading = false;
					(<HTMLFormElement>document.getElementById('submit')).disabled = false;
					
					anime.timeline({
						easing: 'easeInOutQuad',
						duration: 1000,
						complete: () => {
							user.login(this.username, this.pass).then((res) => {
								this.$router.push('/app')
							})
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
				.catch(err => {
					console.error(err);
					alerts.create({message: 'There was an issue creating your account.'})
					this.loading = false;
					(<HTMLFormElement>document.getElementById('submit')).disabled = false;
				});

			}
			else{
				
				alerts.create({message: 'Check the fields and try again!'});
			}
			
		},
		checkPass(){
			if(this.pass !== this.passconfirm){
				this.pass_error = 'The passwords are not the same.';
			}
			else this.pass_error = '';
		},
		checkEmail(){
			if(!this.username.includes('@') && !this.username.includes('.')){
				this.email_error = 'This is not a valid email!';
			}
			else this.email_error = '';
				

		}
	},
	created(){
		if(core.user.state.email.value) this.username = core.user.state.email.value;
	},
	mounted(){
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
		
	},
	watch: {
		loading(){
			if(this.loding){
				this.$nuxt.$loading.start();
			}
			else{
				this.$nuxt.$loading.finish();
			}
		}
	}
})
</script>

<style lang="scss" scoped>
.error{
	color: var(--red);
}
.main-cont{
	.background{
		background: var(--black);
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
		// width: max-content;
		
		z-index: 50;
		// background: var(--loxBeige);
		padding: 3em;
		flex-grow: 1;
		display: flex;
		flex-flow: column nowrap;
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
					@media screen and (max-width: 990px){
						font-size: 48px;
					}
				}
				h6{
					color: var(--grey);
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
		flex-grow: 1;
		min-width: 36%;
		@media screen and (max-width: 990px){
			width: 100%;
		}
		.dyn-input{
			position: relative;
			margin-bottom: 1em;
			
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
