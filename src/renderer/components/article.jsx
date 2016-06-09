import React from 'react';
import ReactDOM from 'react-dom';
import Divider from './divider';
import Markdown from './markdown';
import TableOfContents from './table_of_contents';

export default class Article extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="contents-container">
        <Divider>{this.props.children.title}</Divider>
        <p>Last modified: {this.props.children.updated_at}</p>
        <div id="article-col">
          <Markdown>{this.props.children.body}</Markdown>
        </div>
        <div id="toc-col">
          <TableOfContents>{this.props.children.body}</TableOfContents>
        </div>
      </div>
    );
  }

}
