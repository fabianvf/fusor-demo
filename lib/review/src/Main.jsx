import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import socketMiddleware from './socket-middleware';
import Layout from './base/components/Layout';
import rootReducer from './reducers';

import './shared/styles/review.scss';

////////////////////////////////////////////////////////////
// socket.io
////////////////////////////////////////////////////////////
import io from 'socket.io-client';
const socket = io();

const idRegex = /deployments\/+([a-z0-9]+)\/+review/;
const match = idRegex.exec(document.location.pathname);

if(match.length < 2) {
  throw 'ERROR: Something went bad trying to get the deployment ID from the pathname';
}

const initialDeploymentId = match[1];

const store = createStore(
  rootReducer(initialDeploymentId),
  applyMiddleware(
    promiseMiddleware(), socketMiddleware(socket), loggerMiddleware())
);

const app =
  <Provider store={store}>
    <Layout />
  </Provider>

const mountPoint = document.getElementById('reviewStepClient');
ReactDOM.render(app, mountPoint);
