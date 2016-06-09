'use strict';

//require('babel-register');
import 'babel-polyfill';

//import React from 'react';
import ReactDOM from 'react-dom';
import Routes from '../renderer/route';

(function() {
  window.onload = function() {
    ReactDOM.render(Routes, document.getElementById('main'));
  }
}());

