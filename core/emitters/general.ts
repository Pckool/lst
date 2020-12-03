import App from './../app';
import {} from './../interfaces'
export const emitter = App.EventGroup(Event => ({
    BLUR: Event<boolean>(),
}))
export default emitter;
