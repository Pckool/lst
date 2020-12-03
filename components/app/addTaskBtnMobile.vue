<template>
    <div class="plus-expandable_mobile">
        <div class="expanded-box">
            <div class="options">
                <div :class="'option '+option.tag.color" v-for="option in options" :key="option.id" :tag="option.tag.color" @click="makeNewTask">

                </div>
            </div>
            
        </div>
        <img class="plus" src="/images/plus_circle.svg" alt="plus_circle.svg" >
        
    </div>
</template>
<script lang="ts">
import {defineComponent, reactive} from '@vue/composition-api'
import core, { tasks } from '~/core'
const optionsArr = [
    {id: 0, tag: {title: 'important', color: 'red' }},
    {id: 1, tag: {color: 'yellow', title: 'interesting'}},
    {id: 2, tag: {color: 'orange', title: 'important'}},
    {id: 3, tag: {color: 'pink', title: 'interesting'}},
    {id: 4, tag: {color: 'green', title: 'important'}},
    {id: 5, tag: {color: 'blue', title: 'interesting'}},
    {id: 6, tag: {color: 'purple', title: 'interesting'}},
]
export default defineComponent({
    setup(props, ctx){
        const options = reactive(optionsArr)
        const makeNewTask = (event: Event) => {
            const el = <HTMLElement> event.target;
            const tag = el.getAttribute('tag');
            const option = options.find(option => option.tag.color === tag)
            ctx.emit('option', option)
            if(tasks.collection.selectors.selected.isSet){
                core.emitters.tasks.PATCH.emit({tag: option.tag})
            }else{
                core.emitters.tasks.NEW.emit({tag: option.tag})
            }
        }
        
        return {
            options,
            makeNewTask
        }
    }
})
</script>
<style lang="scss">
.plus-expandable_mobile{
    position: fixed;
    right: 0;
    bottom: 0;
    margin: 24px;
    width: 34px;
    max-height: 34px;
    height: min-content;
    @media screen and (min-width: 816px) {
        display: none;
    }
    .plus{
        transition: all 0.2s var(--ease);
        position: relative;

    }
    .expanded-box{
        padding-top: 0px;
        transition: all 0.2s var(--ease) 0.1s;
        position: absolute;
        height: calc(34px + 0px);
        width: 34px;
        height: 34px;
        background: var(--white);
        bottom: 0;
        left: 0;
        border-radius: 50em;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        .options{
            display: flex;
            flex-flow: column;
            justify-content: center;
            align-items: center;
            padding: 0 0.5em;
            transition: all 0.2s var(--ease);
            .option{
                cursor: pointer;
                transition: all 0.2s ease;
                margin-top: 0.7em;
                height: 12px;
                width: 12px;
                border-radius: 50%;
                background: var(--orange);
                opacity: 0;
                &:hover{
                    height: 20px;
                    border-radius: 50em;
                }
                
            }
        }
    }
    &:hover{
        .plus{
            transform: rotate(-45deg);
        }
        .expanded-box{
            padding-bottom: 34px;
            padding-top: 10px;
            height: calc(34px + 170px);
            .option{
                opacity: 1;
            }
        }
    }
}
</style>