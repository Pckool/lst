import {collection, state} from './state';
import App from './../../app'
import { AlertConfig, Alert, AlertTypes, AlertId } from '../../interfaces/alerts';
import Emitters from './../../emitters/alerts'

function emit(payload: Alert): void|Error{
    try{
        let cleanup = Emitters.ALERT.on(() => {}) // just used to capture the cleanup function
        Emitters.ALERT.emit(payload);
        return cleanup();
    }
    catch(err){
        return err;
    }
}

export const actions = {
    create(conf: AlertConfig): void|AlertId{
        let ts = Date.now(); // create a time-based uid
        let payload = {
            name: conf.name||`alert-${ts}`,
            message: conf.message,
            type: conf.type||AlertTypes.NOTIFICATION,
            ts,
        }
        if(!conf.standby){
            // we are to emit right away
            emit(payload);
        }
        // if we are to "standby" with alert deployment
        collection.collect(payload)
        return payload.name
        
    },
    release(name?: AlertId){
        if(name){
            collection.selectors.current.select(name);
            let payload = collection.getValueById(name);
            let err = emit(payload);
            if(err) console.error('ERROR: %o', err) // this checks for an emit/cleanup error;
            // collection.put(name, 'completed');
            return collection.remove(name).everywhere; // Then remove the event from the queue
        }
        // there's no name is we get here, just pull from the top of the "stack"
        

    },
    
}
export default actions;