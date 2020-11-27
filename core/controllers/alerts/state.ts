import App from './../../app';
import { Alert } from '../../interfaces/alerts';

export const collection = App.Collection<Alert>()(collection => ({
    primaryKey: 'name',
    groups: {
        pending: collection.Group(),
        completed: collection.Group()
    },
    selectors: {
        current: collection.Selector(),
    }

}));
export const state = {
    
}
export const computed = {
    
}