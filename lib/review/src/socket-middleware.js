import actions from './actions';

const socketMiddleware = socket => store => next => action => {
  const rx = /^deployment\.EXECUTE_FULFILLED/;
  const match = rx.exec(action.type);
  const isFulfilledPromise = !!match;

  // Can attach a socket action to a CRUD operation
  if(isFulfilledPromise) {
    const deploymentId = action.payload.data.deployment._id;
    const channel = `/deployments/${deploymentId}`;

    socket.on(channel, (data) => {
      store.dispatch(actions.deployment.update(data.deployment));
    });
  }

  // No socket action, pass through
  return next(action);
}

export default socketMiddleware;
