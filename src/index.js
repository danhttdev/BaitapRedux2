import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import Container1 from "././components/Container1";
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {reducer} from "./reducers/reducer";
import thunk from 'redux-thunk';

var store = createStore(reducer,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),applyMiddleware(thunk));
ReactDOM.render(
    <Provider store={store}>
        <Container1 />
    </Provider>, document.getElementById("root"));

registerServiceWorker();
