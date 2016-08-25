import * as React from 'react';

export default ({deploymentStep}) => {
  const progressString = (Math.floor(Number(deploymentStep.progress) * 100)).toString();
  return (
    <div>
      <div className="progress-description">
        <div className="spinner spinner-xs spinner-inline"></div> <strong>{deploymentStep.type}</strong>
      </div>
      <div className="progress progress-label-top-right">
        <div className="progress-bar" role="progressbar" aria-valuenow={progressString} aria-valuemin="0" aria-valuemax="100" style={{width: `${progressString}%`}}>
          <span>{progressString}%</span>
        </div>
      </div>
    </div>
  );
};
