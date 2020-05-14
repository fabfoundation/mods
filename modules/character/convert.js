//
// convert character
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
var name = 'character convert'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   ascii:{type:'character',
      event:function(evt){
         ascii_input(evt.detail)}},
   decimal:{type:'string',
      event:function(evt){
         decimal_input(evt.detail)}},
   hex:{type:'string',
      event:function(evt){
         hex_input(evt.detail)}},
   binary:{type:'string',
      event:function(evt){
         binary_input(evt.detail)}}}
//
// outputs
//
var outputs = {
   ascii:{type:'character',
      event:function(arg){
         mods.output(mod,'ascii',arg)}},
   decimal:{type:'string',
      event:function(arg){
         mods.output(mod,'decimal',arg)}},
   hex:{type:'string',
      event:function(arg){
         mods.output(mod,'hex',arg)}},
   binary:{type:'string',
      event:function(arg){
         mods.output(mod,'binary',arg)}}}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('asc: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(evt){
         ascii_input(mod.ascii.value)
         })
      div.appendChild(input)
      mod.ascii = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('dec: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(evt){
         decimal_input(mod.decimal.value)
         })
      div.appendChild(input)
      mod.decimal = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('hex: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(evt){
         hex_input(mod.hex.value)
         })
      div.appendChild(input)
      mod.hex = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('bin: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      input.addEventListener('change',function(evt){
         binary_input(mod.binary.value)
         })
      div.appendChild(input)
      mod.binary = input
   }
//
// local functions
//
function ascii_input(arg) {
   var value = arg.charCodeAt(0)
   mod.ascii.value = arg.slice(0,1)
   outputs.ascii.event(arg.slice(0,1))
   mod.decimal.value = value
   outputs.decimal.event(value)
   mod.hex.value = value.toString(16)
   outputs.hex.event(value.toString(16))
   mod.binary.value = value.toString(2)
   outputs.binary.event(value.toString(2))
   }
function decimal_input(arg) {
   var value = parseInt(arg.slice(0,3))
   mod.ascii.value = String.fromCharCode(value)
   outputs.ascii.event(String.fromCharCode(value))
   mod.decimal.value = value
   outputs.decimal.event(value)
   mod.hex.value = value.toString(16)
   outputs.hex.event(value.toString(16))
   mod.binary.value = value.toString(2)
   outputs.binary.event(value.toString(2))
   }
function hex_input(arg) {
   var value = parseInt(arg.slice(0,2),16)
   mod.ascii.value = String.fromCharCode(value)
   outputs.ascii.event(String.fromCharCode(value))
   mod.decimal.value = value
   outputs.decimal.event(value)
   mod.hex.value = value.toString(16)
   outputs.hex.event(value.toString(16))
   mod.binary.value = value.toString(2)
   outputs.binary.event(value.toString(2))
   }
function binary_input(arg) {
   var value = parseInt(arg.slice(0,8),2)
   mod.ascii.value = String.fromCharCode(value)
   outputs.ascii.event(String.fromCharCode(value))
   mod.decimal.value = value
   outputs.decimal.event(value)
   mod.hex.value = value.toString(16)
   outputs.hex.event(value.toString(16))
   mod.binary.value = value.toString(2)
   outputs.binary.event(value.toString(2))
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
