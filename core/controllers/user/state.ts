import App from './../../app';
import {State} from '@pulsejs/core'

interface userState {
    [key: string] : State<string>;
}


export const state: userState = {
    'name': App.State('').type(String).persist('user_name').key('user_name'),
    'id': App.State('').type(String).persist('user_id').key('user_id'),
    'email': App.State('').type(String).persist('user_email').key('user_email'),
    'number': App.State('').type(String).persist('user_number').key('user_number'),
    'sig_url': App.State('').type(String).persist('user_signature').key('user_signature'),
    'img_url': App.State('').type(String).persist('user_image').key('user_image'),
}
