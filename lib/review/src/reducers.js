import { combineReducers } from 'redux';
import genReducer from 'nsk-reducer';
import actions from './actions';
import I from 'immutable';

const defaultDeployment = {
  isStarted: false
};

const deploymentHandlers = I.Map({
  [actions.deployment.types.EXECUTE]: (state, action) => {
    const prevIsStarted = state.isStarted;
    return {...state, isStarted: !prevIsStarted}; // Toggle
  },
});

export default combineReducers({
  deployment: genReducer(defaultDeployment, deploymentHandlers)
});
