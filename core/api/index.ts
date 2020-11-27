import tasks_api from './api.tasks';
import user_api from './api.user';
const fetch = require('node-fetch');
export default {
    tasksApi: tasks_api,
    userApi: user_api
}
export {
    tasks_api as tasksApi,
    user_api as userApi
}
