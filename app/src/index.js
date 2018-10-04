import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import './styles/app.css';
import App from './scripts/App';
import registerServiceWorker from './scripts/registerServiceWorker';

// state management
import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { UserReducer } from './scripts/react/reducers';


const allReducers = combineReducers({
  user: UserReducer
});


const allStoreEnahncers = window.devToolsExtension ? 
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension()
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
        <Router>
            <App />
        </Router>
    </Provider>, 
    document.getElementById('root')
);

registerServiceWorker();
