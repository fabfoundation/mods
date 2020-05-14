//
// construct object
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
var name = 'construct object'
//
// initialization
//
var init = function() {
   mod.in0.value = '{"x":0,"y":1}'
   mod.in1.value = '{}'
   mod.out0.value = '{f:in0.x+in0.y,g:2*in0.x-3*in0.y}'
   mod.out1.value = '{}'
   }
//
// inputs
//
var inputs = {
   in0:{type:'',label:'input 0',
      event:function(evt) {
         mod.in0.value = JSON.stringify(evt.detail)
         construct_output()
         }},
   in1:{type:'',label:'input 1',
      event:function(evt) {
         mod.in1.value = JSON.stringify(evt.detail)
         construct_output()
         }}}
//
// outputs
//
var outputs = {
   out0:{type:'',label:'output 0',
      event:function(arg){
         mods.output(mod,'out0',arg)
         }},
   out1:{type:'',label:'output 1',
      event:function(arg){
         mods.output(mod,'out1',arg)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // inputs
   //
   div.appendChild(document.createTextNode('input 0:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',1)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.in0 = text
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('input 1:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',1)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.in1 = text
   div.appendChild(document.createElement('br'))
   //
   // outputs
   //
   div.appendChild(document.createTextNode('output 0:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',1)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.out0 = text
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('output 1:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',1)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.out1 = text
   div.appendChild(document.createElement('br'))
   //
   // output button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('output'))
      btn.addEventListener('click',function(){
         construct_output()
         })
      div.appendChild(btn)
   }
//
// local functions
//
function construct_output() {
   var in0 = JSON.parse(mod.in0.value)
   var in1 = JSON.parse(mod.in1.value)
   eval('out0 ='+mod.out0.value)
   eval('out1 ='+mod.out1.value)
   outputs.out0.event(out0)
   outputs.out1.event(out1)
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
