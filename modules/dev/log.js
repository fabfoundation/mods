//
// event sniffer
//
// Neil Gershenfeld and Jake Read
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
(function() {
   // globals
   var mod = {}

   // name
   var name = 'event logger'

   var init = function(){
      mod.identifier.value = 'kx'
   }

   var inputs = {
      event: {
         type: 'any',
         event: function(evt) {
            console.log(mod.identifier.value, ': ', evt.detail)
         }
      }
   }

   var outputs = {
   }

   var interface = function(div){
      mod.div = div

      mod.identifier = make_text_input(div, 'identifier', 12)
   }

   return ({
      mod:mod,
      name:name,
      init:init,
      inputs:inputs,
      outputs:outputs,
      interface:interface
   })
}())
