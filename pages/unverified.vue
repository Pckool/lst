<template>
    <div>
        <h3>Check Your Email!</h3>
        <span></span>
        <input type="text" v-model="code">
    </div>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from '@vue/composition-api'
import { user } from '~/core'

export default defineComponent({
    setup(ctx){
        const code = ref('');
        const submit = (code: string) => {
            const codeAttempt = Number(code)
            if(!isNaN(codeAttempt)){
                user.verify(user.state.email.value, codeAttempt).then((res) => {

                })
            }
            
        }
        watch(code, () => {
            code.value.replace(/[A-z]+/g, '')
            
            if(code.value.length === 6){
                submit(code.value)
                code.value = '';
            }
        })
        return {
            code,
            submit
        }
    }
})
</script>
<style lang="scss">
    
</style>