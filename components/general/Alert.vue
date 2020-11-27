<template>
    <div id="alert" style="transform: translateY(-300px)">
        <div class="inner" @click="close">
            <i class="fas fa-bell fa-sm"></i>
            <span>{{str}}</span>
        </div>
    </div>
</template>

<script lang="ts">
import anime from 'animejs';
import Vue from 'vue';
import {emitters, Alert} from '~/core';

export default Vue.extend({
    data(){
        return {
            str: ''
        }
    },
    props: {
        text: {default: ''}
    },
    methods: {
        close(){
            anime({
                targets: '#alert',
                translateY: [0, -300],
                scale: [1, 0.7],
                duration: 300,
                easing: 'easeInQuad',
                
                complete: () => {
                    this.$emit('destroyMe');
                }
            });
        },
        open(){
            anime({
                targets: '#alert',
                translateY: [-300, 0],
                scale: [0.7, 1],
                duration: 300,
                delay: 400,
                easing: 'easeOutQuad',
                begin: () => {
                    try{
                        navigator.vibrate(300);
                    }
                    catch(err){
                        
                    }
                    anime({
                        targets: '#alert i.fa-bell',
                        direction: 'alternate',
                        duration: 400,
                        loop: true,
                        easing: 'easeInQuad',
                        rotate: function(el, i, l){
                            let ang = anime.get(el, 'rotate');
                            // console.log(`rotate ${ang}`);
                            
                            if(ang === 0)
                                return 45;
                            if(ang > 0)
                                return -ang;
                            if(ang < 0)
                                return Math.abs(ang)/4;
                        }
                    });
                },
                complete: () => {
                    setTimeout(this.close, 7000);
                    
                }
            })
        }
    },
    created(){
        this.str = this.text;
    },
    mounted(){
        // console.log(this.$props);
        // this.open();
        emitters.alerts.ALERT.on((payload: Alert) => {
            this.str = payload.message;
            this.open();
        })
        
    }
})
</script>

<style lang="scss">

</style>