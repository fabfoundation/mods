//
// globals library
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
var name = 'globals library'
//
// initialization
//
var init = function() {
   list_library()
   }
//
// inputs
//
var inputs = {
   store:{type:'object',
      event:function(evt) {
         store_object(evt.detail)
         }},
   request:{type:'key',
      event:function(evt) {
         list_library()
         outputs.response.event(mods.globals[evt.detail])
         }}}
//
// outputs
//
var outputs = {
   response:{type:'property',
      event:function(prop){
         mods.output(mod,'response',prop)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('objects (length):'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',mods.ui.rows)
      text.setAttribute('cols',mods.ui.cols)
      text.addEventListener('input',function(evt) {
         format_string()
         })
      div.appendChild(text)
      mod.objects = text
   }
//
// local functions
//
function store_object(obj) {
   for (key in obj) {
      mods.globals[key] = obj[key]
      }
   list_library()
   }
function list_library() {
   var str = ''
   for (key in mods.globals) {
      str += key+' ('+mods.globals[key].length+')\n'
      }
   mod.objects.value = str
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
