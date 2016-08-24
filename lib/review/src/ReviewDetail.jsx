import * as React from 'react';

import {
  Row,
  Col
} from 'react-bootstrap';

class ReviewDetail extends React.Component {
  render() {
    const { label, content }= this.props;

    return (
      <Row>
        <Col className="text-right bold" xs={6} md={2}>
          {label}
        </Col>
        <Col xs={6} md={10}>
          {content}
        </Col>
      </Row>
    );
  }
}

export default ReviewDetail;

