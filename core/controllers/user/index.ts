import App from './../../app';
import routes from './../../api/api.user';
import {state} from './state';
import actions from './actions';

export const user = App.Controller({
    state: {
        ...state
    },
    routes,
    // actions
}).root(actions)
export default user;