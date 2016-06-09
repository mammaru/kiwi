import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default class TableOfContents extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div id="table-of-contents">
        <h4>Table of Contents</h4>
        {this.renderTableOfContents()}
      </div>
    );
  }

  renderTableOfContents() {
    let sections = this.sectionizeMarkdown(this.props.children.toString());
    //console.log(sections);
    function _makeTable(arr){
      return(
        arr.map(sec => {
          let cell;
          //console.log(sec);
          if(sec instanceof Array){
            cell = <tr><td className="inner-toc-row"><table className="inner-toc-table"><tbody>{_makeTable(sec)}</tbody></table></td></tr>;
          }else{
            cell = <tr><td className="toc-row">{sec}</td></tr>;
          }
          //console.log(cell);
          return (cell);
        })
      );
    }
    return (
      <table className="toc-table">
        <tbody>
          {_makeTable(sections)}
        </tbody>
      </table>
    );
  }

  sectionizeMarkdown(md) {
    return(sectionize(md));
  }
}

function sectionize(arg){
  function _sectionize(arg){
    if(!(arg instanceof Array)) return arg.replace(/^ |\n/g, "");
    let tmp = [], tmp1;
    let sec = _.map(arg, line => {return line.replace(/^#/, "")});
    let subsec = _.groupBy(sec, line => {
      if(!line.match(/#/)){
        tmp1 = line;
        tmp.push(tmp1);
      }else{
        return tmp1;
      }
    });
    delete subsec[undefined];
    for(let key in subsec){
      tmp.splice(tmp.indexOf(key)+1, 0, subsec[key]);
    }
    return _.map(tmp, _sectionize);
  }
  return(_sectionize(arg.match(/.*# .*\n/g)));
}

function makeTable(arr){
  let table = document.createElement('table');
  let tbody = document.createElement('tbody');
  _.forEach(arr, sec => {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    if(sec instanceof Array){
      td.appendChild(makeTable(sec));
    }else{
      td.innerHTML = sec;
    }
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}
