<template>
    <div class="dropdown-cont">
        <div class="dropdown-button" @click="open?open=false:open=true">
            <slot></slot>
        </div>
        
        <div class="dropdown-close" v-if="open" @click="open=false"></div>
        <div :class="`dropdown-box ${position} ${position_vert}`" v-show="open">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
    data(){
        return {
            open: false,
            position: 'c',
            position_vert: 'b',
        }
    },
    props: {
        pos: {
            type: String,
            default: 'center',
            validator: (choice) => {
                let choices = ['left', 'right', 'center']
                return choices.indexOf(choice) !== -1
            }
        },
        vert: {
            type: String,
            default: 'bottom',
            validator: (choice) => {
                let choices = ['bottom', 'top']
                return choices.indexOf(choice) !== -1
            }
        },
    },
    methods: {
        
        
    },
    mounted(){
        let pos_options = {
            'left': 'l',
            'right': 'r',
            'center': 'c'
        };
        let vert_options = {
            'bottom': 'b',
            'top': 't',
        };
        console.log(this.pos)
        this.position = pos_options[this.pos];
        this.position_vert = vert_options[this.vert];

        // (<HTMLElement>this.$el.querySelector('.dropdown-box')).classList.add(options[this.pos]);
    }
})
</script>

<style lang="scss">
.dropdown-cont{
    position: relative;

    .dropdown-button{
        cursor: pointer;
        position: relative;
        z-index: 400;
    }
    .dropdown-box{
        position: absolute;
        top: 100%;
        z-index: 600;
        &.l{
            left: 0;
        }
        &.r{
            right: 0;
        }
        &.c{
            left: 50%;
            transform: translateX(-50%);
        }
        &.b{
            bottom: 0;
        }
        &.t{
            top: 100%;
        }
    }
    .dropdown-close{
        position: fixed;
        height: 100%;
        width: 100%;       
        top: 0;
        left: 0;
        z-index: 410;
        user-select: none !important;
    }
}
</style>