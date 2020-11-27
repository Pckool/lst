import App from './../../app';
import {State} from '@pulsejs/core'




export const state = {
    'name': App.State('').type(String).persist('user_name').key('user_name'),
    'id': App.State('').type(String).persist('user_id').key('user_id'),
    'email': App.State('').type(String).persist('user_email').key('user_email'),
    'number': App.State('').type(String).persist('user_number').key('user_number'),
    'verified': App.State(false).type(Boolean).persist('verified').key('verified'),
    'img_url': App.State('').type(String).persist('user_image').key('user_image'),
}
