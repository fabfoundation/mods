//
// delete module
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
var name = 'delete module'
//
// initialization
//
var init = function() {
   mod.step = 10
   }
//
// inputs
//
var inputs = {
   }
//
// outputs
//
var outputs = {
   link:{type:'',
      event:function(arg){
         mods.output(mod,'move',arg)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('delete'))
      btn.addEventListener('click',function(){
         var outs = document.getElementById(
            JSON.stringify({id:mod.div.parentNode.id,type:'outputs'}))
         var links = JSON.parse(outs.childNodes[1].dataset.links)
         var link = JSON.parse(links[0])
         var dest = JSON.parse(link.dest)
         mods.module_delete(dest.id)
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
