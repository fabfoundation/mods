//
// APA node module
//    todo: back-pressure
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
var name = 'APA node'
//
// initialization
//
var init = function() {
   mod.orig.value = ''
   }
//
// inputs
//
var inputs = {
   port1:{type:'',label:'port 1',
      event:function(evt){
         input_packet(1,evt.detail)}},
   port2:{type:'',label:'port 2',
      event:function(evt){
         input_packet(2,evt.detail)}},
   port3:{type:'',label:'port 3',
      event:function(evt){
         input_packet(3,evt.detail)}},
   orig:{type:'',
      event:function(evt){
         input_packet(0,evt.detail)}}}
//
// outputs
//
var outputs = {
   port1:{type:'',label:'port 1',
      event:function(packet){
         mods.output(mod,'port1',packet)}},
   port2:{type:'',label:'port 2',
      event:function(packet){
         mods.output(mod,'port2',packet)}},
   port3:{type:'',label:'port 3',
      event:function(packet){
         mods.output(mod,'port3',packet)}},
   dest:{type:'',
      event:function(packet){
         mods.output(mod,'dest',packet)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // inputs, outputs
   //
   mod.in = []
   mod.out = []
   div.appendChild(document.createTextNode('\u00a0input port output'))
   div.appendChild(document.createElement('br'))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.in[1] = input
   div.appendChild(document.createTextNode(' 1 '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.out[1]= input
   div.appendChild(document.createElement('br'))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.in[2] = input
   div.appendChild(document.createTextNode(' 2 '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.out[2] = input
   div.appendChild(document.createElement('br'))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.in[3] = input
   div.appendChild(document.createTextNode(' 3 '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.out[3] = input
   div.appendChild(document.createElement('br'))
   //
   // origination, destination
   //
   div.appendChild(document.createTextNode('origination\u00a0\u00a0destination'))
   div.appendChild(document.createElement('br'))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.orig = input
   div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0'))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.dest = input
   div.appendChild(document.createElement('br'))
   //
   // buttons
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('output'))
      btn.addEventListener('click',function(){
         orig_packet(mod.orig.value)
         mod.orig.value = ''
         })
      div.appendChild(btn)
   div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('input'))
      btn.addEventListener('click',function(){
         mod.dest.value = ''
         })
      div.appendChild(btn)
   }
//
// local functions
//
// input_packet
//
function input_packet(port,packet) {
   mod.in[port].value = JSON.stringify(packet)
   if (packet[0][0] == 0) {
      var route = packet[0].slice(1)
      route.push(port)
      var payload = packet[1]
      var newpacket = [route,payload]
      mod.dest.value = JSON.stringify(newpacket)
      outputs.dest.event(packet[1])
      }
   else {
      var route = packet[0].slice(1)
      route.push(port)
      var payload = packet[1]
      var newpacket = [route,payload]
      mod.out[packet[0][0]].value = JSON.stringify(newpacket)
      outputs["port"+packet[0][0]].event(newpacket)
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
