'use strict'

import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import mkdirp from 'mkdirp';

export default class DocumentStorage extends EventEmitter {
  constructor(options) {
    super();
    //console.log(options);
    this.docHomePath = options.docHomePath;
    this.storageType = options.type;
    this.initialize();
    this.handleEvents();
  }

  initialize() {
    switch(this.storageType) {
      case 'file':
        this.storage = new File(this.docHomePath);
        break;
      case 'sqlite3':
        this.storage = new DataBase(this.docHomePath);
        break;
    }
  }

  handleEvents() {
    this.on('get-titles', callback => this.storage.wiki_titles(callback) );
    this.on('get-summary', callback => this.storage.wiki_summary(callback) );
    this.on('get-contents', (callback, id) => this.storage.wiki_find_by_id(id, callback) );
    this.on('save-contents', (callback, data) => this.storage.wiki_save(data) );
    this.on('update-contents', (callback, data) => this.storage.wiki_update(data) );
  }

  execute(query, callback) {
    if(query instanceof Array){
      query.forEach(q => {
        this.emit(q.method, callback, q.args);
      });
    }else{
      this.emit(query.method, callback, query.args);
    }
  }
}

class File {
  constructor(homePath) {
    this.md_dir = homePath + '/markdown';
    if(!fs.statSync(this.md_dir).isDirectory()) {
      mkdirp(this.md_dir, err => {
        if(err) throw err;
      })
    }
  }

  writeFile(path, contents, cb) {
    mkdirp(path.dirname(path), err => {
      if (err) return cb(err)
        fs.writeFile(path, contents, cb)
    })
  }
  
}

class DataBase {
  constructor(homePath) {
    const sqlite3 = require('sqlite3').verbose();
    const db_path = homePath + '/db.sqlite3';
    if (!fs.existsSync(db_path)) {
      this.db = new sqlite3.Database(db_path);
      this.db.run("CREATE TABLE IF NOT EXISTS contents (id INTEGER PRIMARY KEY AUTOINCREMENT, title STRING, body TEXT, updated_at TIMESTAMP DEFAULT (DATETIME('now','localtime')), created_at TIMESTAMP DEFAULT (DATETIME('now','localtime')), book_id INTEGER);");
    }else{
      this.db = new sqlite3.Database(db_path);
    }
  }
  
  wiki_all() {
    return this.db.all('SELECT * FROM contents;');
  }

  wiki_find_by_id(id, callback) {
    this.db.get('SELECT * FROM contents WHERE id="'+id+'";', (err, row) => {
      if(err) {
        console.log(err);
      }else{
        callback('contents', row);        
      }
    });
  }

  wiki_find_by_title(title) {
    return this.db.get('SELECT * FROM contents WHERE title=' + title + ';');
  }
  
  wiki_titles(callback) {
    this.db.all('SELECT id, title FROM contents;', (err, rows) => {
      if(err) {
        console.log(err);
      }else{
        //console.log(callback);
        callback('titles', rows);        
      }
    });
  }

  wiki_summary(callback) {
    this.db.all('SELECT * FROM contents order by updated_at DESC;', (err, rows) => {
      if(err) {
        console.log(err);
      }else{
        if(rows.length>5) {
          rows.length = 5;
        }        
        callback('summary', rows);        
      }
    });
  }

  wiki_save(arg) {
    console.log(arg);
    this.db.run('INSERT INTO contents(title, body) VALUES("'+arg.title+'","'+arg.body+'");');
  }

  wiki_update(arg) {
    this.db.run('UPDATE contents SET title="'+arg.title+'",body="'+arg.body+'",updated_at=DATETIME("now","localtime") where id="'+arg.id+'";')
  }
  
}
