import { combineReducers } from 'redux';
import genReducer from 'nsk-reducer';
import actions from './actions';
import I from 'immutable';

const defaultDeployment = {
  isStarted: false
};

const deploymentHandlers = I.Map({
  [actions.deployment.types.EXECUTE_FULFILLED]: (state, action) => {
    return action.payload.data.deployment;
  },
  [actions.deployment.types.RESET_FULFILLED]: (state, action) => {
    return action.payload.data.deployment;
  },
  [actions.deployment.types.BOOTSTRAP_FULFILLED]: (state, action) => {
    return action.payload.data.deployment;
  },
  [actions.deployment.types.UPDATE]: (state, action) => {
    return action.payload;
  },
});

export default (initialId) => {
  return combineReducers({
    deployment: genReducer({...defaultDeployment, initialId} , deploymentHandlers)
  });
};
