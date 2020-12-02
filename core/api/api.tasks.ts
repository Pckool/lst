import App from '../app';
import root from '../pulse'
import { Task } from '../interfaces/tasks';

const api = App.API({
    baseURL: root.state.host.value,
    options: {

    }
})
export const fetchers = {
    add: async (data): Promise<any> => (await api.post('task/add', data)),
    remove: async (data) => (await api.post('task/add', data)),
    change: async (data): Promise<any> => (await api.post('task/update', data)),
    getAll: async (data): Promise<any> => (await api.post('task/getall', data)),
}
export default fetchers;