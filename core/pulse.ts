import App from './app';
import emitters from './emitters'
import helpers from './utils/general.helpers';

const state = {
    mobile: App.State(false).type(Boolean).watch(0, value => {
        console.log('mobile changed');
        if(value) emitters.navigation.SIDE_NAV.emit({status: 'closed'})
        if(!value) emitters.navigation.SIDE_NAV.emit({status: 'open'})
    }),
    dev: App.State(!(process.env.NODE_ENV==="production")).type(Boolean),
}

const actions = {
    getMobile() { 
        return state.mobile.bind;
    },
    setMobile(value: boolean) {
        state.mobile.set(value);
    },
    getDev() {
        return state.dev.value;
    },
    setDev(value: boolean) {
        state.dev.set(value);
    },
    ...helpers,
}

const computed = {
    authURL: App.Computed<string>(()=> state.dev.value?'https://auth2.loxly.co':'https://auth.loxly.co')
}

const controller = App.Controller({
    state: {...state, ...computed},
}).root(actions)
// export pulse = 
export default controller;