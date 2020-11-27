<template>
    <span class="dyn-input">
        <small class="dyn-input_placeholder">{{placeholder}}</small>
        <input v-if="type === 'number'" ref="input" :type="type" :value="value" @input="updateInput" @focus="focus" @blur="blur" :max="max" :min="min"/>

        <input v-else ref="input" :type="type" :value="value" @input="updateInput" @focus="focus" @blur="blur"/>
        <div class="dyn-input_extra">
            <slot></slot>
        </div>
    </span>
</template>

<script lang="ts">
import Vue from 'vue'
import anime from 'animejs'

export default Vue.extend({
    data(){
        return {
            val: this.value,
            input: null
        }
    },
    props: {
        value: {
            default: '',
            type: String || Number,
        }, 
        placeholder: {
            default: '',
            type: String,
        },
        type: {
            default: 'text',
            type: String,
            validator(val){
                let options = ['text', 'password', 'tel', 'url', 'week', 'email', 'number']
                return options.indexOf(val) !== -1;
            }
        },
        max: {
            type: String,
            validator: (val) => !isNaN(Number(val)),
            
        },
        min: {
            type: String,
            validator: (val) => !isNaN(Number(val)),
            
        }
    },
    methods: {
        focus(event) {
            (<HTMLElement>this.$el.querySelector('.dyn-input_placeholder')).classList.add('focused');
            this.$emit('focus', event)
        },
        blur(event) {
            if (this.value === '' || this.value === null) (<HTMLElement>this.$el.querySelector('.dyn-input_placeholder')).classList.remove('focused');
            this.$emit('blur', event)
        },
        updateInput(event: Event){
            const target = <HTMLInputElement>event.target;
            
            if(this.type === 'number'){
                // remove all alphabetic characters
                target.value = target.value.replace(/([A-z])+/g, '')
                
            }
            else{
                // use max as string length limiters
                if(this.max && !isNaN(Number(this.max)) && target.value.length > Number(this.max)){
                    
                    target.value = target.value.substring(0, Number(this.max))
                }
            }
            
            // this.val = target.value

            this.$emit('input', target.value)
            // This is circular logic, yes. But for some reason unless I do this, if the value prop is changed outside of this component it does not update the input value. I tried various ways and for some reason it just can't do it properly
            
            // this.checkIfEmpty()
            // this.val = this.value;
            target.value = this.value;
            
        },
        checkIfEmpty(){
            console.log(this.input)
            if(this.value === '' || this.value === null) {
                (<HTMLElement>this.$el.querySelector('.dyn-input_placeholder')).classList.remove('focused');
            }
            else {
                (<HTMLElement>this.$el.querySelector('.dyn-input_placeholder')).classList.add('focused');
            }
        }
    },
    watch:{
    },
    created(){
        this.val = this.value;
        
    },
    mounted(){
        this.checkIfEmpty()
    }
})
</script>

<style lang="scss">
.dyn-input{
    width: min-content;
	position: relative;
    margin-top: 1em;
    margin-bottom: calc(1em * 1.2);
    padding-top: 0.9em;
    input{
        font-size: 16px;
    }
    .dyn-input_placeholder{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        transition: 0.2s all cubic-bezier(0.54, 0.4, 0, 1.38);
        left: 0;
        padding-left: 0.5em;
        user-select: none;
        // cursor: text;
        pointer-events: none;
        font-size: 16px;
        padding-top: 0.9em;
    }
    .focused{
        top: 0%;
        transform: translateY(0%);
        padding-left: 0em;
        font-size: 12px;
        padding-top: 0em;
    }
    .dyn-input_extra{
        position: absolute;
        top: 100%;
        right: 0;
        padding: 0;
        font-size: 12px;
        margin-bottom: -5px;
    }
}
</style>
