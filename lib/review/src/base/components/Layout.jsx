import * as React from 'react';
import { connect } from 'react-redux';
import ReviewDetails from '../../ReviewDetails';
import Tasks from '../../Tasks';
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
    const { deployment, execute } = this.props;

    let content = <h3>Loading...</h3>; // TODO: Load is so fast...what to do?

    if(!deployment.initialId) {
      content = deployment.status === 'started' ?
        <Tasks /> : <ReviewDetails deployment={deployment} />
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

              <Button className="execute" bsSize="large" bsStyle="primary" onClick={execute}>Execute</Button>
            </Jumbotron>
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
      execute: () => {
        dispatch(actions.deployment.execute());
      },
      bootstrapDeployment: (initialId) => {
        dispatch(actions.deployment.bootstrap(initialId))
      }
    };
  }
)(Layout);
