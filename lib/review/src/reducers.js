import { combineReducers } from 'redux';
import genReducer from 'nsk-reducer';
import actions from './actions';
import I from 'immutable';

const defaultDeployment = {
  isStarted: false
};

const deploymentHandlers = I.Map({
  [actions.deployment.types.EXECUTE]: (state, action) => {
    return {...state, status: 'started'};
  },
  [actions.deployment.types.BOOTSTRAP_FULFILLED]: (state, action) => {
    return action.payload.data.deployment;
  },
});

export default (initialId) => {
  return combineReducers({
    deployment: genReducer({...defaultDeployment, initialId} , deploymentHandlers)
  });
};
