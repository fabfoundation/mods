//
// files.js
// This program generates a html list of files
// usage: node js/files.js > destination.html
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez 2019
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods 
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
var fs = require('fs')
//
// directories to not index
//
var ignore = ['./js/node_modules', './js/Windows/node_modules', './.git', '.js/build', '.js/package-lock.json']
//
// set up page
//
str = '<html>\n\
   <head><meta charset="utf-8"></head>\n\
   <body>\n\
   <body link="black" alink="black" vlink="black">\n\
   <script>\n\
   function handler(uri) {\n\
      window.opener.callback(uri)\n\
      window.close()\n\
      }\n\
   </script>\n\
   '
//
// list files
//
list_files(".")
//
// output to stdout
//
console.log(str)
//
// list_files
//    file tree walker
//
function list_files(path) {
    var files = fs.readdirSync(path)
    iloop: for (var i = 0; i < files.length; ++i) {
        for (var j = 0; j < ignore.length; ++j)
            if (path.indexOf(ignore[j]) != -1)
                continue iloop
        var file = files[i]
        var stats = fs.statSync(path + '/' + file)
        if (stats.isFile() == true) {
            url = path + '/' + file
            var match = url.match(/\//g)
            if (match == null)
                var prefix = ''
            else {
                var prefix = Array(1 + match.length).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            }
            str += prefix
            str += '<a href='
            str += "'"
            str += encodeURI(url)
            str += "'"
            str += '>' + file + '</a><br>\n'
        } else if (stats.isDirectory() == true) {
            url = path + '/' + file
            var match = url.match(/\//g)
            if (match == null)
                var prefix = ''
            else {
                var prefix = Array(1 + match.length).join('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
            }
            str += '<b>' + prefix + file + '</b><br>\n'
            list_files(path + '/' + file)
        } else
            console.log('unknown file type')
    }
}
