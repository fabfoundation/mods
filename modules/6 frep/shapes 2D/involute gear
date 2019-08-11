//
// frep involute gear
//    todo: fillets
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
var name = 'frep involute gear'
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
         // pitch radius
         //
         var rp = module*teeth/2 
         mod.info.innerHTML = `pitch radius: ${rp.toFixed(3)} mm<br>`
         //
         // base radius
         //
         var rb = rp*Math.cos(angle)
         mod.info.innerHTML += `base radius: ${rb.toFixed(3)} mm<br>`
         //
         // addendum height
         //
         var ha = addendum*module
         mod.info.innerHTML += `outer radius: ${(rp+ha).toFixed(3)} mm<br>`
         //
         // dedendum height
         //
         var hd = dedendum*module
         mod.info.innerHTML += `root radius: ${(rp-hd).toFixed(3)} mm<br>`
         //
         // involute angle
         //
         var ai = Math.tan(angle)-angle 
         //
         // pitch angle
         //
         var ap = 2*Math.PI/teeth
         //
         // shapes
         //
         // must be inside tip
         //
         var fn = `${rp}+${ha}-Math.sqrt(X*X+Y*Y)`
         //
         // angle must be above bottom involute
         //
         var fn = `Math.min(${fn},(Math.PI+Math.atan2(Y,X))%${ap}-(Math.sqrt(Math.pow(Math.max(${rb},Math.sqrt(X*X+Y*Y))/${rb},2)-1)-Math.acos(${rb}/Math.max(${rb},Math.sqrt(X*X+Y*Y)))))`
         //
         // angle must be below top involute
         //
         var fn = `Math.min(${fn},-(Math.sqrt(Math.pow(Math.max(${rb},Math.sqrt(X*X+Y*Y))/${rb},2)-1)-Math.acos(${rb}/Math.max(${rb},Math.sqrt(X*X+Y*Y))))-(-${ap/2+2*ai}+(Math.PI+Math.atan2(Y,X))%${ap}))`
         //
         // root circle
         //
         var fn = `Math.max(${fn},${rp-hd}-Math.sqrt(X*X+Y*Y))`
         //
         // output
         //
         var variables = ['X','Y']
         var limits = [[-rp-ha,+rp+ha],[-rp-ha,+rp+ha]]
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
         var rp = module*teeth/2 
         var rb = rp*Math.cos(angle)
         var ha = addendum*module
         var hd = dedendum*module
         var ai = Math.tan(angle)-angle 
         var ap = 2*Math.PI/teeth
         var vars = {module:module,angle:angle,teeth:teeth,rp:rp,rb:rb,ha:ha,hd:hd,ai:ai,ap:ap}
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
