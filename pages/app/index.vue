<template>
    <div id="inner-tasks">
        <transition-group name="tasks" class="task-list">
            <div class="task" v-for="task in tasks" :key="task.id">
                <span @click="deleteTask(task)" :id="task.id">X</span>
            </div>
        </transition-group>
        <transition name="new-task">
            <new-task v-if="openNewTask" @close="openNewTask=false"/>
        </transition>
    </div>
</template>
<script lang="ts">
import hash from 'object-hash'
import {defineComponent, onMounted, reactive, ref} from '@vue/composition-api'
import core, { PendingTask, Task, tasks } from '~/core'
import newTask from '~/components/app/newTask.vue'
const tasksArr: Array<Task|PendingTask> = [
    
]
export default defineComponent({
    components: {newTask},
    setup(){
        const _tasks = reactive<Array<Task|PendingTask>>(tasksArr)
        const openNewTask = ref<boolean>(false)
        onMounted(() => {
            core.emitters.tasks.NEW.on(payload => {
                openNewTask.value = true;
                tasks.state.pending.set(payload);
                
                // const id = tasks.length-1 !== -1 ? tasks.length-1 : tasks.length
                // const task = tasks[id]
                // tasks.push({id: `${hash(task||{})}`, ...payload})
                // if(tasks.length > 3) {
                //     tasks.pop()
                // }
            })
        })
        const deleteTask = (task: Task) => {
            console.log('yup')
            const i = _tasks.indexOf(task)
            _tasks.filter(task => task !== tasks[i])
            let loop = 0;
            let loopTask = null
            do{
                _tasks.pop()
                if(loop > 0){
                    _tasks.push(task)
                }
                loop++
            } while(loop < _tasks.length)
        }
        
        return {
            tasks: _tasks,
            deleteTask,
            openNewTask
        }
    }
})
</script>
<style lang="scss">
#inner-tasks{
    position: relative;
    flex-grow: 1;
    .task-list{
        display: flex;
        flex-flow: row wrap;
        .task{
            height: 200px;
            width: 400px;
            border-radius: 25px;
            background: var(--blueGrey);
        }
    }
    
    .tasks-enter-active, .tasks-leave-active{
        transition: all 0.2s var(--ease);
    }
    .tasks-enter, .tasks-leave-to{
        width: 0px;
    }
    .new-task-enter-active, .new-task-leave-active{
        transition: all 0.2s var(--ease);
    }
    .new-task-enter, .new-task-leave-to{
        height: 0px;
    }
}
</style>