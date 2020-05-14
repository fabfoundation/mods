//
// sequence event
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
var name = 'sequence event'
//
// initialization
//
var init = function() {
   mod.position.value = 0
   mod.sequence.value = '[[[255,0,0],[0,255,0]],[[0,0,255],[255,0,255]]]'
   mod.stop = false
   }
//
// inputs
//
var inputs = {
   start:{type:'',
      event:function(evt) {
         mod.position.value = 0
         step()
         }},
   step:{type:'',
      event:function(evt) {
         step()
         }}}
//
// outputs
//
var outputs = {
   event:{type:'',
      event:function(arg){
         mods.output(mod,'event',arg)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // position
   //
   div.appendChild(document.createTextNode('position:'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.position = input
   div.appendChild(document.createElement('br'))
   //
   // sequence
   //
   div.appendChild(document.createTextNode('sequence:'))
   div.appendChild(document.createElement('br'))
   var text = document.createElement('textarea')
      text.setAttribute('rows',1)
      text.setAttribute('cols',mods.ui.cols)
      div.appendChild(text)
      mod.sequence = text
   div.appendChild(document.createElement('br'))
   //
   // start
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('start'))
      btn.addEventListener('click',function(){
         mod.position.value = 0
         step()
         })
      div.appendChild(btn)
   //
   // stop
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('stop'))
      btn.addEventListener('click',function(){
         mod.stop = true
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   //
   // step
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('step'))
      btn.addEventListener('click',function(){
         step()
         })
      div.appendChild(btn)
   }
//
// local functions
//
function step() {
   if (mod.stop) {
      mod.stop = false
      return
      }
   var pos = parseInt(mod.position.value)
   var sequence = eval(mod.sequence.value)
   outputs.event.event(sequence[pos])
   pos += 1
   if (pos == sequence.length)
      pos = 0
   mod.position.value = pos
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
