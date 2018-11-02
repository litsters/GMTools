export default interface IEvent {
    namespace?:string,
    key?:string,
    data?:any,
    error?:string,
    details?:any
};