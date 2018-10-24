import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import history from './scripts/react/routers/history';
import './styles/app.css';
import App from './scripts/App';
import registerServiceWorker from './scripts/registerServiceWorker';

// state management
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { UserReducer, CodexReducer } from './scripts/react/reducers';


const allReducers = combineReducers({
  user: UserReducer,
  codex: CodexReducer
});

const allStoreEnahncers = (window as any).devToolsExtension ?
    compose(
        applyMiddleware(thunk),
        (window as any).devToolsExtension()
    ) : 
    compose(
        applyMiddleware(thunk)
    );

const store = createStore(
  allReducers,
  {},
  allStoreEnahncers
);

ReactDOM.render(

    <Provider store={store}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
