//
// programs.js
//    node js/programs.js subdir
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2018
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//

var fs = require('fs')

var subdir = process.argv[2]
var root = './' + subdir

var str = ''

list_files(root)
console.log(str)

function list_files(path) {
    var relpath = path.slice(root.length + 1)
    var files = fs.readdirSync(path)
    for (var i = 0; i < files.length; ++i) {
        var file = files[i]
        var stats = fs.statSync(path + '/' + file)
        if (stats.isFile() == true) {
            if (relpath == '')
                continue
            else
                url = subdir + '/' + relpath + '/' + file
            var match = url.match(/\//g)
            if (match == null)
                var prefix = ''
            else {
                var prefix = Array(match.length).join('\u00A0')
            }
            str += "program_menu('"
            str += prefix + file + "','"
            str += encodeURI(url)
            str += "')\n"
        } else if (stats.isDirectory() == true) {
            if (relpath == '')
                url = subdir + '/' + file
            else
                url = subdir + '/' + relpath + '/' + file
            var match = url.match(/\//g)
            if (match == null)
                var prefix = ''
            else {
                var prefix = Array(match.length).join('\u00A0')
            }
            str += "program_label('" + prefix + file.substring(2) + "')\n"
            list_files(path + '/' + file)
        } else
            console.log('unknown file type')
    }
}
