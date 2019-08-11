//
// Roland SRM-20 milling machine
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
/*
G-codes:
G00X10.0
G90 (absolute positioning)
G21 (mm units)
#.0 numbers
G00 (positioning rapid move)
G01 (linear motion)
M03 (start spindle)
M05 (stop spindle)
F (feed rate mm/min, 6-1800)
203.2 (X) x 152.4 (Y) x 60.5 (Z) mm         
*/
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'Roland SRM-20 milling machine'
//
// initialization
//
var init = function() {
   mod.units = 100.0
   mod.speed.value = 4
   mod.ox.value = 10
   mod.oy.value = 10
   mod.oz.value = 10
   mod.jz.value = 2
   mod.hx.value = 0
   mod.hy.value = 152.4
   mod.hz.value = 60.5
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
      event:function(obj){
         mods.output(mod,'file',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // speed
   //
   div.appendChild(document.createTextNode('speed: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.speed = input
   div.appendChild(document.createTextNode(' (mm/s)'))
   div.appendChild(document.createElement('br'))
   //
   // origin
   //
   div.appendChild(document.createTextNode('origin:'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ox = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode(' y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.oy = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.oz = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('move to origin')
            span.appendChild(text)
         btn.appendChild(span)
      btn.addEventListener('click',function(){
         var x0 = mod.units*parseFloat(mod.ox.value);
         var y0 = mod.units*parseFloat(mod.oy.value);
         var z0 = mod.units*parseFloat(mod.oz.value);
         var zjog = z0+mod.units*parseFloat(mod.jz.value);
         //
         // G-code version
         //
         /*
         str = '%\n' // data start
         str += 'G90\n' // absolute units
         str += 'G21\n' // mm units
         str += 'G00Z30.0\n' // move z
         str += 'M02\n' // end of program
         */
         //
         // RML version
         //
         var str = "PA;PA;VS10;!VZ10;!PZ0,"+zjog+";PU"+x0+","+y0+";Z"+x0+","+y0+","+z0+";!MC0;"+"\u0004"
         //
         // send command
         //
         var obj = {}
         obj.type = 'command'
         obj.name = mod.name+'.rml'
         obj.contents = str
         outputs.file.event(obj)
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   //
   // jog
   //
   div.appendChild(document.createTextNode('jog height:'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.jz = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   //
   // home
   //
   div.appendChild(document.createTextNode('home:'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.hx = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode(' y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.hy = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('z: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.hz = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('move to home')
            span.appendChild(text)
         btn.appendChild(span)
      btn.addEventListener('click',function(){
         var xhome = mod.units*parseFloat(mod.hx.value);
         var yhome = mod.units*parseFloat(mod.hy.value);
         var zhome = mod.units*parseFloat(mod.hz.value);
         //
         // G-code version
         //
         /*
         str = '%\n' // data start
         str += 'G90\n' // absolute units
         str += 'G21\n' // mm units
         str += 'G00Z50.0\n' // move z
         str += 'M02\n' // end of program
         */
         //
         // RML version
         //
         var str = "PA;PA;!PZ0,"+zhome+";PU"+xhome+","+yhome+";!MC0;"+"\u0004"
         //
         // send command
         //
         var obj = {}
         obj.type = 'command'
         obj.name = mod.name+'.rml'
         obj.contents = str
         outputs.file.event(obj)
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
function make_path() {
   var dx = 25.4*mod.width/mod.dpi
   var nx = mod.width
   var speed = parseFloat(mod.speed.value)
   var jog = parseFloat(mod.oz.value)+parseFloat(mod.jz.value)
   var ijog = Math.floor(mod.units*jog)
   var scale = mod.units*dx/(nx-1)
   var x0 = parseFloat(mod.ox.value)
   var y0 = parseFloat(mod.oy.value)
   var z0 = parseFloat(mod.oz.value)
   var xoffset = mod.units*x0
   var yoffset = mod.units*y0
   var zoffset = mod.units*z0
   var str = "PA;PA;" // plot absolute
   str += "VS"+speed+";!VZ"+speed+";"
   str += "!PZ"+0+","+ijog+";" // set jog
   str += "!MC1;\n" // turn motor on
   //
   // follow segments
   //
   for (var seg = 0; seg < mod.path.length; ++seg) {
      //
      // move up to starting point
      //
      x = xoffset+scale*mod.path[seg][0][0]
      y = yoffset+scale*mod.path[seg][0][1]
      str += "PU"+x.toFixed(0)+","+y.toFixed(0)+";\n"
      //
      // move down
      //
      z = zoffset+scale*mod.path[seg][0][2]
      str += "Z"+x.toFixed(0)+","+y.toFixed(0)+","+z.toFixed(0)+";\n"
      for (var pt = 1; pt < mod.path[seg].length; ++pt) {
         //
         // move to next point
         //
         x = xoffset+scale*mod.path[seg][pt][0]
         y = yoffset+scale*mod.path[seg][pt][1]
         z = zoffset+scale*mod.path[seg][pt][2]
         str += "Z"+x.toFixed(0)+","+y.toFixed(0)+","+z.toFixed(0)+";\n"
         }
      //
      // move up
      //
      str += "PU"+x.toFixed(0)+","+y.toFixed(0)+";\n"
      }
   //
   // turn off motor and move back
   //
   var xhome = mod.units*parseFloat(mod.hx.value)
   var yhome = mod.units*parseFloat(mod.hy.value)
   var zhome = mod.units*parseFloat(mod.hz.value)
   str += "PA;PA;!PZ0,"+zhome+";PU"+xhome+","+yhome+";!MC0;"
   //
   // output string
   //
   var obj = {}
   obj.type = 'file'
   obj.name = mod.name+'.rml'
   obj.contents = str
   outputs.file.event(obj)
   }
//
// return values
//
return ({
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())
