import io from "socket.io-client";

interface ICredentials {
    access_token: string
    id_token: string
    expires_at: string
}

function getCredentials(): Promise<ICredentials> {
    function _get(resolve: Function) {
        let accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setTimeout(() => _get(resolve), 20);
        } else {
            resolve({
                access_token: accessToken,
                id_token: localStorage.getItem('id_token'),
                expires_at: localStorage.getItem('expires_at')
            });
        }
    }

    return new Promise(_get);
}

function createSocket(url: string, onConnect: Function): SocketIOClient.Socket {
    const socket = io.connect(url);

    socket.on('connect', onConnect);

    return socket;
}

let busPromise: Promise<EventBus>;

class EventBus {
    socket: SocketIOClient.Socket;
    isAuthenticated: boolean;
    private readonly credentials: ICredentials;
    private readonly events: object;
    private socketInitialized: boolean;

    /**
     * Create a new EventBus
     * @param url The url for the socket.io server
     * @param credentials
     * @param socketCreator A function to call to actually create the socket.io Socket
     */
    private constructor(url: string, credentials: ICredentials, socketCreator: (url:string, onConnect:Function) => SocketIOClient.Socket) {
        this.events = {};
        this.isAuthenticated = false;
        this.credentials = credentials;

        // Establish a connection to the server
        this.socket = socketCreator(url, this.initializeSocket.bind(this))
    }

    static get(url = "", credentialsGetter = getCredentials, socketCreator = createSocket): Promise<EventBus> {
        if (!busPromise) {
            busPromise = credentialsGetter()
                .then((credentials) => {
                    return new EventBus(url || "http://localhost:8080", credentials, socketCreator);
                });
        }
        return busPromise;
    }

    static on(event: string, fn: Function) {
        EventBus.get()
            .then((bus) => {
                bus.on(event, fn);
            });
    }

    static emit(event: string, payload: any, sendToServer = false) {
        EventBus.get()
            .then((bus) => {
                bus.emit(event, payload, sendToServer);
            });
    }

    on(event: string, fn: Function): EventBus {
        // Save the event
        if (event in this.events) {
            this.events[event].push(fn);
        } else {
            this.events[event] = [ fn ];
        }

        return this;
    }

    emit(event: string, payload: any, sendToServer = false): EventBus {
        if (sendToServer && this.socket) {
            this.socket.emit(event, payload);
        }

        this.doEmit(event, payload);

        return this;
    }

    getListeners(event: string): Function[] {
        if (event in this.events) {
            return this.events[event];
        }
        return [];
    }

    removeListener(event: string, fn: Function): EventBus {
        if (event in this.events) {
            for (let i = this.events[event].length - 1; i >= 0; i--) {
                if (this.events[event][i] == fn) {
                    this.events[event].splice(i, 1);
                }
            }
        }
        return this;
    }

    removeListeners(event: string): EventBus {
        if (event in this.events) {
            delete(this.events[event]);
        }
        return this;
    }

    /**
     * Emit events to the listeners. This happens asynchronously
     * @param event
     * @param payload
     */
    private doEmit(event: string, payload: any) {
        if (event in this.events) {
            new Promise((resolve: Function) => {
                this.events[event].map((fn: Function) => {
                    try {
                        fn(payload);
                    } catch(err) {
                        console.log('Event error:', err);
                    }
                });
                resolve();
            })
        }
    }

    private initializeSocket() {
        // TODO refine logging
        console.log('connection established');

        // Handle authentication
        this.socket.emit('authentication', this.credentials);

        if (!this.socketInitialized) {
            this.socket.on('authenticated', () => {
                console.log('authenticated!');
                this.isAuthenticated = true;
            });
            this.socket.on('unauthorized', (data:any) => {
                console.log('authorization failed:', data);
                this.isAuthenticated = false;
                this.socket.disconnect();
            });

            // Bind to some basic events
            this.socket.on('disconnect', () => {
                console.log('connection lost');
            });
            this.socket.on('app.error', (event: any) => {
                console.log('app error:', event);
            });
            this.socket.on('error', (err: any) => {
                console.log('socket error:', err)
            });

            // Replace the onevent handler with our own so we can catch all messages
            // @ts-ignore
            const onEvent = this.socket.onevent;

            // @ts-ignore
            this.socket.onevent = (packet) => {
                let args = packet.data || [];

                // Send this out to any of our event listeners
                this.doEmit.apply(this, args);

                // Send the event to any of the socket listeners
                onEvent.call(this.socket, packet);
            };

            this.socketInitialized = true;
        }
    }
}

export default EventBus;
