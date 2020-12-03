export enum AlertTypes {
    ERROR,
    NOTIFICATION,
    WARNING,
}
export type AlertId=string;
export interface AlertConfig {
    name?: string;
    message: string;
    type?: AlertTypes;
    standby?: boolean;
}
export interface Alert {
    name?: string;
    message: string;
    ts?: number;
    type?: AlertTypes;
}
