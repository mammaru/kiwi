'use strict';

//require('babel-register');
import 'babel-polyfill';

import React from 'react';
import { Router, Route, IndexRoute, IndexRedirect, hashHistory } from 'react-router';
import App from './components/app';
import Wiki from './components/wiki';
import DashBoard from './components/dash_board';
import MainContents from './components/main_contents';
import ArticleEditor from './components/article_editor';
import NotFound from './components/not_found';

const Routes = (
  <Router history={hashHistory}>
    <Route title="App" path="/" component={App}>
      <IndexRedirect to="/wiki"/>
      <Route name="wiki" path="wiki" component={Wiki}>
        <IndexRoute component={DashBoard}/>
        <Route title="add article" path="/add_article" component={ArticleEditor}/>
        <Route path="/:contents_id" component={MainContents}/>
      </Route>
    </Route>
    <Route path="*" component={NotFound}/>
  </Router>
);

module.exports = Routes;
