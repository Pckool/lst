import App from '../../app';
import routes from './../../api/api.tasks';
import {collection, computed, state} from './state';
import actions from './actions';

export const tasks = App.Controller({
    collection,
    state: {
        ...state,
        ...computed
    },
    routes,
    actions
}).root(actions)
export default tasks;