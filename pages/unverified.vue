<template>
    <div id="user-verification">
        <div class="in-area">
            <small>check your email</small>
            <h6>Enter verification code here:</h6>
            <dynamic-input type="text" v-model="code" placeholder=""/>
            <!-- <input type="text" v-model="code"> -->
            <button @click="submit(code)" :disabled="disabled">verify</button>
            <small class="reverify" @click="resendVerif">send again</small>
        </div>
        <span></span>
        
    </div>
</template>
<script lang="ts">
import {defineComponent, ref, watch} from '@vue/composition-api'
import dynamicInput from '~/components/general/dynamicInput.vue'
import { user } from '~/core'

export default defineComponent({
    components: {dynamicInput},
    setup(ctx){
        const code = ref('');
        const disabled = ref(true);
        const submit = (inp: string) => {
            const codeAttempt = Number(inp)
            if(!isNaN(codeAttempt)){
                user.verify(user.state.email.value, codeAttempt).then((res) => {
                    user.setProp('verified', true)
                })
            }
            code.value = '';
        }
        watch(code, () => {
            code.value = code.value.replace(/([A-z])+/g, '')
            if(code.value.length === 6){
                disabled.value = false
            }
            else if(code.value.length > 6){
                code.value = code.value.substring(0, 6)
            }
            else{
                disabled.value = true
            }
        })
        const resendVerif = () =>  {
            user.resendverify()
        }
        return {
            code,
            submit,
            disabled
        }
    }
})
</script>
<style lang="scss">
#user-verification {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    .headers{
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
    }
    .in-area{
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
    }
    .reverify{
        text-decoration: underline;
        color: var(--darkGrey);
        margin-top: 0.5em;
        &:hover{
            color: var(--white);
        }
    }
    
}
</style>