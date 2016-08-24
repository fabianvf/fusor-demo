import * as React from 'react';
import ReviewDetail from './ReviewDetail';
import faker from 'faker';

class ReviewDetails extends React.Component {
  render() {
    const { detailCount } = this.props;

    const detailItems = [];
    for(let i = 0; i < detailCount; i++) {
      detailItems.push(
        <ReviewDetail
          label={faker.name.findName()}
          content={faker.internet.email()}
        />
      )
    }

    return (
      <div>
        {detailItems}
      </div>
    );
  }
}

export default ReviewDetails;
