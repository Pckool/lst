<template>
    <div id="app-inner">
        <nuxt-child/>
    </div>
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
    
}   
</style>