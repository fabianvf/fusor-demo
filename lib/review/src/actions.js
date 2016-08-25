import { baseUrl } from './shared/api';
import merge from 'merge';
import Axios from 'axios';
const axios = Axios.create({
  headers: {'Accept': 'application/json'}
});

const deploymentsUrl = `${baseUrl}/deployments`;

const deploymentTypes = {
  BOOTSTRAP: 'deployment.BOOTSTRAP',
  BOOTSTRAP_FULFILLED: 'deployment.BOOTSTRAP_FULFILLED',
  EXECUTE: 'deployment.EXECUTE',
  EXECUTE_FULFILLED: 'deployment.EXECUTE_FULFILLED',
  RESET: 'deployment.RESET',
  RESET_FULFILLED: 'deployment.RESET_FULFILLED',
  UPDATE: 'deployment.UPDATE',
};

const deploymentActions = {
  execute: (deploymentId) => {
    const executeEndpoint = `${deploymentsUrl}/${deploymentId}/execute`;
    return {
      type: deploymentTypes.EXECUTE,
      payload: axios.post(executeEndpoint)
    };
  },
  reset: (deploymentId) => {
    const resetEndpoint = `${deploymentsUrl}/${deploymentId}/reset`;
    return {
      type: deploymentTypes.RESET,
      payload: axios.post(resetEndpoint)
    };
  },
  bootstrap: (initialId) => {
    return {
      type: deploymentTypes.BOOTSTRAP,
      payload: axios.get(`${deploymentsUrl}/${initialId}`)
    }
  },
  update: (deployment) => {
    return {
      type: deploymentTypes.UPDATE,
      payload: deployment
    }
  }
};

const actions = {
  deployment: merge({types: deploymentTypes}, deploymentActions)
};

export default actions;
