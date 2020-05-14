//
// color
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
var name = 'color'
//
// initialization
//
var init = function() {
   mod.red.value = 255
   mod.green.value = 255
   mod.blue.value = 255
   }
//
// inputs
//
var inputs = {
   RGB:{type:'array',
      event:function(evt){
         mod.red.value = evt.detail[0]
         mod.green.value = evt.detail[1]
         mod.blue.value = evt.detail[2]
         show_color()
         }}}
//
// outputs
//
var outputs = {
   RGB:{type:'array',
      event:function(){
         var red = parseInt(mod.red.value)
         var green = parseInt(mod.green.value)
         var blue = parseInt(mod.blue.value)
         mods.output(mod,'RGB',[red,green,blue])}}}
//
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // drawing canvas
   //
   var canvas = document.createElement('canvas')
      canvas.width = mods.ui.canvas
      canvas.height = mods.ui.canvas
      canvas.style.backgroundColor = 'rgb(255,255,255)'
      div.appendChild(canvas)
      mod.canvas = canvas
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('red: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         show_color()
         })
      div.appendChild(input)
      mod.red = input
   div.appendChild(document.createTextNode(' green: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         show_color()
         })
      div.appendChild(input)
      mod.green = input
   div.appendChild(document.createTextNode(' blue: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      input.addEventListener('input',function(evt){
         show_color()
         })
      div.appendChild(input)
      mod.blue = input
   }
//
// local functions
//
function show_color() {
   var red = parseInt(mod.red.value)
   var green = parseInt(mod.green.value)
   var blue = parseInt(mod.blue.value)
   var ctx = mod.canvas.getContext("2d")
   ctx.fillStyle = `rgb(${red},${green},${blue})`
   ctx.fillRect(0,0,mod.canvas.width,mod.canvas.height)
   outputs.RGB.event()
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
