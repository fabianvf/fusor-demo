import * as React from 'react';
import { Jumbotron, Row, Col } from 'react-bootstrap';

class Layout extends React.Component {
  render() {
    return (
      <Row>
        <Col xs={12}>
          <Jumbotron>
            <h2 className="header">Review Deployment</h2>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}

export default Layout;
