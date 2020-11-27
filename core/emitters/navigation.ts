import App from '../app';
// import {Na} from './../interfaces'
interface OPENCLOSED {
    status: "open" | "closed"
}
export const emitter = App.EventGroup(Event => ({
    SIDE_NAV: Event<OPENCLOSED>(),
}))
export default emitter;
