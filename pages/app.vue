<template>
    <div id="app-inner">
        <transition name="page">
            <nuxt-child/>
        </transition>
        
    </div>
    
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from '@vue/composition-api'
// import newTask from '~/components/app/newTask.vue'
import core, {tasks} from '~/core'
export default defineComponent({
    layout: 'secure',
    components: {},
    setup(){
        
        return {
            // openNewTask,
        }
    }
})
</script>

<style lang="scss">
#app-inner{
    display: flex;
    flex-grow: 1;
    opacity: 1;
}   
.page-enter-active, .page-leave-active{
    transition: all 0.4s var(--ease);
}
.page-enter, .page-leave-to{
    opacity: 0;
    transform: translateY(30%);
    // width: 0%;
}
</style>