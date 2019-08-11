//
// ShopBot
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
var name = 'ShopBot'
//
// initialization
//
var init = function() {
   mod.cutspeed.value = 20
   mod.plungespeed.value = 20
   mod.jogspeed.value = 75
   mod.jogheight.value = 5
   mod.spindlespeed.value = 10000
   mod.unitsin.checked = true   
   }
//
// inputs
//
var inputs = {
   path:{type:'',
      event:function(evt){
         mod.name = evt.detail.name
         mod.path = evt.detail.path
         mod.dpi = evt.detail.dpi
         mod.width = evt.detail.width
         mod.height = evt.detail.height
         make_path()
         }}}
//
// outputs
//
var outputs = {
   file:{type:'',
      event:function(str){
         obj = {}
         obj.name = mod.name+".sbp"
         obj.contents = str
         mods.output(mod,'file',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // cut speed
   //
   div.appendChild(document.createTextNode('cut speed: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.cutspeed = input
   div.appendChild(document.createTextNode(' (mm/s)'))
   div.appendChild(document.createElement('br'))
   //
   // plunge speed
   //
   div.appendChild(document.createTextNode('plunge speed: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.plungespeed = input
   div.appendChild(document.createTextNode(' (mm/s)'))
   div.appendChild(document.createElement('br'))
   //
   // jog speed
   //
   div.appendChild(document.createTextNode('jog speed: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.jogspeed = input
   div.appendChild(document.createTextNode(' (mm/s)'))
   div.appendChild(document.createElement('br'))
   //
   // jog height
   //
   div.appendChild(document.createTextNode('jog height: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.jogheight = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   //
   // spindle speed
   //
   div.appendChild(document.createTextNode('spindle speed: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.spindlespeed = input
   div.appendChild(document.createTextNode(' (RPM)'))
   div.appendChild(document.createElement('br'))
   //
   // file units
   //
   div.appendChild(document.createTextNode('file units:'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'units'
      input.id = mod.div.id+'unitsin'
      div.appendChild(input)
      mod.unitsin = input
   div.appendChild(document.createTextNode('in'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'units'
      input.id = mod.div.id+'unitsmm'
      div.appendChild(input)
      mod.unitsmm = input
   div.appendChild(document.createTextNode('mm'))
   }
//
// local functions
//
function make_path() {
   if (mod.unitsin.checked)
      var units = 1
   else
      var units = 25.4
   var dx = units*mod.width/mod.dpi
   var nx = mod.width
   var cut_speed = units*parseFloat(mod.cutspeed.value)/25.4
   var plunge_speed = units*parseFloat(mod.plungespeed.value)/25.4
   var jog_speed = units*parseFloat(mod.jogspeed.value)/25.4
   var jog_height = units*parseFloat(mod.jogheight.value)/25.4
   var spindle_speed = parseFloat(mod.spindlespeed.value)
   var scale = dx/(nx-1)
   str = "SA\r\n" // set to absolute distances
   str += "TR,"+spindle_speed+",1\r\n" // set spindle speed
   str += "SO,1,1\r\n" // set output number 1 to on
   str += "pause 2\r\n" // let spindle come up to speed
   str += "MS,"+cut_speed.toFixed(4)+","+plunge_speed.toFixed(4)+"\r\n" // set xy,z speed
   str += "JS,"+jog_speed.toFixed(4)+","+jog_speed.toFixed(4)+"\r\n" // set jog xy,z speed
   str += "JZ,"+jog_height.toFixed(4)+"\r\n" // move up
   //
   // follow segments
   //
   for (var seg = 0; seg < mod.path.length; ++seg) {
      //
      // move up to starting point
      //
      x = scale*mod.path[seg][0][0]
      y = scale*mod.path[seg][0][1]
      str += "MZ,"+jog_height.toFixed(4)+"\r\n"
      str += "J2,"+x.toFixed(4)+","+y.toFixed(4)+"\r\n"
      //
      // move down
      //
      z = scale*mod.path[seg][0][2]
      str += "MZ,"+z.toFixed(4)+"\r\n"
      for (var pt = 1; pt < mod.path[seg].length; ++pt) {
         //
         // move to next point
         //
         x = scale*mod.path[seg][pt][0]
         y = scale*mod.path[seg][pt][1]
         z = scale*mod.path[seg][pt][2]
         str += "M3,"+x.toFixed(4)+","+y.toFixed(4)+","+z.toFixed(4)+"\r\n"
         }
      }
   //
   // output file
   //
   str += "MZ,"+jog_height.toFixed(4)+"\r\n"
   outputs.file.event(str)
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

