//
// create module
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
var name = 'create module'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   input:{type:'object',
      event:function(evt){
         }
      }
   }
//
// outputs
//
var outputs = {
   output:{type:'object',
      event:function(){
         }
      }
   }
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // create
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('create module'))
      btn.addEventListener('click',function(){
         var id = mods.module_id(mod.div)
         var top = mods.module_top(id)
         var width = mods.module_width(id)
         var left = mods.module_left(id)+width
         var newnode = mods.module_create(`
//
// created module
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
var name = 'created module'
//
// initialization
//
var init = function() {
   var id = mods.module_id(mod.div)
   mods.module_position(id,${left},${top})
   }
//
// inputs
//
var inputs = {
   input:{type:'object',
      event:function(evt){
         }
      }
   }
//
// outputs
//
var outputs = {
   output:{type:'object',
      event:function(){
         }
      }
   }
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('hello world'))
   }
//
// local functions
//

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
            `)
         var out = mods.module_outputs(id,1)
         var inputs = mods.module_inputs(newnode.id,1)
         var srcout = document.getElementById(
            JSON.stringify({id:mod.div.parentNode.id,type:'outputs'}))
         var dstin = document.getElementById(
            JSON.stringify({id:newnode.id,type:'inputs'}))
         mods.add_link(srcout.childNodes[1],dstin.childNodes[1])
         })
      div.appendChild(btn)
   }
//
// local functions
//

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
