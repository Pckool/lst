import App from '../../app';

import {collection, computed, state} from './state';
import actions from './actions';

export const tasks = App.Controller({
    collection,
    state: {
        ...state,
        ...computed
    },
    actions
}).root(actions)
export default tasks;