<template>
    <h1 ref="el" class="text_large" @blur="check" @focus="recordCaret" @input="input" contenteditable="true">
        {{text}}
    </h1>

</template>
<script lang="ts">
import {computed, defineComponent, getCurrentInstance, onBeforeUnmount, ref, watch, watchEffect} from '@vue/composition-api'
export default defineComponent({
    props: {
        value: {
            type: String,
            default: 'feed the dog'
        }
    },
    setup(props, ctx){
        const el = ref<HTMLElement>()
        const range = ref()
        
        const getCaretPosition = (editableDiv) => {
            let caretPos = 0,
                sel, range;
            if (window.getSelection) {
                sel = window.getSelection();
                console.log(sel)
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    if (range.commonAncestorContainer.parentNode == editableDiv) {
                        caretPos = range.endOffset;
                    }
                }
            }
            return caretPos;
        }
        const caretPos = ref<number>()
        const recordCaret = () => {
            // caretPos.value = getCaretPosition(el)
        }
        const check = (e) => {
            const value = el.value.innerText
            range.value = document.createRange()
            // console.log(value, el, caretPos.value, getCaretPosition(el))
            ctx.emit('input', value)
            el.value.innerText = props.value
            
        }
        const input = () => {
            
        }
        const text = computed(() => {
            return props.value
        })
        const stop = watchEffect(() => {
            text
            props.value
            if(el.value){
                el.value.innerText = props.value
            }
            // console.log('effect')
        })
        onBeforeUnmount( () => {
            stop()
        })
        return {
            check,
            el,
            recordCaret,
            text,
            input,
        }
    }
})
</script>
<style lang="scss">
.text_large{
    margin: 0.5em 0 0 0;
    transform: all 0.2s var(--ease);
    padding-bottom: 1.3em;
    letter-spacing: 0.2em;
    font-weight: 900;
    font-size: 95px;
    min-height: 95px;
    max-height: 350px;
    color: var(--grey);
    &:focus{
        color: var(--white);
        outline: none;
        // box-shadow: 0 0 0 0;
    }
}
</style>