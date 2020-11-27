<template>
	<div class="search-bar" @blur="searching=false">
		<div>
			<img src="/images/search.svg" alt="">
		</div>
		<div class="search-bar_input">
			<dynamic-input type="text" placeholder="Search" v-model="query" @input="queryChanged"  @focus="queryChanged"/>
			<!-- <input type="text" placeholder="Search" v-model="query" @input="queryChanged"  @focus="queryChanged"/> -->
			<span class="search-clear" @click="clear">
				<i class="fas fa-times fa-sm"></i>
			</span>
			
		</div>
		<div class="search-dropdown_cont" v-if="searching">
			<div class="search-result" v-for="task in tasks" :key="task.id" @click="selected(task.id)">
				<small>{{task.name}}</small>
				<small class="date">{{`${(new Date(task.ts)).getMonth()+1}/${(new Date(task.date)).getFullYear()}`}}</small>
			</div>
			<div v-if="noMatch">
				<small class="no-match">No Event Matched your Search...</small>
			</div>
		</div>
		
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import dynamicInput from '~/components/general/dynamicInput.vue'
import core, { Task } from '@/core';

export default Vue.extend({
	components: {dynamicInput},
	data(){
		return {
			query: <string>'',
			tasks: <Task[]>[],
			searching: <boolean>false,
			noMatch: <boolean>false,
		}
	},
	methods: {
		clear(){
			this.query = '';
			this.tasaks = [];
			this.searching = false;
		},
		queryChanged(){
			this.tasks = [];
			if(this.query.length > 0) this.searching = true;
			else return this.searching = false;

			

			Object.values(core.tasks.collection.data).forEach(event => {
				if(event.value.text?.toLowerCase().includes(this.query.toLowerCase())){
					this.tasks.push(event.value);
				}
			})
			if(this.tasks.length <= 0) this.noMatch = true;
			else this.noMatch = false;
		},
		async selected(id: number|string){
			// await core.tasks.actions.patchTaskById(Number(id));
			// core.tasks.collection.selectors.focused.select(id);
		}	
	}
})
</script>

<style lang="scss">
.search-bar{
	pointer-events: all;
	display: flex;
	justify-content: center;
	align-items: center;
	// flex-grow: 1;
	position: relative;
	.search-bar_input{
		margin-left: 1em;
		// width: 100%;
		position: relative;
		
		
		// flex: 1 1 0;
		.search-clear{
			position: absolute;
			right: 0;
			top: 0;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 1.8em;
			cursor: pointer;
		}
		input[type="text"]{
			font-size: 13px;
			letter-spacing: 1px;
			// width: 100%;
			font-weight: 500;
			padding-right: 1.8em;
		}
	}
	.search-dropdown_cont{
		position: absolute;
		top: 100%;
		padding: 1rem;
		background: var(--darkGRey);
		z-index: 300;
		width: 100%;
		max-height: 400px;
		overflow-y: auto;
		small{
			letter-spacing: 1px;
			display: block;
			&.no-match{
				color: var(--darkGrey);
			}
			&.date{
				padding-top: 0.3em;
				font-size: 9px;
			}
		}
		.search-result{
			padding: 0.5rem 0.2rem;
			cursor: pointer;
			color: var(--faded);
			&:hover{
				color: var(--white);
			}
		}
	}
}
</style>