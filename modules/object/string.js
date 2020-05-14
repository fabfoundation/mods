//
// object string
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
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'object string'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   object:{type:'Object',
      event:function(evt){
         outputs.object.event(evt.detail)
         outputs.string.event(JSON.stringify(evt.detail))
         }},
   string:{type:'JSON',
      event:function(evt){
         outputs.object.event(JSON.parse(evt.detail))
         outputs.string.event(evt.detail)
         }}}
//
// outputs
//
var outputs = {
   object:{type:'Object',
      event:function(obj){
         mods.output(mod,'object',obj)
         }},
   string:{type:'JSON',
      event:function(str){
         mods.output(mod,'string',str)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   }
//
// local functions
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
