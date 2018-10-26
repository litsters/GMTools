export default class EventWrapper {
    private userids:string[];
    private event:any;
    private eventType:string;

    constructor(userids:string[], event:any, eventType:string){
        this.userids = userids;
        this.event = event;
        this.eventType = eventType;
    }

    public getUsers():string[]{
        return this.userids;
    }

    public getEvent():any{
        return this.event;
    }

    public getType():string{
        return this.eventType;
    }
}