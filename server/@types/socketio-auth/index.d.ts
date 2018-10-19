declare module 'socketio-auth' {
    export default function socketIOAuth(io:any, config:any): any;
    //export function forbidConnections(nsp:any): void;
    //export function restoreConnection(nsp:any, socket:any): void;
}