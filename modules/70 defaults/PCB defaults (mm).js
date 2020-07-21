//
// set object
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
// Modified by Francisco Sanchez Arroyo 31-Jan-2020
// Modified by Sol Bekic 21-Jul-2020
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
var name = 'set PCB defaults (mm)'
//
// initialization
//
var init = function() {
   //
   add_output('mill traces (1/64")')
   add_variable('tool diameter (mm)','var00')
   mod.var00.value = parseFloat('0.0156')*25.4
   add_variable('cut depth (mm)','var01')
   mod.var01.value = parseFloat('0.004')*25.4
   add_variable('max depth (mm)','var02')
   mod.var02.value = parseFloat('0.004')*25.4
   add_variable('offset number','var03')
   mod.var03.value = '4'
   add_variable('offset stepover','var04')
   mod.var04.value = '0.5'
   add_variable('speed (mm/s)','var05')
   mod.var05.value = '4'
   //
   add_output('mill outline (1/32)')
   add_variable('tool diameter (mm)','var10')
   mod.var10.value = parseFloat('0.0312')*25.4
   add_variable('cut depth (mm)','var11')
   mod.var11.value = parseFloat('0.024')*25.4
   add_variable('max depth (mm)','var12')
   mod.var12.value = parseFloat('0.072')*25.4
   add_variable('offset number','var13')
   mod.var13.value = '1'
   add_variable('speed (mm/s)','var15')
   mod.var15.value = '4'
   //
   add_output('mill traces (10 mil)')
   add_variable('tool diameter (mm)','var20')
   mod.var20.value = parseFloat('0.01')*25.4
   add_variable('cut depth (mm)','var21')
   mod.var21.value = parseFloat('0.004')*25.4
   add_variable('max depth (mm)','var22')
   mod.var22.value = parseFloat('0.004')*25.4
   add_variable('offset number','var23')
   mod.var23.value = '4'
   add_variable('offset stepover','var24')
   mod.var24.value = '0.5'
   add_variable('speed (mm/s)','var25')
   mod.var25.value = '2'
 

   }
//
// inputs
//
var inputs = {}
//
// outputs
//
var outputs = {
   settings:{type:'',
      event:function(vars){
         mods.output(mod,'settings',vars)
         }
      }
   }
//
// interface
//
var interface = function(div){
   mod.div = div
   }
//
// local functions
//
function add_output(label) {
   if (mod.settings == undefined) {
      mod.settings = {}
      }
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
      var text = document.createTextNode(label)
         span.appendChild(text)
      btn.appendChild(span)
      var f = function(label) {
         btn.addEventListener('click',function() {
            for (var s in mod.settings)
               mod.settings[s].span.style.fontWeight = 'normal'
            mod.settings[label].span.style.fontWeight = 'bold'
            var vars = {}
            for (var v in mod.settings[label].variables)
               vars[v] = mod.settings[label].variables[v].value
            outputs.settings.event(vars)
            })
         }(label)
      mod.settings[label] = {span:span,variables:{}}
      mod.div.appendChild(btn)
      mod.setting = label
   mod.div.appendChild(document.createElement('br'))
   }
function add_variable(label,variable) {
   var text = document.createTextNode(label)
      mod.div.appendChild(text)
   mod.div.appendChild(document.createTextNode(': '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      mod[variable] = input
      mod.div.appendChild(input)
   mod.settings[mod.setting].variables[label] = input 
   mod.div.appendChild(document.createElement('br'))
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
