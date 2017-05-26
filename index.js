#!/usr/bin/env node
'use strict';
var fs = require('fs');
var join = require('path').join;
var readline = require('readline');
var crypto = require('crypto');

var htpasswdPath = join(__dirname, 'htpasswd');

if (fs.existsSync(htpasswdPath)) {
  var htpasswd = fs.readFileSync(htpasswdPath, 'utf-8');
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('username：', (username) => {
    rl.question('password：', (password) => {
      if (username != encodeURIComponent(username)) {
        throw Error("username shouldn't contain non-uri-safe characters");
      }
      password = '{SHA}' + crypto.createHash('sha1').update(password, 'binary').digest('base64');
      var comment = 'autocreated ' + (new Date()).toJSON()
      var newline = username + ':' + password + ':' + comment + '\n';
      fs.writeFileSync(htpasswdPath, htpasswd + newline);
      rl.close();
    });
  });
} else {
  console.log("htpasswd file not exist")
}