import Vue from 'vue'
import svgIcon from '~/components/general/svgIcon.vue'
import dynamicInput from '~/components/general/dynamicInput.vue'
import regInput from '~/components/general/regInput.vue'
import largeInput from '~/components/general/largeInput.vue'

const components = {svgIcon, dynamicInput, regInput, largeInput}

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
})