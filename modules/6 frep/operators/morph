//
// frep morph
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
var name = 'frep morph'
//
// initialization
//
var init = function() {
   mod.shape0 = null
   mod.shape1 = null
   mod.fn0.value = ''
   mod.fn1.value = ''
   mod.weight.value = 0.5
   }
//
// inputs
//
var inputs = {
   shape0:{type:'',label:'shape 0',
      event:function(evt){
         mod.shape0 = evt.detail
         mod.fn0.value = evt.detail.function
         outputs.shape.event()
         }},
   shape1:{type:'',label:'shape 1',
      event:function(evt){
         mod.shape1 = evt.detail
         mod.fn1.value = evt.detail.function
         outputs.shape.event()
         }},
   clear:{type:'',
      event:function(evt){
         mod.shape0 = null
         mod.shape1 = null
         mod.fn0.value = ''
         mod.fn1.value = ''
         }}}
//
// outputs
//
var outputs = {
   shape:{type:'',
      event:function(){
         if ((mod.shape0 != null) && (mod.shape1 != null)) {
            var weight = parseFloat(mod.weight.value)
            var fn = `(${weight}*${mod.shape0.function}+(1-${weight})*${mod.shape1.function})`
            var variables = mod.shape0.variables
            var type = mod.shape0.type        
            var limits = []
            for (var v = 0; v < mod.shape0.limits.length; ++v) {
               limits[v] = []
               if (mod.shape0.limits[v][0] < mod.shape1.limits[v][0])
                  limits[v][0] = mod.shape0.limits[v][0]
               else
                  limits[v][0] = mod.shape1.limits[v][0]
               if (mod.shape0.limits[v][1] > mod.shape1.limits[v][1])
                  limits[v][1] = mod.shape0.limits[v][1]
               else
                  limits[v][1] = mod.shape1.limits[v][1]
               }
            var shape = {function:fn,variables:variables,limits:limits,type:type}
            mods.output(mod,'shape',shape)}
            }
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // function 0
   //
   div.appendChild(document.createTextNode('function 0: '))
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.fn0 = input
   div.appendChild(document.createElement('br'))
   //
   // function 1
   //
   div.appendChild(document.createTextNode('function 1: '))
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.fn1 = input
   div.appendChild(document.createElement('br'))
   //
   // weight
   //
   div.appendChild(document.createTextNode('weight: '))
   div.appendChild(document.createElement('br'))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.weight = input
   div.appendChild(document.createElement('br'))
   //
   // output button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('output'))
      btn.addEventListener('click',function(){
         outputs.shape.event()
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
