import App from './../../app';

import {state} from './state';
import actions from './actions';

export const user = App.Controller({
    state: {
        ...state
    },
    // actions
}).root(actions)
export default user;