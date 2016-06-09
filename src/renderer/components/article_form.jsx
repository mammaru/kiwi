import React from 'react';
import ReactDOM from 'react-dom';

export default class ArticleForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <h2>Title</h2>
        <input
           className='title'
           type='text'
           value={this.props.contents.title}
           onChange={this.handleTitleChange.bind(this)}
        />
        <h2>Markdown</h2>
        <textarea
          id="input"
          className="input-area"
          value={this.props.contents.body}
          onChange={this.handleBodyChange.bind(this)}
          ref="textarea"
        />
      </div>
    );
  }

  handleTitleChange(ev) {
    this.props.onChange({ title: ev.target.value });
  }
  
  
  handleBodyChange(ev) {
    this.props.onChange({ body: ev.target.value });
  }
  
}
