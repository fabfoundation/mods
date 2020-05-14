//
// WebSocket module
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
var name = 'WebSocket'
//
// initialization
//
var init = function() {
   mod.address.value = '127.0.0.1'
   mod.port.value = 1234
   mod.socket = 0
   socket_open()
   }
//
// inputs
//
var inputs = {
   send:{type:'object',
      event:function(evt){
         socket_send(evt.detail)
         }}}
//
// outputs
//
var outputs = {
   receive:{type:'object',
      event:function(data){
         mods.output(mod,'receive',data)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('server:'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('address: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.address = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0port: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.port = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('\u00a0\u00a0status: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.status = input
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('open'))
      btn.addEventListener('click',function() {
         socket_open()
         })
      div.appendChild(btn)
   var btn = document.createElement('button')
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('close'))
      btn.addEventListener('click',function() {
         socket_close()
         })
      div.appendChild(btn)
   }
//
// local functions
//
function socket_open() {
   var url = "ws://"+mod.address.value+':'+mod.port.value
   mod.socket = new WebSocket(url)
   mod.socket.onopen = function(event) {
      mod.status.value = "opened"
      }
   mod.socket.onerror = function(event) {
      mod.status.value = "can not open"
      }
   mod.socket.onmessage = function(event) {
      mod.status.value = "receive"
      outputs.receive.event(event.data)
      }
   }
function socket_close() {
   mod.socket.close()
   mod.status.value = "closed"
   mod.socket = 0
   }
function socket_send(msg) {
   if (mod.socket != 0) {
      mod.status.value = "send"
      mod.socket.send(msg)
      }
   else {
      mod.status.value = "can't send, not open"
      }
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
