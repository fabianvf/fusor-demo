import { baseUrl } from './shared/api';
import merge from 'merge';

const deploymentsUrl = `${baseUrl}/deployments`;

const deploymentTypes = {
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
  }
};

const actions = {
  deployment: merge({types: deploymentTypes}, deploymentActions)
};

export default actions;
