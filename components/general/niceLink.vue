<template>
    <div class="link" :key="id">
        <nuxt-link :to="to">{{text}}</nuxt-link>
        <div class="effect"></div>
    </div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, ref} from '@vue/composition-api'
export default defineComponent({
    props: {
        text: {type: String},
        to: {type: String},
        id: {type: String}
    },
    setup(){
        const el = ref<HTMLElement>(<HTMLElement>getCurrentInstance().$el)
        
        return {
            el,
        }
    }
})
</script>
<style lang="scss">
.link{
    // margin: 0 1.5em;
    margin: 0em 1.5em;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    width: fit-content;
    // padding: 0.4em 0;
    
    .effect{
        position: absolute;
        bottom: 0;
        left: 0;
        height: 1px;
        width: 0%;
        background: var(--white);
        transition: all 0.2s var(--ease);
        margin-bottom: -0.4em
    }
    &:hover{
        .effect{
            width: 100%;
        }
        .nuxt-link-exact-active{
            color: var(--red);
            cursor: default;
			& + .effect {
				
				width: 0% !important;
				
			}
		}
    }
    a{
        text-decoration: none;
    }
}
</style>