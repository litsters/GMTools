import auth0 from 'auth0-js';

const homeRoute: string = "/";

class Auth {
    private auth0: auth0.WebAuth;
    private history: any;

    constructor(history: History){
        this.auth0 = new auth0.WebAuth({
            domain: 'gm-tools.auth0.com',
            clientID: '5j5hV3sMFUstdIOijBgVxGWuSw059kBQ',
            redirectUri: 'http://localhost:3000/dashboard',
            responseType: 'token id_token',
            scope: 'openid'
        });
        this.history = history;
    }

    login(): void{
        this.auth0.authorize();
    }

    handleAuthentication(): void{
        this.auth0.parseHash((err, authResult) => {
            if(authResult && authResult.accessToken && authResult.idToken){
                this.setSession(authResult);
                this.history.replace(homeRoute);
            } else if(err){
                this.history.replace(homeRoute);
                console.log(err);
            }
        });
    }

    setSession(authResult: any): void{
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        // navigate to the home route
        this.history.replace(homeRoute);
    }

    logout(): void{
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route
        this.history.replace(homeRoute);
    }

    isAuthenticated(): boolean{
        // Check whether the current time is past the 
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}

export default Auth;