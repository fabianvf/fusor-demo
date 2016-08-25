import * as React from 'react';

export default ({deploymentStep}) => {
  return (
    <div>
      <div className="progress-description">
        <span className="pficon pficon-ok"></span> <strong>{deploymentStep.type}</strong>
      </div>
      <div className="progress progress-label-top-right">
        <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};
