//
// move module
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
var name = 'move module'
//
// initialization
//
var init = function() {
   mod.step = 10
   }
//
// inputs
//
var inputs = {
   move:{type:'string',
      event:function(evt){
         var id = mods.module_id(mod.div)
         switch (evt.detail) {
            case 'up':
               mods.module_move(id,0,-mod.step)
               break
            case 'down':
               mods.module_move(id,0,mod.step)
               break
            case 'left':
               mods.module_move(id,-mod.step,0)
               break
            case 'right':
               mods.module_move(id,mod.step,0)
               break
            }
         }}}
//
// outputs
//
var outputs = {
   move:{type:'string',
      event:function(arg){
         mods.output(mod,'move',arg)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('up'))
      btn.addEventListener('click',function(){
         outputs.move.event('up')
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('left'))
      btn.addEventListener('click',function(){
         outputs.move.event('left')
         })
      div.appendChild(btn)
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('right'))
      btn.addEventListener('click',function(){
         outputs.move.event('right')
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('down'))
      btn.addEventListener('click',function(){
         outputs.move.event('down')
         })
      div.appendChild(btn)
   }
//
// local functions
//
;
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
