<template>
	<div class="input-container form-option-container" :valid="true">
		<div class="option_header">
			<label class="input-option_label">
				<input type="checkbox" v-model="checked" @change="change">
				<span class="input-option_checkbox"></span>
				<span class="input-option_text"><slot>{{placeholder}}</slot></span>
			</label>
		</div>
		
	</div>
</template>

<script>
export default {
	data(){
		return {
			checked: false,
			error: false,
			errorMessage: '',
			valid: true,
		}
	},
	props: {
		placeholder: {
			type: String,
			default: "Dog?"
		},
		required: {
			type: Boolean,
			default: false,
		},
		number: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			default: 'text'
		},
		name: {
			type: String,
			default: ''
		},
		value: {
			default: false,
			
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		change(event){
			this.$emit('change', event);
			this.$emit('input', this.checked);
		}
	},
	created(){
		this.checked = this.value
	},
	mounted(){
		this.$el.setAttribute('value', this.value);
		this.$el.querySelector('.input-option_label input').disabled = this.disabled;
		this.valid = this.required;
	},
}
</script>

<style lang="scss">
.form-option-container{
	display: flex;
	flex-flow: column nowrap;
	padding-bottom: 1em;
	transition: all 0.3s ease-out;
	&:focus-within{
		color: var(--dark) !important;
	}
	.option_header{
		display: flex;
		flex-wrap: nowrap;
		position: relative;
		margin-bottom: 1em;
		.input-option_label{
			font-size: 1.3rem;
			color: var(--dark);
			margin: 0;
			height: fit-content;
			background: none;
			padding: unset;
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			position: relative;
			
			color: #707070;
			width: 300px;
			max-width: 100%;
			user-select: none;
			transition: all 0.2s ease-in-out;
			&:focus{
				color: var(--dark);
			}
			input[type="checkbox"]{
				position: absolute;
				opacity: 0;
				cursor: pointer;
				height: 0;
				width: 0;
				transition: all 0.2s ease-in-out;
				&:checked ~ .input-option_checkbox{
					background: var(--dark);
					&::after{
						display: block;
					}
				}
				&:checked ~ .input-option_text{
					color: var(--dark);
				}
			}
			.input-option_checkbox{
				transition: all 0.2s ease-in-out;
				user-select: none;
				width: 30px;
				height: 30px;
				min-width: 30px;
				border-radius: 50%;
				border: 3px solid var(--dark);
				margin-right: 1em;
				display: flex;
				justify-content: center;
				align-items: center;

				&::after{
					content: "";
					position: absolute;
					display: none;
					width: 6px;
					height: 12px;
					border: solid white;
					border-width: 0 3px 3px 0;
					transform: rotate(45deg);
				}
			}
			.input-option_text{
				transition: all 0.2s ease-in-out;
			}
		}
		.input-option_number{
			position: absolute;
			left: -18px;
			bottom: 50%;
    		transform: translateY(50%);
			font-size: 0.9rem;
			font-weight: 300;
			color: var(--dark);
			margin-bottom: 0;
		}
	}
	
}
</style>