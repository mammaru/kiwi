import React from 'react';

export default class Divider extends React.Component {
  render() {
    let text;
    if (this.props.children) {
      text = <h2>{this.props.children}</h2>
    }

    return (
      <div className="divider clearfix">
        {text}<hr />
      </div>
    );
  }
}
