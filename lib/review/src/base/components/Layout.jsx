import * as React from 'react';
import { connect } from 'react-redux';
import ReviewDetails from '../../ReviewDetails';
import Tasks from '../../Tasks';
import DeploymentDone from '../../DeploymentDone';
import actions from '../../actions';

import {
  Button,
  Jumbotron,
  Row,
  Col
} from 'react-bootstrap';

class Layout extends React.Component {
  componentDidMount() {
    // Bootstraps initial load if this is a first mount
    const { deployment } = this.props;

    if(deployment.initialId) {
      this.props.bootstrapDeployment(deployment.initialId);
    }
  }

  render() {
    const { deployment, execute, reset } = this.props;
    const execCurry = execute.bind(this, deployment._id);
    const resetCurry = reset.bind(this, deployment._id);

    let content;
    if(!deployment.initialId) {
      switch(deployment.status) {
        case 'new':
          content = <ReviewDetails deployment={deployment} />
          break;
        case 'started':
          content = <Tasks deploymentSteps={deployment.steps}/>
          break;
        case 'done':
          content = <DeploymentDone />
          break;
        default:
          content = <p>Unrecognized status...</p>;
      }
    }

    return (
      <div>
        <Row>
          <Col xsOffset={2} xs={8}>
            <Jumbotron>
              <h1 className="header">Review Deployment</h1>

              <div style={{border: '2px solid #AAA', padding: '20px'}}>
                {content}
              </div>
            </Jumbotron>

            {(() => {
              if(deployment.status === 'new') {
                return <Button className="execute" bsSize="large" bsStyle="primary" onClick={execCurry}>Execute</Button>
              } else if(deployment.status === 'done')
                return <Button className="reset" bsSize="large" bsStyle="secondary" onClick={resetCurry}>Reset</Button>
            })()}

          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      deployment: state.deployment
    };
  },
  (dispatch) => {
    return {
      execute: (deploymentId) => {
        dispatch(actions.deployment.execute(deploymentId));
      },
      reset: (deploymentId) => {
        dispatch(actions.deployment.reset(deploymentId));
      },
      bootstrapDeployment: (initialId) => {
        dispatch(actions.deployment.bootstrap(initialId))
      }
    };
  }
)(Layout);
