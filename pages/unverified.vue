<template>
    <div id="user-verification">
        <div class="in-area">
            <small>check your email</small>
            <h6>Enter verification code here:</h6>
            <dynamic-input type="text" v-model="code" placeholder="" @keypress.enter="submit(code)"/>
            <!-- <input type="text" v-model="code"> -->
            <button @click="submit(code)" :disabled="disabled">verify</button>
            <small class="reverify" @click="resendVerif" v-if="!sendingCode">send again</small>
        </div>
        <span></span>
        
    </div>
</template>
<script lang="ts">
import {defineComponent, getCurrentInstance, onMounted, ref, watch} from '@vue/composition-api'
import dynamicInput from '~/components/general/dynamicInput.vue'
import { alerts, user } from '~/core'

export default defineComponent({
    components: {dynamicInput},
    setup(ctx){
        const code = ref('');
        const disabled = ref(true);
        const vue = getCurrentInstance();
        const sendingCode = ref<boolean>(false)
        const submit = async (inp: string) => {
            if(code.value.length === 6){
                sendingCode.value = true
                const codeAttempt = Number(inp)
                if(!isNaN(codeAttempt)){
                    try{
                        const res = await user.verify(user.state.email.value, codeAttempt)
                        user.setProp('verified', true)
                        sendingCode.value = false
                        vue.$router.push('/app')
                    }
                    catch(err){
                        alerts.create({message: 'verification failed!'})
                        console.warn(err.message)
                    }
                }
                code.value = '';
            }
            else{
                console.log('The code is supposed to be 6 digets!')
            }
            
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
        const resendVerif = async () =>  {
            try{
                sendingCode.value = true
                await user.resendverify()
                sendingCode.value = false
                alerts.create({message: 'message sent!'})
            }
            catch(err){

            }
        }
        return {
            code,
            submit,
            disabled,
            resendVerif,
            sendingCode
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
        cursor: pointer;
        &:hover{
            color: var(--white);
        }
    }
    
}
</style>