import App from './../app';
import {PendingTask, Task} from './../interfaces'
export const emitter = App.EventGroup(Event => ({
    NEW: Event<PendingTask>(),
    UPDATED: Event<Task>(),
    CREATED: Event<Task>(),
    CANCEL: Event<Task>(),
    DELETE: Event<Task>(),
    EDIT: Event<Task>(),
    EDITED: Event<Task>(),
    /**
     * patch existing Tasks with pending ones
     */
    PATCH: Event<PendingTask>(),
}))
export default emitter;
