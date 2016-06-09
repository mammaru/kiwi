import React from 'react';
import ReactDOM from 'react-dom';

export default class MarkdownForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div id="edit-area">
        <textarea
          onChange={this.handleChange.bind(this)}
          ref="textarea"
          id="input"
          className="input-area"
          value={this.props.contents.body}
        />
      </div>
    );
  }

  handleChange(ev) {
    this.props.onChange({ body: ev.target.value });
  }


}
