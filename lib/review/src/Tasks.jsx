import * as React from 'react';
import TaskBarNew from './TaskBarNew';
import TaskBarStarted from './TaskBarStarted';
import TaskBarDone from './TaskBarDone';

class Tasks extends React.Component {
  render() {
    const { deploymentSteps } = this.props;
    const renderedSteps = deploymentSteps.map((ds, idx) => {
      let task;
      switch(ds.progress) {
        case 0:
          task = <TaskBarNew key={idx} deploymentStep={ds}/>
          break;
        case 1:
          task = <TaskBarDone key={idx} deploymentStep={ds}/>
          break;
        default:
          task = <TaskBarStarted key={idx} deploymentStep={ds} />
      }
      return task;
    });

    return (
      <div>
        <h3>Tasks</h3>
        <div>
          {renderedSteps}
        </div>
      </div>
    );
  }
}

export default Tasks;

