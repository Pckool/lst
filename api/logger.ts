function log(message, type){
    let ts = new Date();
    let ts_formatted = `${ts.getDate()}-${ts.getMonth()+1}-${ts.getFullYear()}_${ts.getHours()}:${ts.getMinutes()}`;
    
    if(message){
        if(typeof message === 'object')console[type](`[${ts_formatted}] %o`, message);
        if(typeof message === 'number')console[type](`[${ts_formatted}] -> %d`, message);
        if(typeof message === 'string')console[type](`[${ts_formatted}] -> %s`, message);
        if(typeof message === 'boolean')console[type](`[${ts_formatted}] -> %s`, message);
        if(typeof message === 'function')console[type](`[${ts_formatted}] -> %o`, message);
    } 
}
const _t = {
    value: null
}
export default {
    
    error(msg){
        log(msg, 'error');
        return this;
    },
    info(msg){
        log(msg, 'log');
        return this; 
    },
    warn(msg){
        log(msg, 'warn');
        return this; 
    },
    group(groupName: string){
        console.group(groupName);
        return this;
    },
    end(){
        console.groupEnd();
        return this;
    },
    start(timerName: string){
        console.time(timerName);
        return this;
    },
    lap(timerName){
        console.timeLog(timerName);
        return this;
    },
    stop(timerName){
        console.timeEnd(timerName);
        return this;
    },
    clear(){
        console.clear();
        return this;
    }
}