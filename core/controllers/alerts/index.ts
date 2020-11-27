import App from './../../app';

import {state, computed, collection} from './state';
import actions from './actions';

export const alerts = App.Controller({
    collection,
    state: {
        ...state,
        ...computed
    },
    // actions
    
}).root(actions)
export default alerts;