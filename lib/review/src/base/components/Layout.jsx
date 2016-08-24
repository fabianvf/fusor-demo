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
  render() {
    const { deployment, execute } = this.props;

    const content = deployment.isStarted ?
      <Tasks /> : <ReviewDetails detailCount={20} />

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
      }
    };
  }
)(Layout);
