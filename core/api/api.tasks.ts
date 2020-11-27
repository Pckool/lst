import App from '../app';
import { Task } from '../interfaces/tasks';

const api = App.API({
    baseURL: 'http://localhost:3030',
    options: {

    }
})
export const fetchers = {
    add: async (data): Promise<any> => (await api.post('add/task', data)),
    remove: async (data) => (await api.post('delete/task', data)),
    change: async (data): Promise<any> => (await api.post('update/task', data)),
    getAll: async (): Promise<any> => (await api.get('get/tasks')),
}
export default fetchers;