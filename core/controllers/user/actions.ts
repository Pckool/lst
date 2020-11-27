import tasks from '../tasks'
import {convertToPhoneNumber} from '../../utils/general.helpers';
import {userApi} from './../../api'
import {User} from '~/core/interfaces'
import {state} from './state';

export const actions = {
    
    setProp(prop: string, value: any) {
        if (!state[prop]) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        state[prop].set(value);
    },
    async login(username:string, password: string): Promise<any> {
        try{
            let res = await userApi.login({username, password})
            let keys = Object.keys(res.data.user);
            // console.log(core.user);
            keys.forEach(key => {
                this.setProp(key, res.data.user[key]);
                // console.log(user);
            })
            return res.data;
        } catch (err: any){
            console.error(err);
            return err;
        }
    },
    
    async verify(username:string, code: number): Promise<any> {
        try{
            let res = await userApi.verify({username, code})
            return res.data;
        } catch (err: any){
            console.error(err);
            throw err;
        }
    },

    async register(userObj: User): Promise<any> {
        try{
            let res = await userApi.register(userObj)
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
            this.setProp('verified', false);
            
            
            // curr_user.email = '';
            
        } catch (err) {
            throw err;
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