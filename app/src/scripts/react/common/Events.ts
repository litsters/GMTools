import io from "socket.io-client";

function getCredentials(): object {
    return {
        access_token: localStorage.getItem('access_token'),
        id_token: localStorage.getItem('id_token'),
        expires_at: localStorage.getItem('expires_at')
    };
}

function createSocket(url: string, onConnect: Function): SocketIOClient.Socket {
    const socket = io.connect(url);

    socket.on('connect', onConnect);

    return socket;
}

var bus: EventBus;

const getBus = () => {
    if (!bus) {
        bus = new EventBus("http://localhost:8080", createSocket); // TODO this needs to be configurable
    }

    return bus;
};

export class EventBus {
    socket: SocketIOClient.Socket;
    isAuthenticated: boolean;
    private readonly events: any;

    /**
     * Create a new EventBus
     * @param url The url for the socket.io server
     * @param socketCreator A function to call to actually create the socket.io Socket
     */
    constructor(url: string, socketCreator: (url:string, onConnect:Function) => SocketIOClient.Socket) {
        this.events = {};
        this.isAuthenticated = false;

        // Establish a connection to the server
        this.socket = socketCreator(url, this.initializeSocket.bind(this))
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
        this.socket.emit('authentication', getCredentials());
        this.socket.on('authenticated', () => {
            console.log('authenticated!');
            this.isAuthenticated = true;
        });
        this.socket.on('unauthorized', (data:any) => {
            console.log('authorization failed:', data);
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
    }
}

export default getBus;
