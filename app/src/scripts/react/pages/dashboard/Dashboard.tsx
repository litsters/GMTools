import React, { Component } from "react";
import { Link } from "react-router-dom";
import io  from "socket.io-client";
import { connect } from "react-redux";
import { UserReducer } from "../../reducers";
import Auth from "../../auth/Auth";
import { updateAuth } from "../../actions/user-actions";
import MasterDetailsLayout from "../../layout/MasterDetailLayout";
import { MainRouterConfig } from "../../routers/config";
import * as $ from "jquery";


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
                <div className="content-page campaigns" id="campaigns">
                    <h1>Here are your Campaigns</h1>
                    <Link to={MainRouterConfig.routes.game.path}>go to demo</Link>
                </div>
                <div className="content-page characters" id="characters">
                    <h1>Here are your Characters</h1>
                </div>
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