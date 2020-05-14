//
// download object
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
var name = 'download object'
//
// initialization
//
var init = function() {
   mod.file.value = 'filename'
   }
//
// inputs
//
var inputs = {
   input:{type:'',
      event:function(evt){
         mod.file.value = evt.detail.name
         download(evt.detail)
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
   div.appendChild(document.createTextNode('file name: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.file = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('format: '))
   div.appendChild(document.createTextNode('JSON'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'format'
      input.id = mod.div.id+'JSON'
      input.checked = true
      div.appendChild(input)
      mod.JSON = input
   }
//
// local functions
//
function download(obj) {
   var a = document.createElement('a')
   a.setAttribute('href','data:text/plain;charset=utf-8,'+ 
      encodeURIComponent(JSON.stringify(obj)))
   a.setAttribute('download',mod.file.value)
   a.style.display = 'none'
   document.body.appendChild(a)
   a.click()
   document.body.removeChild(a)
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
