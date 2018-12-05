import EventBus from './Events';

// Create a mock function just to mock the socket creation so no socket is created
const mockCreateSocket = jest.fn();
const mockGetCredentials = () => {
    return Promise.resolve({
        access_token: "",
        id_token: "",
        expires_at: "",
    });
};

test('registers event', () => {
    const mockEventHandler = jest.fn();
    const eventName = 'jest.test';

    EventBus.get('', mockGetCredentials, mockCreateSocket)
        .then((bus) => {
            bus.on(eventName, mockEventHandler);

            expect(bus.getListeners(eventName)).toEqual([mockEventHandler]);
        });
});

test('emits events', () => {
    const mockEventHandler = jest.fn();
    const eventName = 'jest.test';
    const payload = {'hello': 'world'};

    EventBus.get('', mockGetCredentials, mockCreateSocket)
        .then((bus) => {
            bus.on(eventName, mockEventHandler);
            bus.emit(eventName, payload);

            expect(mockEventHandler.mock.calls.length).toBe(1);
            expect(mockEventHandler.mock.calls[0][0]).toBe(payload);
        });
});

test('emits events to correct handlers', () => {
    const mockEventHandler1 = jest.fn();
    const mockEventHandler2 = jest.fn();
    const eventName1 = 'jest.test.1';
    const eventName2 = 'jest.test.2';
    const payload = {'hello': 'world'};

    EventBus.get('', mockGetCredentials, mockCreateSocket)
        .then((bus) => {
            bus.on(eventName1, mockEventHandler1);
            bus.on(eventName2, mockEventHandler2);

            bus.emit(eventName1, payload);

            expect(mockEventHandler1.mock.calls.length).toBe(1);
            expect(mockEventHandler1.mock.calls[0][0]).toBe(payload);
            expect(mockEventHandler2.mock.calls.length).toBe(0);
        });
});

test('emits events to all listeners', () => {
    const mockEventHandler = jest.fn();
    const eventName = 'jest.test';
    const payload = {'hello': 'world'};
    const numListeners = 3;

    EventBus.get('', mockGetCredentials, mockCreateSocket)
        .then((bus) => {
            for (let i = 0; i < numListeners; i++) {
                bus.on(eventName, mockEventHandler);
            }

            bus.emit(eventName, payload);

            expect(mockEventHandler.mock.calls.length).toBe(numListeners);
            expect(mockEventHandler.mock.calls[0][0]).toBe(payload);
        });
});

test('removes listener', () => {
    const mockEventHandler1 = jest.fn();
    const mockEventHandler2 = jest.fn();
    const eventName = 'jest.test';

    EventBus.get('', mockGetCredentials, mockCreateSocket)
        .then((bus) => {
            bus.on(eventName, mockEventHandler1);
            bus.on(eventName, mockEventHandler2);

            bus.removeListener(eventName, mockEventHandler1);

            expect(mockEventHandler1.mock.calls.length).toBe(0);
            expect(mockEventHandler2.mock.calls.length).toBe(0);
            expect(bus.getListeners(eventName)).toEqual([mockEventHandler2]);
        });
});

test('removes all listener', () => {
    const mockEventHandler1 = jest.fn();
    const mockEventHandler2 = jest.fn();
    const eventName = 'jest.test';

    EventBus.get('', mockGetCredentials, mockCreateSocket)
        .then((bus) => {
            bus.on(eventName, mockEventHandler1);
            bus.on(eventName, mockEventHandler2);

            bus.removeListeners(eventName);

            expect(mockEventHandler1.mock.calls.length).toBe(0);
            expect(mockEventHandler2.mock.calls.length).toBe(0);
            expect(bus.getListeners(eventName)).toEqual([]);
        });
});
