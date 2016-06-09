import * as electron from 'electron'
import React from 'react';
import ReactDOM from 'react-dom';
import marked from 'marked';

export default class Markdown extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="markdown-area">
        {this.renderMarkup()}
      </div>
    );
  }

  componentDidMount() {
    this.setOpenLinkWithBrowser()
  }

  componentDidUpdate() {
    this.setOpenLinkWithBrowser()
  }

  setOpenLinkWithBrowser() {
    const anchors = document.querySelectorAll("a[href^='http']");
    for(let i = 0; i < anchors.length; i++) {
      if(location.host !== anchors[i].host){
        if(!anchors[i].className.match(/glyphicon/)) {
          anchors[i].className+="glyphicon glyphicon-new-window";
        }
        const anker = anchors[i];//.item(i); as HTMLLinkElement;
        anker.onclick = event => {
          //const target = event.target;// as HTMLLinkElement;
          //if(isExternalLink(event.target.href)) {
          event.preventDefault();
          electron.shell.openExternal(event.target.href);
        //}
        }
      }
    }
  }

  renderMarkup() {
    let md = this.props.children.toString();
    let options = {
      sanitize: this.props.sanitize,
      gfm: this.props.gfm,
      tables: this.props.tables,
      breaks: this.props.breaks,
      pedantic: this.props.pedantic,
      smartLists: this.props.smartLists,
      smartypants: this.props.smartypants
    };
    let html_str = { __html: marked(md, options) };
    return (<div className="markdown-body" dangerouslySetInnerHTML = {html_str} />);
  }

}

Markdown.propTypes = {
  children: React.PropTypes.string.isRequired,
  sanitize: React.PropTypes.bool,
  gfm: React.PropTypes.bool,
  tables: React.PropTypes.bool,
  breaks: React.PropTypes.bool,
  pedantic: React.PropTypes.bool,
  smartLists: React.PropTypes.bool,
  smartypants: React.PropTypes.bool
};

Markdown.defaultProps = {
  sanitize: true,
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  smartLists: true,
  smartypants: true
}
