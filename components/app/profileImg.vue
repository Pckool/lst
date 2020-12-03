<template>
	<div ref="cont" class="profile-icon_cont" hasimage="false">
		<div class="profile-icon" @click="choose">
			<div class="overlay">
				
			</div>
			<svg-icon src="/images/Download.svg" alt="" class="ico"/>
			<input ref="input" id="file-input_profile-icon" type="file" name="name" style="display: none;" @change="imgChange" accept=".jpg, .jpeg, .png"/>
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
			let file = (<HTMLInputElement>e.target).files[0];
			if(file){
				const can: HTMLCanvasElement = document.createElement('canvas')
				const img: HTMLImageElement = document.createElement('img')

				// image compression to a much lower resolution
				img.src = await toBase64(file)
				img.onload = async () => {
					const h = img.height
					const w = img.width
					const targetWidth = 245
					if(h > targetWidth || w > targetWidth){
						can.height = h
						can.width = w
						const ctx = can.getContext("2d")
						let nH = h;
						let nW = w;
						if(w>h) nW = h
						else nH = w
						
						const ratio = targetWidth / img.width
						ctx.drawImage(img, 0, 0, targetWidth, img.height*ratio);
						can.height = img.height*ratio
						can.width = targetWidth
						const data = can.toDataURL()
						console.log(data)
						imgData.value = data;
					}
					else{
						imgData.value = img.src;
					}
				}
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
				console.log('cancalled image upload')
				imgData.value = user.state.img_url.value;
				waiting.value = false;
			}
		}
		const checkIfImgIsSet = () => {
			if(imgData.value && imgData.value !== ""){
				cont.value.setAttribute('hasimage', `${true}`);
			} else {
				cont.value.setAttribute('hasimage', `${false}`);
			}
		}
		watch(imgData, () => checkIfImgIsSet)
		onMounted(() => {
			imgData.value = user.state.img_url.value;
			checkIfImgIsSet()
			
			// input.value.onchange = (e) => {
			// 	imgChange(e)
			// }
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
		background: var(--white);
		position: relative;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		cursor: pointer;
		transition: all 0.2s var(--ease);
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
	&[hasimage="true"]{
		.profile-icon{
			background: rgba($color: #000000, $alpha: 0.0);
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