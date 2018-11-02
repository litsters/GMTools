import Handler from "./handler_interface";
import EventWrapper from "./event";

export default class Handlers{
    private registry:Map<string, Handler>;

    constructor(){
        this.registry = new Map();
    }

    public addHandler(handler:Handler):void{
        let id = handler.getIdentifier();
        this.registry.set(id, handler);
    }

    public handleEvent(eventType:string, event:any):Promise<EventWrapper[]>{
        let target = event.namespace;
        let handler = this.registry.get(target);
        if(handler === null){
            console.log("unknown handler: " + target);
            return null;
        }
        return handler.handleEvent(eventType, event);
    }
}