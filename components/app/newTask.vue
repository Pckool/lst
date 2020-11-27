<template>
    <div id="new-task_cont">
        <div class="header">
            <h1>new task</h1>
            <p class="close_icon" @click="$emit('close')">X</p>
        </div>
        <div class="sub-header">
            <div :class="'tag ' + task.tag.color"></div>
        </div>
        <div class="body">
            <div class="in-cont">
                <label>What would you like to do?</label>
                <textarea cols="30" rows="10" class="text" v-model="text"></textarea>
            </div>
            <div class="in-cont">
                <label>When is it due?</label>
                <div class="in-row">
                    <input type="date" v-model="date">
                    <input type="time" v-model="time">
                </div>
                
            </div>
            <button @click="submit">Create</button>
        </div>
    </div>
</template>
<script lang="ts">
import {defineComponent, reactive, ref} from '@vue/composition-api'
import { PendingTask, Task, tasks, user } from '~/core'
import DynamicInput from '~/components/general/dynamicInput.vue'
export default defineComponent({
    components: {DynamicInput},
    setup(){
        const task = reactive<PendingTask>(tasks.state.pending.value)
        const text = ref<string>('Pick up dog food')
        const ts = new Date(task.ts)
        const time = ref<string>(`${ts.getHours()}:${ts.getMinutes()}`)
        const date = ref<string>(`${ts.getFullYear()}-${ts.getMonth()+1}-${ts.getDate()}`)
        const submit = () => {
            const newTs = new Date(ts);
            const splitTime = time.value.split(':').map(v => Number(v))
            const splitDate = date.value.split('-').map(v => Number(v))
            
            newTs.setHours(splitTime[0], splitTime[1])
            newTs.setFullYear(splitDate[0], splitDate[1], splitDate[2])
            task.ts = newTs.getTime()
            task.text = text.value
            task.owner = user.state.id.value
            tasks.add(task);
        }
        return {
            task,
            text,
            time,
            date,
            submit
        }
    }
})
</script>
<style lang="scss">
#new-task_cont{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--darkBlueGrey);
    border-radius: 25px 25px 0 0;
    
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3em 6em 3em 6em;
        h1{
            margin: 0;
        }
        .close_icon{
            cursor: pointer;
            transition: all 0.2s ease;
            &:hover{
                color: var(--red);
            }
        }
    }
    .sub-header{
        padding: 1em 6em 3em 6em;
        .tag{
            width: 70px;
            height: 20px;
            border-radius: 50em;
        }
        
    }
    .in-cont{
        display: flex;
        flex-flow: column nowrap;
        padding-bottom: 1em;
        .in-row{
            display: flex;
            flex-flow: row;
            margin-top: 1em;
            input{
                min-height: 0;
                min-width: 0;
                flex-grow: 0;
                margin-right: 1em;
                font-size: 26px;
                font-weight: 300;
            }
        }
    }
    .body{
        padding: 5em 6em 1em 6em;
        
        .text{
            margin-top: 1em;
        }
    }
}    
</style>