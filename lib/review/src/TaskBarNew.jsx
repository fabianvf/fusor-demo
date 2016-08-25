import * as React from 'react';

export default ({deploymentStep}) => {
  return (
    <div>
      <div className="progress-description">
        <div className="spinner spinner-xs spinner-inline"></div> <strong>{deploymentStep.type}</strong>
      </div>
      <div className="progress progress-label-top-right">
        <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: '0%'}}>
          <span>0%</span>
        </div>
      </div>
    </div>
  );
};
