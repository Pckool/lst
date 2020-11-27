import { tasks, user, alerts } from './controllers';
import * as interfaces from './interfaces'
import emitters from './emitters';
import App from './app';

// export { coupons };
import root from './pulse';
export {
    tasks,
    alerts,
    root,
    user,
    emitters,
}
export * from './interfaces';
export * from './emitters';
const core = {
    tasks,
    alerts,
    root,
    user,
    emitters
}
export type ICore = typeof core;
export default App.Core<ICore>(core)
