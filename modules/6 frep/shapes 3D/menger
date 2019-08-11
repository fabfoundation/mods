//
// Menger sponge
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
var name = 'Menger sponge'
//
// initialization
//
var init = function() {
   mod.size.value = '1'
   mod.depth.value = '4'
   }
//
// inputs
//
var inputs = {
   variables:{type:'',
      event:function(evt){
         for (var p in evt.detail)
            mod[p].value = evt.detail[p]
         outputs.variables.event()
         outputs.shape.event()
         }}}
//
// outputs
//
var outputs = {
   shape:{type:'',
      event:function(){
         var size = parseFloat(mod.size.value)
         var depth = parseFloat(mod.depth.value)
         var fn = `Math.min(X-0,${size}-X)`
         var fn = `Math.min(${fn},Math.min(Y-0,${size}-Y))`
         var fn = `Math.min(${fn},Math.min(Z-0,${size}-Z))`
         for (var d = 0; d < depth; ++d) {
            var fn = `Math.min(${fn},-Math.min(Math.min((Math.pow(3,${d})*X/${size})%1-1/3,2/3-(Math.pow(3,${d})*X/${size})%1),Math.min((Math.pow(3,${d})*Y/${size})%1-1/3,2/3-(Math.pow(3,${d})*Y/${size})%1)))`
            var fn = `Math.min(${fn},-Math.min(Math.min((Math.pow(3,${d})*X/${size})%1-1/3,2/3-(Math.pow(3,${d})*X/${size})%1),Math.min((Math.pow(3,${d})*Z/${size})%1-1/3,2/3-(Math.pow(3,${d})*Z/${size})%1)))`
            var fn = `Math.min(${fn},-Math.min(Math.min((Math.pow(3,${d})*Y/${size})%1-1/3,2/3-(Math.pow(3,${d})*Y/${size})%1),Math.min((Math.pow(3,${d})*Z/${size})%1-1/3,2/3-(Math.pow(3,${d})*Z/${size})%1)))`
            }
         var variables = ['X','Y','Z']
         var limits = [[0,size],[0,size],[0,size]]
         var type = 'Magnitude'
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}
         },
   variables:{type:'',
      event:function(){
         var size = parseFloat(mod.size.value)
         var depth = parseFloat(mod.depth.value)
         var vars = {size:size,depth:depth}
         mods.output(mod,'variables',vars)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // size
   //
   div.appendChild(document.createTextNode('size: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.size= input
   div.appendChild(document.createElement('br'))
   //
   // depth
   //
   div.appendChild(document.createTextNode('depth: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.depth= input
   div.appendChild(document.createElement('br'))
   //
   // output button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('output'))
      btn.addEventListener('click',function(){
         outputs.variables.event()
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
