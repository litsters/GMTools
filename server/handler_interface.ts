import EventWrapper from "./event";

/*
This is the base class for all handlers.
*/
export default abstract class Handler {
    private identifier:string;  // Unique identifier, should match the 'namespace' in the event.

    constructor(identifier:string){
        this.identifier = identifier;
    }

    public getIdentifier():string{ return this.identifier; }

    abstract async handleEvent(eventType:string, event:any): Promise<EventWrapper[]>;
};