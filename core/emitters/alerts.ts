import App from './../app';
import {Alert} from './../interfaces'
export const emitter = App.EventGroup(Event => ({
    ALERT: Event<Alert>(),
}))
export default emitter;
