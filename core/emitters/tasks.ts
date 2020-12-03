import App from './../app';
import {PendingTask, Task} from './../interfaces'
export const emitter = App.EventGroup(Event => ({
    NEW: Event<PendingTask>(),
    UPDATED: Event<Task>(),
    CREATED: Event<Task>(),
    CANCEL: Event<Task>(),
}))
export default emitter;
