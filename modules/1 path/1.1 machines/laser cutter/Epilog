//
// Epilog laser cutter
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
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
var name = 'Epilog laser cutter'
//
// initialization
//
var init = function() {
   mod.power.value = 25
   mod.speed.value = 75
   mod.rate.value = 100
   mod.xpos.value = 10
   mod.ypos.value = 10
   mod.topleft.checked = true
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
         }},
   settings:{type:'',
      event:function(evt){
         set_values(evt.detail)
         }}}
//
// outputs
//
var outputs = {
   file:{type:'',
      event:function(str){
         obj = {}
         obj.type = 'file'
         obj.name = mod.name+'.epi'
         obj.contents = str
         mods.output(mod,'file',obj)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('auto focus: '))
   var input = document.createElement('input')
      input.type = 'checkbox'
      input.id = mod.div.id+'sort'
      div.appendChild(input)
      mod.focus = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('power (%): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.power = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('speed (%): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.speed = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('rate (pps): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.rate = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('position (mm):'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('x: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.xpos = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('y: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.ypos = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('alignment:'))
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'origin'
      input.id = mod.div.id+'topleft'
      div.appendChild(input)
      mod.topleft = input
   div.appendChild(document.createTextNode(' left \u00A0\u00A0 top \u00A0\u00A0 right '))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'origin'
      input.id = mod.div.id+'topright'
      div.appendChild(input)
      mod.topright = input
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'origin'
      input.id = mod.div.id+'botleft'
      div.appendChild(input)
      mod.botleft = input
   div.appendChild(document.createTextNode(' left bottom right '))
   var input = document.createElement('input')
      input.type = 'radio'
      input.name = mod.div.id+'origin'
      input.id = mod.div.id+'botright'
      div.appendChild(input)
      mod.botright = input
   }
//
// local functions
//
// set_values
//
function set_values(settings) {
   for (var s in settings) {
      switch(s) {
         case 'power (%)':
            mod.power.value = settings[s]
            break
         case 'speed (%)':
            mod.speed.value = settings[s]
            break
         case 'rate (pps)':
            mod.rate.value = settings[s]
            break
         }
      }
   }
//
// make_path
//
function make_path() {
   var dx = mod.width/mod.dpi
   var dy = mod.height/mod.dpi
   var nx = mod.width
   var ny = mod.height
   var scale = 600.0*dx/(nx-1) // 600 DPI
   var power = parseFloat(mod.power.value)
   var speed = parseFloat(mod.speed.value)
   var rate = parseFloat(mod.rate.value)
   var ox = parseFloat(mod.xpos.value)/25.4
   var oy = parseFloat(mod.ypos.value)/25.4
   if (mod.botleft.checked) {
      var xoffset = 600.0*ox
      var yoffset = 600.0*(oy-dy)
      }
   else if (mod.botright.checked) {
      var xoffset = 600.0*(ox-dx)
      var yoffset = 600.0*(oy-dy)
      }
   else if (mod.topleft.checked) {
      var xoffset = 600.0*ox
      var yoffset = 600.0*oy
      }
   else if (mod.topright.checked) {
      var xoffset = 600.0*(ox-dx)
      var yoffset = 600.0*oy
      }
   var str = "%-12345X@PJL JOB NAME=" + mod.name + "\r\n"
   str += "E@PJL ENTER LANGUAGE=PCL\r\n"
   if (mod.focus.checked)
      //
      // init with autofocus on
      //
      str += "&y1A"
   else
      // 
      // init with autofocus off
      //
      str += "&y0A"
   str += "&l0U&l0Z&u600D*p0X*p0Y*t600R*r0F&y50P&z50S*r6600T*r5100S*r1A*rC%1BIN;"
   str += "XR"+rate+";YP"+power+";ZS"+speed+";\n"
   //
   // loop over segments
   //
   for (var seg = 0; seg < mod.path.length; ++seg) {
      //
      // loop over points
      //
      x = xoffset+scale*mod.path[seg][0][0]
      y = yoffset+scale*(ny-mod.path[seg][0][1])
      if (x < 0) x = 0
      if (y < 0) y = 0
      str += "PU"+x.toFixed(0)+","+y.toFixed(0)+";" // move up to start point
      for (var pt = 1; pt < mod.path[seg].length; ++pt) {
         x = xoffset+scale*mod.path[seg][pt][0]
         y = yoffset+scale*(ny-mod.path[seg][pt][1])
         if (x < 0) x = 0
         if (y < 0) y = 0
         str += "PD"+x.toFixed(0)+","+y.toFixed(0)+";" // move down
      }
      str += "\n"
   }
   str += "%0B%1BPUE%-12345X@PJL EOJ \r\n"
   //
   // end-of-file padding hack from Epilog print driver
   //
   for (var i = 0; i < 10000; ++i)
      str += " "
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
