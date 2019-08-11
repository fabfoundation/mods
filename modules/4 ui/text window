//
// UI text window
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
var name = 'UI text window'
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
   text1:{type:"String",
      label:"text 1",
      event:function(evt){
         mod.text1.value = evt.detail
         outputs.text1.event()}},
   text2:{type:"String",
      label:"text 2",
      event:function(evt){
         mod.text2.value = evt.detail
         outputs.text2.event()}}}
//
// outputs
//
var outputs = {
   text1:{type:"event",
      label:"text 1",
      event:function(){
         mods.output(mod,"text1",mod.text1.value)}},
   text2:{type:"event",
      label:"text 2",
      event:function(){
         mods.output(mod,"text2",mod.text2.value)}}}
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
   // text 1
   //
   win.document.body.appendChild(document.createTextNode('text 1: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('input',function(){
         outputs.text1.event()
         })
      win.document.body.appendChild(input)
      mod.text1 = input
   win.document.body.appendChild(document.createTextNode(' (change)'))
   win.document.body.appendChild(document.createElement('br'))
   //
   // text 2
   //
   win.document.body.appendChild(document.createTextNode('text 2: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(){
         outputs.text2.event()
         })
      win.document.body.appendChild(input)
      mod.text2 = input
   win.document.body.appendChild(document.createTextNode(' (enter)'))
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
