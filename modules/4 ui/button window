//
// UI button window
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2015,6
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
var name = 'UI button window'
//
// initialization
//
var init = function() {
   openUI()
   }
//
// inputs
//
var inputs = {
   }
//
// outputs
//
var outputs = {
   button1:{type:"event",
      label:"button 1",
      event:function(){
         mods.output(mod,"button1","button 1")}},
   button2:{type:"event",
      label:"button 2",
      event:function(){
         mods.output(mod,"button2","button 2")}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // view UI
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view window'))
      btn.addEventListener('click',function(){
         openUI()
         })
      div.appendChild(btn)
   }
//
// local functions
//
function openUI() {
   var win = window.open('')
   //
   // close
   //
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('close window'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click',function(){
         win.close()
         })
      win.document.body.appendChild(btn)
   win.document.body.appendChild(document.createElement('br'))
   win.document.body.appendChild(document.createElement('br'))
   //
   // button 1
   //
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('button 1'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click',function(){
         outputs.button1.event()
         })
      win.document.body.appendChild(btn)
   win.document.body.appendChild(document.createTextNode(' '))
   //
   // button 2
   //
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('button 2'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click',function(){
         outputs.button2.event()
         })
      win.document.body.appendChild(btn)
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
