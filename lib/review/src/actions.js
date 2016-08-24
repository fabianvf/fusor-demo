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
};

const deploymentActions = {
  execute: (deployment) => {
    //const deployment_id = deployment.id;
    return {
      type: deploymentTypes.EXECUTE,
      payload: {
        id: '10817324086716924' // TODO
      }
    };
  },
  bootstrap: (initialId) => {
    return {
      type: deploymentTypes.BOOTSTRAP,
      payload: axios.get(`${deploymentsUrl}/${initialId}`)
    }
  }
};

const actions = {
  deployment: merge({types: deploymentTypes}, deploymentActions)
};

export default actions;
