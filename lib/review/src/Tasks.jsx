import * as React from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';

class Tasks extends React.Component {
  render() {
    return (
      <div>
        <div className="progress-description">
          <span className="pficon pficon-ok"></span> <strong>Network Activity:</strong>  10.10.121.02
        </div>
        <div className="progress progress-label-top-right">
          <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
            <span>100%</span>
          </div>
        </div>

        <div className="progress-description">
          <span className="pficon pficon-ok"></span> <strong>Network Activity:</strong>  10.10.121.02
        </div>
        <div className="progress progress-label-top-right">
          <div className="progress-bar progress-bar-success" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: '100%'}}>
            <span>100%</span>
          </div>
        </div>

        <div className="progress-description">
          <div className="spinner spinner-xs spinner-inline"></div> <strong>Downloading:</strong>  Product Repositories
        </div>
        <div className="progress progress-label-top-right">
          <div className="progress-bar" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{width: '80%'}}>
            <span>80.0% (35 of 82MB)</span>
          </div>
        </div>

        <div className="progress-description">
          <div className="spinner spinner-xs spinner-inline"></div> <strong>Downloading:</strong>  Product Repositories
        </div>
        <div className="progress progress-label-top-right">
          <div className="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style={{width: '0%'}}>
            <span>0% (0 of 82MB)</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Tasks;

