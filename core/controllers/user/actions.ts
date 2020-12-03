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

    async resendverify(){
        try{
            return await userApi.resendVer({email: state.email.value});
        }
        catch(err){
            console.error(err)
            throw err;
        }
    },

    async update(){
        try{
            let newUser: any = {}
            const values = Object.values(state).map(st => st.value)
            Object.keys(state).forEach((key, i) => {
                newUser[key] = values[i]
            })
            let res = await userApi.update(newUser)
            
        } catch (err: any){
            console.error(err);
            throw err;
        }
    },
    
    async verify(email:string, code: number): Promise<any> {
        try{
            let res = await userApi.verify({email, code})
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
            this.setProp('img_url', '');
            this.setProp('number', '');
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