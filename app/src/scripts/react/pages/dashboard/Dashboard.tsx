import React, { Component } from "react";
import io  from "socket.io-client";
import { connect } from "react-redux";
import { UserReducer } from "../../reducers";
import Auth from "../../auth/Auth";
import { updateAuth } from "../../actions/user-actions";
import MasterDetailsLayout from "../../layout/MasterDetailLayout";
import * as $ from "jquery";

import CampaignsSection from "./CampaignsSection";
import CharactersSection from "./CharactersSection";


interface DashboardProps {
    history: History,
    updateAuth: any
}

class Dashboard extends Component<DashboardProps, {}> {
    private socket:any;
    private contentWrapper:HTMLDivElement;
    private btnCampaigns:HTMLLIElement;
    private btnCharacters:HTMLLIElement
    private positions:any;

    constructor(props: any) {
        super(props);
        this.socket = null;
        this.positions = {};

        this.scrollTo = this.scrollTo.bind(this);
    }

    componentDidMount() {
        this.calculateElementPositions();
        this.registerContentScrollEvent();
    }

    logout() {
        console.log("you are logging out");
        let auth = new Auth(this.props.history);
        auth.logout();
        this.props.updateAuth(auth);
    }

    send(msg:string){
        this.socket.emit('greeting', {msg: msg});
    }

    scrollTo(element:String) {
        // NOTE: bug when animating scroll with 'scroll-snap-type' disabled; so must remove css prop
            // before animation, then re-enable after animation is complete
        var content = $(this.contentWrapper);
        content
            .css({"scroll-snap-type": "none", "-webkit-scroll-snap-type": "none"})
            .animate({
                scrollTop: $(element).position().top
            }, 500, () => {
                content.css({"scroll-snap-type": "y mandatory", "-webkit-scroll-snap-type": "y mandatory"});
            });
    }

    registerContentScrollEvent() {
        $(this.contentWrapper).scroll(() => {
            let pos = $(this.contentWrapper).scrollTop();

            $(".menu-dashboard ul li.active").removeClass("active");
            if (pos <=this.positions.characters && pos < this.positions.characters) 
                $(this.btnCampaigns).addClass("active");
            else if (pos >= this.positions.characters)
                $(this.btnCharacters).addClass("active");
        })
    }

    calculateElementPositions() {
        this.positions.campaigns = $("#campaigns").position().top;
        this.positions.characters = $("#characters").position().top;
    }

    connectToServer() {
        console.log('connecting to server!');
        let skt = io.connect("http://localhost:8080");
        let credentials = this.generateCredentials();
        skt.on('connect', function(){
            console.log('connection established');
            skt.emit('authentication', credentials);
            skt.on('authenticated', function() {
                console.log('authenticated!');
                // Add handlers for different types of events here (I think)
                // Until the socket receives an 'authenticated' event, it 
                // shouldn't be sending any more events to the server.
                skt.on('data.retrieved', function(event:any){
                    console.log('data retrieved: ' + JSON.stringify(event,null,2));
                    if(event.data.id !== undefined && event.namespace === 'user'){
                        localStorage.setItem('userid', event.data.id);
                    }
                });

                skt.on('data.persisted', function(event:any){
                    console.log('data persisted: ' + JSON.stringify(event,null,2));
                });

                skt.on('app.error', function(event:any){
                    console.log('error: ' + JSON.stringify(event,null,2));
                });
            });
            skt.on('unauthorized', function(data:any){
                console.log('authorization failed: ' + JSON.stringify(data,null,2));
                skt.disconnect();
            });
            skt.on('disconnect', function(){
                console.log('connection lost');
            });
        });
        this.socket = skt;
    }

    /*
    Gets character info. The id passed in is the character's mongo id.
    */
    getCharacter(id:any){
        console.log("getting a character");
        if(this.socket === null) console.log("no server connection");
        else {
            let retrievalEvent = {
                namespace: "character",
                key: id
            };
            this.socket.emit('data.get', retrievalEvent);
        }
    }

    getCampaign(id:any){
        console.log("getting a campaign");
        if(this.socket === null) console.log("no server connection");
        else {
            let retrievalEvent = {
                namespace: "campaign",
                key: id
            };
            this.socket.emit('data.get', retrievalEvent);
        }
    }

    generateTestCharacter(){
        console.log("generating a test character");
        if(this.socket === null){
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
            this.socket.emit('data.persist', event);
        }
    }

    generateTestCampaign(){
        console.log("generating test campaign");
        if(this.socket === null){
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
            this.socket.emit('data.persist', event);
        }
    }

    generateCredentials():any {
        let credentials = {
            access_token: localStorage.getItem('access_token'),
            id_token: localStorage.getItem('id_token'),
            expires_at: localStorage.getItem('expires_at')
        }
        return credentials;
    }

    render() {
        let auth = new Auth(this.props.history);
        auth.handleAuthentication();
        
        const menu = (
            <div className="menu-dashboard">
                <div className="menu-top">
                    <ul>
                        <li className="active" ref={el => this.btnCampaigns = el} onClick={this.scrollTo.bind(null, "#campaigns")}>Campaigns</li> 
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

                <CampaignsSection />

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
    updateAuth
}

export default connect(UserReducer, mapActionsToProps)(Dashboard);