//
// save file
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// closure
//
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'save file'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   file:{type:'object',
      event:function(evt){
         mod.name = evt.detail.name
         mod.contents = evt.detail.contents
         save_file()
         }}}
//
// outputs
//
var outputs = {}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // info
   //
   var text = document.createTextNode('name:')
      div.appendChild(text)
      mod.nametext = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('size:')
      div.appendChild(text)
      mod.sizetext = text
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
function save_file() {
   var a = document.createElement('a')
   a.setAttribute('href','data:text/plain;charset=utf-8,'+ 
      encodeURIComponent(mod.contents))
   a.setAttribute('download',mod.name)
   a.style.display = 'none'
   document.body.appendChild(a)
   a.click()
   document.body.removeChild(a)
   mod.nametext.nodeValue = 'name: '+mod.name
   mods.fit(mod.div)
   mod.sizetext.nodeValue = 'size: '+mod.contents.length
   mods.fit(mod.div)
   }
//
// return values
//
return ({
   mod:mod,
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())
