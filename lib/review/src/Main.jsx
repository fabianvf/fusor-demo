import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import Layout from './base/components/Layout';
import rootReducer from './reducers';

import './shared/styles/review.scss';

////////////////////////////////////////////////////////////
// socket.io
////////////////////////////////////////////////////////////
//import io from 'socket.io-client';
//const socket = io();

//socket.on('message', (msg) => console.log('got message -> ', msg));
//const socketMiddleware = socket => store => next => action => {
  //const rx = /^([a-z]*?).([A-Z]*?)_FULFILLED/;
  //const match = rx.exec(action.type);
  //const isFulfilledPromise = !!match;

  //const socketMeta = action.meta && action.meta.socket;

  //// TODO: Explicit subscribe/unsubscribe handlers?
  ////if(action.type === 'SOCKET_SUB') {
  ////} else if(action.type === 'SOCKET_UNSUB') {
  ////}

  //// Can attach a socket action to a CRUD operation
  //if(isFulfilledPromise && socketMeta) {
    //const type = socketMeta.type;
    //const modelName = match[1];
    //const model = action.payload.data[modelName];

    //if(type === 'sub') {
      //socket.on(channel(modelName, model.id), (data) => {
        //// Update store with new data
        //const progress = data[modelName].progress;
        //store.dispatch({
          //type: socketMeta.updateAction,
          //payload: data[modelName]
        //})
      //});
    //} else if(type === 'unsub'){
      //console.debug('unsubbing promise?');
    //} else {
      //throw 'ERROR: Unsupported socket action'
    //}
  //}

  //// No socket action, pass through
  //return next(action);
//}

//function channel(modelName, modelId) {
  //return `/${modelName}/${modelId}`;
//}

//promiseMiddleware(), socketMiddleware(socket), loggerMiddleware())

////////////////////////////////////////////////////////////
// Store Setup
////////////////////////////////////////////////////////////

const store = createStore(
  rootReducer,
  applyMiddleware(
    promiseMiddleware(), loggerMiddleware())
);

////////////////////////////////////////////////////////////
// React Setup
////////////////////////////////////////////////////////////

const app =
  <Provider store={store}>
    <Layout />
  </Provider>

$(() => {
  const mountPoint = document.getElementById('reviewStepClient');
  ReactDOM.render(app, mountPoint);
});
