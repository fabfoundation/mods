//
// set object
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
var name = 'set object'
//
// initialization
//
var init = function() {
   //
   add_output('first setting')
   add_variable('variable one','var00')
   mod.var00.value = 'value 00'
   add_variable('variable two','var01')
   mod.var01.value = 'value 01'
   //
   add_output('second setting')
   add_variable('variable one','var10')
   mod.var10.value = 'value 10'
   add_variable('variable two','var11')
   mod.var11.value = 'value 11'
   //
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
