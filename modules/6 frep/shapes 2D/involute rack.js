//
// frep involute rack
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
var name = 'frep involute rack'
//
// initialization
//
var init = function() {
   mod.module.value = '1'
   mod.angle.value = '20'
   mod.teeth.value = '10'
   mod.addendum.value = '1'
   mod.dedendum.value = '1.1'
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
         var module = parseFloat(mod.module.value)
         var angle = Math.PI*parseFloat(mod.angle.value)/180
         var teeth = parseFloat(mod.teeth.value)
         var addendum = parseFloat(mod.addendum.value)
         var dedendum = parseFloat(mod.dedendum.value)
         //
         // pitch
         //
         var p = Math.PI*module
         mod.info.innerHTML = `pitch: ${p.toFixed(3)} mm<br>`
         //
         // length
         //
         var l = p*teeth
         mod.info.innerHTML += `length: ${l.toFixed(3)} mm<br>`
         //
         // addendum height
         //
         var ha = addendum*module
         //
         // dedendum height
         //
         var hd = dedendum*module
         mod.info.innerHTML += `pitch height: ${hd.toFixed(3)} mm<br>`
         //
         // triangle base
         //
         var bt = (ha+hd)*Math.tan(angle)
         //
         // pitch base
         //
         var bp = ha*Math.tan(angle)
         //
         // slope
         //
         var s = 1/Math.tan(angle)
         //
         // shapes
         //
         // left
         //
         var fn = `${s}*X-Y`
         //
         // right
         //
         var fn = `Math.min(${fn},${s}*(${p/2+2*(bt-bp)}-X)-Y)`
         //
         // top
         //
         var fn = `Math.min(${fn},${ha+hd}-Y)`
         //
         // bottom
         //
         var fn = `Math.min(${fn},Y)`
         //
         // repeat
         //
         fn = fn.replace(/X/g,`(X%${p})`)
         //
         // bound
         //
         var fn = `Math.min(${fn},X)`
         var fn = `Math.min(${fn},${l}-X)`
         //
         // output
         //
         var variables = ['X','Y']
         var limits = [[0,l],[0,ha+hd]]
         var type = 'Magnitude'
         var shape = {function:fn,variables:variables,limits:limits,type:type}
         mods.output(mod,'shape',shape)}},
   variables:{type:'',
      event:function(){
         var module = parseFloat(mod.module.value)
         var angle = Math.PI*parseFloat(mod.angle.value)/180
         var teeth = parseFloat(mod.teeth.value)
         var addendum = parseFloat(mod.addendum.value)
         var dedendum = parseFloat(mod.dedendum.value)
         var p = Math.PI*module
         var l = p*teeth
         var ha = addendum*module
         var hd = dedendum*module
         var bt = (ha+hd)*Math.tan(angle)
         var bp = ha*Math.tan(angle)
         var s = 1/Math.tan(angle)
         var vars = {module:module,angle:angle,teeth:teeth,p:p,l:l,ha:ha,hd:hd,bt:bt,bp:bp,s:s}
         mods.output(mod,'variables',vars)}
         }}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // module
   //
   div.appendChild(document.createTextNode('module (m): '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.module = input
   div.appendChild(document.createTextNode(' (mm)'))
   div.appendChild(document.createElement('br'))
   //
   // addendum
   //
   div.appendChild(document.createTextNode('addendum: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.addendum = input
   div.appendChild(document.createTextNode(' (m)'))
   div.appendChild(document.createElement('br'))
   //
   // dedendum 
   //
   div.appendChild(document.createTextNode('dedendum: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.dedendum = input
   div.appendChild(document.createTextNode(' (m)'))
   div.appendChild(document.createElement('br'))
   //
   // angle
   //
   div.appendChild(document.createTextNode('pressure angle: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.angle = input
   div.appendChild(document.createElement('br'))
   //
   // teeth 
   //
   div.appendChild(document.createTextNode('number of teeth: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 3
      div.appendChild(input)
      mod.teeth = input
   div.appendChild(document.createElement('br'))
   //
   // info
   //
   var info = document.createElement('span')
      div.appendChild(info)
      mod.info = info
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
