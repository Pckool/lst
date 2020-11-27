export type namespaceID = string;
export type moduleID = string;
export type userID = string;
export type resID = string;
export type Scope = Array<string>


export interface User {
    _id?: resID;
    id: userID;
    email: string;
    name: string;
    credentials: {
        password: string;
    };
    ts: string|number;
    verified: boolean;
    // level: number;
    img_url?: string;
    number?: string|number;
    namespaces?: Array<UserNamespace>;
}

export interface PendingUser {
    _id: resID;
    id: string;
    email: string;
    ver_key: string|number;
}
export interface UserNamespace {
    id: namespaceID;
    name: string;
    scope: Scope;
}

export interface Namespace {
    id: namespaceID;
    name: string;
    modules: Array<moduleID>;
    users: Array<userID>;
}

export interface PasswdRecoObj {
    uid: userID,
	reset_key: string;
}