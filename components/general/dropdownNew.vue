<template>
    <div class="dropdown_cont">
        <div class="screen" @click="toggleDropdown">
            <span>{{text_display||'Select an option...'}}</span>
            <span class="arrow" v-show="!open"><div class="fas fa-chevron-down fa-sm"></div></span>
            <span class="arrow" v-show="open"><div class="fas fa-chevron-up fa-sm"></div></span>
            
        </div>
        <div class="options_cont" v-if="open">
			<div class="option" v-for="option in options" :key="option.value" @click="selected(option)">
				<small>{{option.name}}</small>
			</div>
		</div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
interface DropdownOption {
    value: string;
    name: string;
}
export default Vue.extend({
    data() {
        return {
            open: false,
            text_display: ''
        }
    },
    props: {
        value: {
            type: String,
            default: 'Select an option...'
        },
        options: {
            type: Array,
            default: <DropdownOption[]>[],
        }
    },
    methods: {
        getDisplayName(): string {
            return (<DropdownOption[]>this.options).find((option: DropdownOption) => option.value === this.value)?.name||'Select an option...';
        },
        selected(option){
            this.text_display = option.name;
            this.$emit('change', option.value);
            this.$emit('input', option.value);
            this.open=false;

        },
        toggleDropdown(){
            this.open?this.open=false:this.open=true;
        }
    },
    watch: {
        
    },
    mounted(){
        this.text_display = this.getDisplayName()
    }
})
</script>

<style lang="scss">
.dropdown_cont{
    position: relative;
    cursor: pointer;

    .screen{
        padding: 7.3444px;
        border: 1px solid #545454;
        font-size: 1.45ch;
        min-width: 196px;
        color: var(--TextSecondary);
        text-transform: capitalize;
        padding-right: 1.6em;
        position: relative;
        user-select: none;
        &:hover{
            color: var(--TextPrimary);
        }
        
        .arrow{
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.6em;
        }
    }

    .options_cont{
        user-select: none;
		position: absolute;
		top: 100%;
		padding: 1rem;
		background: var(--BackgroundTernary);
		z-index: 300;
		width: 100%;
		max-height: 400px;
		overflow-y: auto;
		small{
			letter-spacing: 1px;
			&.no-match{
				color: var(--darGrey);
			}
		}
		.option{
			padding-left: 0.2rem;
			padding-right: 0.2rem;
			padding-bottom: 0.2rem;
			cursor: pointer;
			color: var(--faded);
			&:hover{
				color: white;
			}
		}
    }
    
}
</style>