import App from '../app';
import { User } from '../interfaces';
import root from './../pulse';

const api = App.API({
    baseURL: 'http://localhost:3030',
    timeout: 20000,
    options: {
        credentials: 'include'
    }
})
interface PulseResponse<DataType = any> {
    data: DataType;
    timedout?: boolean;
    status: number;
    raw?: Response;
    type?: string;
}
export const fetchers = {
    login: async (data): Promise<PulseResponse> => (await api.post('user/login', data)),
    register: async (data: User): Promise<PulseResponse> => (await api.post('user/create', data)),
    logout: async (): Promise<PulseResponse> => (await api.post('user/logout')),
    auth: async (): Promise<PulseResponse> => (await api.post('user/auth')),
    getAll: async (): Promise<PulseResponse> => (await api.get('user/get')),
}
export default fetchers;