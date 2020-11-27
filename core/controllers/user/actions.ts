import tasks from '../tasks'
import {convertToPhoneNumber} from '../../utils/general.helpers';
import {userApi} from './../../api'
import {User} from '~/core/interfaces'
import {state} from './state';

export const actions = {
    
    setProp(prop: string, value: string) {
        if (!state[prop]) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        state[prop].set(value);
    },
    async login(username:string, password: string): Promise<any> {
        try{
            let res = await userApi.login({username, password})
            console.log(res);
            return res.data;
        } catch (err: any){
            console.error(err);
            return err;
        }
    },

    async register(userObj: User): Promise<any> {
        try{
            let res = await userApi.register(userObj)
            console.log(res);
            return res.data;
        } catch (err: any){
            console.error(err);
            return err;
        }
    },

    async logout() {
        try {
            await userApi.logout();
            
            tasks.state.pending.set({});
            this.setProp('id', '');
            this.setProp('name', '');
            this.setProp('sig_url', '');
            
            // curr_user.email = '';
            
        } catch (err) {
            throw(err);
        }
    },

    async auth(){
        try{
            let res = await userApi.auth();
            return res;
        } catch(err){
            throw err;
        }
        
    }

}
export default actions;