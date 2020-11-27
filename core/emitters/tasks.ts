import App from './../app';
import {PendingTask, Task} from './../interfaces'
export const emitter = App.EventGroup(Event => ({
    NEW: Event<PendingTask>(),
    UPDATED: Event<Task>(),
}))
export default emitter;
