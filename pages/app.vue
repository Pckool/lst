<template>
    <transition id="app-inner" name="page">
        <nuxt-child/>
    </transition>
</template>

<script lang="ts">
import {defineComponent, onMounted} from '@vue/composition-api'
import {tasks} from '~/core'
export default defineComponent({
    layout: 'secure',
    setup(){
        
    }
})
</script>

<style lang="scss">
#app-inner{
    display: flex;
    flex-grow: 1;
    opacity: 1;
}   
</style>