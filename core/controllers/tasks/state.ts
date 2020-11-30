import App from '../../app';
import {Task, PendingTask} from '../../interfaces';
import dayjs from 'dayjs'
const isBetween = require('dayjs/plugin/isBetween')

dayjs.extend(isBetween);
dayjs().format();


export const collection = App.Collection<Task>()(collection => ({
    groups: {
        'complete': collection.Group(), 
        'inprogress': collection.Group()
    },
    selectors: {
        
    },
    defaultGroup: true,
}));

export const state = {
    pending: App.State<PendingTask>({}).persist('pending_task').key('pending_task')
}

export const computed = {
    today: App.Computed<Task[]>(() => {
        const d = new Date()
        d.setHours(0,0,0);
        const col = Object.values(collection.data).map(data => data.value)
        return col.filter(task => dayjs(task.ts).isSame(d, 'date'))
    })
    // thisWeek: App.Computed<Task[]>(() => {

    //     var currDate = new Date();
    //     var weekAway = new Date();
    //     currDate.setMinutes(0);
    //     currDate.setHours(0, 0, 0);

    //     weekAway.setDate(currDate.getDate() + 7);
    //     return collection.getGroup('all').output
    //         .filter((event: Task) => {
    //             if (dayjs(event.event_start || event.event_date).isAfter(currDate) && dayjs(event.event_start || event.event_date).isBefore(weekAway)) {
    //                 return true;
    //             } else return false;
    //         })
    // }),
    // thisMonth: App.Computed<Task[]>(() => {
    //     var currDate = new Date();
    //     var weekAway = new Date();
    //     currDate.setHours(0, 0, 0);
    //     weekAway.setDate(currDate.getDate() + 7);

    //     return collection.getGroup('all').output
    //         .filter(event => {
    //             if (dayjs(event.event_start || event.event_date).isSame(new Date(), "month")) {
    //                 return true;
    //             } else return false;
    //         })
    // }),
    // thisYear: App.Computed<Task[]>(() => collection.getGroup('all').output),
    // today: App.Computed<Task[]>( () => {
    //     return collection.getGroup('all').output
    //         .filter(event => {
    //             if (dayjs(event.event_start || event.event_date).isSame(new Date(), "day")) {
    //                 return true;
    //             } else return false;
    //         })
    // })
}