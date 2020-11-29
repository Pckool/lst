<template>
	<div ref="cont" class="profile-icon_cont" hasimage="false">
		<div class="profile-icon" @click="choose">
			<div class="overlay">
				
			</div>
			<img src="/images/download.svg" alt="" class="ico">
			<input ref="input" id="file-input_profile-icon" type="file" name="name" style="display: none;" @change="imgChange"/>
			<img :src="imgData" alt="" class="img">
			
		</div>
		<transition name="undo">
			<small class="undo" v-if="imgData && waiting" @click="undo">undo</small>
		</transition>
	</div>
	
</template>
<script lang="ts">
import {defineComponent, onMounted, ref, watch} from '@vue/composition-api'
import { user } from '~/core'
export default defineComponent({
	setup(){
		const input = ref<HTMLInputElement>();
		const cont = ref<HTMLElement>();
		const imgData = ref<string>(user.state.img_url.value);
		const waiting = ref<boolean>(false)
		let timeout = null;
		
		const choose = (e) => {
			input.value.click();
		}
		const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
			const fr = new FileReader();
			fr.readAsDataURL(file);
			fr.onload = () => resolve(fr.result.toString());
			fr.onerror = err => reject(err);
		})
		const imgChange = async (e) => {
			const file = (<HTMLInputElement>e.target).files[0];
			if(file){
				imgData.value = await toBase64(file);
				console.log(imgData);
				waiting.value = true;
				if(timeout) {
					clearTimeout(timeout);
				}
				timeout = setTimeout(() => {
					// wait for 5 seconds, then save the image
					user.state.img_url.set(imgData.value);
					user.update()

				}, 5000)
			}
			
			
		}
		const undo = () => {
			if(imgData.value && waiting.value){
				if(timeout){
					clearTimeout(timeout);
				}
				imgData.value = user.state.img_url.value;
			}
		}
		onMounted(() => {
			imgData.value = user.state.img_url.value;
			// input.value.onchange = (e) => {
			// 	imgChange(e)
			// }
		})
		watch(imgData, () => {
			if(imgData.value && imgData.value !== ""){
				cont.value.setAttribute('hasimage', `${true}`);
			} else {
				cont.value.setAttribute('hasimage', `${false}`);
			}
		})
		return {
			choose,
			input,
			imgChange,
			imgData,
			cont,
			waiting,
			undo
		}
	}
})
</script>
<style lang="scss">
.profile-icon_cont{
	height: 50px;
	width: 50px;
	margin-left: 1.5em;
	
	position: relative;
	.profile-icon{
		overflow: hidden;
		border-radius: 50%;
		background: white;
		position: relative;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		cursor: pointer;
		.overlay{
			background: rgba($color: #000000, $alpha: 0.4);
			height: 110%;
			width: 110%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: 0;
			transition: all 0.2s var(--ease);
			z-index: 10;
		}
		.img{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			height: 100%;
			// z-index: ;
		}
		.ico{
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			transition: all 0.2s var(--ease);
			opacity: 0;
			z-index: 20;
		}
		&:hover{
			.overlay, .ico{
				opacity: 1;
			}
			
		}
	}
	
	.undo{
		position: absolute;
		bottom: -18px;
		left: 50%;
		font-size: 10px;
		text-decoration: underline;
		transform: translate(-50%, 0%);
		opacity: 1;
		cursor: pointer;
	}
	.undo-enter-active, .undo-leave-active{
		transition: all 0.2s var(--ease) 0.3s;
	}
	.undo-enter, .undo-leave-to{
		opacity: 0;
		transform: translate(-50%, -40%);
	}
	
}
</style>