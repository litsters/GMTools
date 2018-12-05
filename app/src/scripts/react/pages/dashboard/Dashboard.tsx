import React, { Component } from "react";
import { connect } from "react-redux";
import { UserReducer } from "../../reducers";
import Auth from "../../auth/Auth";
import { updateAuth, updateCampaigns, updateCharacters } from "../../actions/user-actions";
import MasterDetailsLayout from "../../layout/MasterDetailLayout";
import * as $ from "jquery";
import EventBus from '../../common/Events';

import HomeSection from "./HomeSection";
import CampaignsSection from "./campaign/CampaignsSection";
import CharactersSection from "./character/CharactersSection";


interface DashboardProps {
    history: History,
    user: any

    updateAuth: any,
    updateCampaigns: any,
    updateCharacters: any
}

class Dashboard extends Component<DashboardProps, {}> {
    private events: EventBus;
    private contentWrapper:HTMLDivElement;
    private btnHome:HTMLLIElement;
    private btnCampaigns:HTMLLIElement;
    private btnCharacters:HTMLLIElement;
    private positions:any;

    constructor(props: any) {
        super(props);
        this.events = null;
        this.positions = {};

        this.scrollTo = this.scrollTo.bind(this);
    }

    componentDidMount() {
        this.calculateElementPositions();
        this.registerContentScrollEvent();

        // if hash is provided, jump to it
        if (window.location.hash) {
            this.scrollTo(window.location.hash, 0);
        }
    }

    componentWillUnmount() {
        if (this.events !== null) {
            // Cleanup our event listeners
            this.events
                .removeListener('data.retrieved', Dashboard.dataRetrieved)
                .removeListener('data.persisted', Dashboard.dataPersisted);
        }
    }

    logout() {
        console.log("you are logging out");
        let auth = new Auth(this.props.history);
        auth.logout();
        this.props.updateAuth(auth);
    }

    send(msg:string){
        this.events.emit('greeting', {msg: msg});
    }

    scrollTo(element:string, duration:number = 500) {
        // NOTE: bug when animating scroll with 'scroll-snap-type' disabled; so must remove css prop
            // before animation, then re-enable after animation is complete
        const content = $(this.contentWrapper);
        const pos = $(element).position().top + content.scrollTop();
        content
            .css({"scroll-snap-type": "none", "-webkit-scroll-snap-type": "none"})
            .animate({
                scrollTop: pos
            }, duration, () => {
                content.css({"scroll-snap-type": "y mandatory", "-webkit-scroll-snap-type": "y mandatory"});
            });

        if (element[0] === '#') window.location.hash = element;
    }

    registerContentScrollEvent() {
        $(this.contentWrapper).scroll(() => {
            let pos = $(this.contentWrapper).scrollTop();

            // set active menu item
            $(".menu-dashboard ul li.active").removeClass("active");
            if (pos >= this.positions.home && pos < this.positions.campaigns) 
                $(this.btnHome).addClass("active");
            else if (pos >= this.positions.campaigns && pos < this.positions.characters) 
                $(this.btnCampaigns).addClass("active");
            else if (pos >= this.positions.characters)
                $(this.btnCharacters).addClass("active");
        })
    }

    calculateElementPositions() {
        this.positions.home = $("#home").position().top;
        this.positions.campaigns = $("#campaigns").position().top;
        this.positions.characters = $("#characters").position().top;
    }

    connectToServer() {
        EventBus.get()
            .then((bus) => {
                this.events = bus
                    .on('data.retrieved', Dashboard.dataRetrieved)
                    .on('data.persisted', Dashboard.dataPersisted);
            });
    }

    static dataRetrieved(event: any) {
        console.log('data retrieved: ' + JSON.stringify(event,null,2));
        if(event.data.id !== undefined && event.namespace === 'user') {
            localStorage.setItem('userid', event.data.id);
            localStorage.setItem('campaign', event.data.campaigns[0]);
        }
    }

    static dataPersisted(event: any) {
        console.log('data persisted: ' + JSON.stringify(event,null,2));
    }

    /*
    Gets a note from the database. The id passed in is the note's mongo id.
    */
    getNote(noteId:any){
        console.log("getting note");
        if(this.events === null) console.log("no server connection");
        else {
            let event = {
                namespace: "note",
                key: noteId
            };
            this.events.emit("data.get", event, true);
        }
    }

    /*
    Creates a new note. The userid passed in is the user's id, but the
    campaign id is the mongo id for the campaign the note is to be
    affiliated with.
    */
    createNote(content:string, title:string, userid:string, campaignid:any){
        console.log("creating note");
        if(this.events === null) console.log("no server connection");
        else {
            let noteEvent = {
                namespace: "note",
                key: "new_note",
                data: {
                    content: content,
                    title: title,
                    userid: userid,
                    campaignid: campaignid
                }
            };
            this.events.emit("data.persist", noteEvent, true);
        }
    }

    /*
    Removes a character from a campaign. The ids passed in are the character
    and campaign mongo ids.
    */
    removeCharacterFromCampaign(charId:any, campId:any){
        console.log("removing character from campaign");
        if (this.events === null) console.log("no server connection");
        else {
            let updateEvent = {
                namespace: "campaign",
                key: "remove_character",
                data: {
                    character: charId,
                    campaign: campId
                }
            };
            this.events.emit('data.persist', updateEvent);
        }
    }

    /*
    Adds a character to a campaign. The ids passed in are the character and
    campaign mongo ids.
    */
    addCharacterToCampaign(charId:any, campId: any){
        console.log("adding character to campaign");
        if(this.events === null) console.log("no server connection");
        else {
            let updateEvent = {
                namespace: "campaign",
                key: "add_character",
                data: {
                    character: charId,
                    campaign: campId,
                }
            };
            this.events.emit('data.persist', updateEvent);
        }
    }

    /*
    Gets character info. The id passed in is the character's mongo id.
    */
    getCharacter(id:any){
        console.log("getting a character");
        if(this.events === null) console.log("no server connection");
        else {
            let retrievalEvent = {
                namespace: "character",
                key: id
            };
            this.events.emit('data.get', retrievalEvent);
        }
    }

    /*
    Gets campaign info. The id passed in is the campaign's mongo id.
    */
    getCampaign(id:any){
        console.log("getting a campaign");
        if(this.events === null) console.log("no server connection");
        else {
            let retrievalEvent = {
                namespace: "campaign",
                key: id
            };
            this.events.emit('data.get', retrievalEvent);
        }
    }

    generateTestCharacter(){
        console.log("generating a test character");
        if(this.events === null){
            console.log("no server connection!");
        } else if(localStorage.getItem('userid') === null){
            console.log("no user id available!");
        } else {
            let event = {
                namespace: "character",
                key: "new_character",
                data: {
                    name: "Billy Bob",
                    userid: localStorage.getItem('userid')
                }
            }
            this.events.emit('data.persist', event);
        }
    }

    generateTestCampaign(){
        console.log("generating test campaign");
        if(this.events === null){
            console.log("no server connection");
        } else if(localStorage.getItem('userid') === null){
            console.log("no user id available");
        } else {
            let event = {
                namespace: "campaign",
                key: "new_campaign",
                data: {
                    name: "Crazy Fun",
                    plugin: "dnd-5e",
                    userid: localStorage.getItem('userid')
                }
            };
            this.events.emit('data.persist', event);
        }
    }

    render() {
        const { user, updateCampaigns } = this.props;
        const { campaigns } = user;
        let auth = new Auth(this.props.history);
        auth.handleAuthentication();
        
        const menu = (
            <div className="menu-dashboard">
                <div className="menu-top">
                    <ul>
                        <li className="active" ref={el => this.btnHome = el} onClick={this.scrollTo.bind(null, "#home")}>Home</li>
                        <li ref={el => this.btnCampaigns = el} onClick={this.scrollTo.bind(null, "#campaigns")}>Campaigns</li> 
                        <li ref={el => this.btnCharacters = el} onClick={this.scrollTo.bind(null, "#characters")}>Characters</li>
                    </ul>
                </div>
                <div className="menu-bottom">
                    <ul>
                        <li>Settings</li>
                    </ul>
                </div>
            </div>
        );

        const details = (
            <div className="content snap" ref={el => this.contentWrapper = el}>

                <HomeSection />

                <CampaignsSection campaigns={campaigns} updateCampaigns={updateCampaigns} />

                <CharactersSection />

                <button onClick={()=> this.connectToServer()}>Connect to server</button>
                <button onClick={()=> this.logout()}>Click me to log out</button>
            </div>
        );

        return (
            <div className="dashboard layout-page">
                
                <MasterDetailsLayout master={menu} details={details} clearDetails={() => alert("not implemented")} />
            </div>
        )
    }
}

const mapActionsToProps = {
    updateAuth,
    updateCampaigns,
    updateCharacters
}

export default connect(UserReducer, mapActionsToProps)(Dashboard);