import App from '../app';
import { User } from '../interfaces';
import root from './../pulse';

const api = App.API({
    baseURL: root.state.host.value || 'http://localhost:3030',
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
interface UserVerification {
    username: string;
    code: number;
}
export const fetchers = {
    login: async (data): Promise<PulseResponse> => (await api.post('user/login', data)),
    register: async (data: User): Promise<PulseResponse> => (await api.post('user/create', data)),
    verify: async (data: UserVerification): Promise<PulseResponse> => (await api.post('user/verify', data)),
    logout: async (): Promise<PulseResponse> => (await api.post('user/logout')),
    auth: async (): Promise<PulseResponse> => (await api.post('user/auth')),
    update: async (data): Promise<PulseResponse> => (await api.post('user/update', data)),
    resendVer: async (data): Promise<PulseResponse> => (await api.post('user/verify-redo', data)),
}
export default fetchers;