//
// ExtractFaces module extracts top faces of the same thickness from Tools/FabLab Connect command of SolidWorks products
// 
// Shawn Liu @ Dassault Systemes SolidWorks Corporation
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
var name = 'ExtractFaces connect'
//
// initialization
//
var init = function() {
   mod.address = getParameterByName('swIP') || '127.0.0.1'
   mod.port = getParameterByName('swPort') || '80'
   mod.socket = 0
   mod.thickness.value = 0.75
   socket_open()
   }
//
// inputs
//
var inputs = {}
//
// outputs
//
var outputs = {
   SVGArray:{type:'object',
      event:function(data){
          mods.output(mod, 'SVGArray', JSON.parse(data))
      }
   }
}
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('server:'))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('address: ' + getParameterByName('swIP')))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0port: ' + getParameterByName('swPort')))
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('\u00a0\u00a0status: '))
   input = document.createElement('input')
   input.type = 'text'
   input.size = 12
   div.appendChild(input)
   mod.status = input
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
   btn.style.margin = 1
   btn.appendChild(document.createTextNode('open'))
   btn.addEventListener('click', function () {
       socket_open()
   })
   div.appendChild(btn)
   var btn = document.createElement('button')
   btn.style.margin = 1
   btn.appendChild(document.createTextNode('close'))
   btn.addEventListener('click', function () {
       socket_close()
   })
   div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('thickness: '))
   input = document.createElement('input')
      input.type = 'text'
      input.size = 10
      div.appendChild(input)
      mod.thickness = input
   div.appendChild(document.createTextNode('(inch)'))
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('Extract SVGs'))
      btn.addEventListener('click',function() {
         extract_SVGs()
         })
      div.appendChild(btn)
   }
//
// local functions
//

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function socket_open() {
   var url = "ws://"+mod.address+':'+mod.port
   mod.socket = new WebSocket(url)
   mod.socket.onopen = function(event) {
       mod.status.value = "opened"
       var connect = {}
       connect.modCmd = 'connect'
       connect.owner = getParameterByName('swOwner')
       connect.id = getParameterByName('swID')
       socket_send(JSON.stringify(connect))
      }
   mod.socket.onerror = function(event) {
      mod.status.value = "can not open"
      }
   mod.socket.onmessage = function(event) {
      mod.status.value = "receive"
      var swData = JSON.parse(event.data);
      if (swData.swType === "FaceSVGArray") {
          outputs.SVGArray.event(JSON.stringify(swData.data))
      }
   }
   mod.socket.onclose = function (event) {
       mod.status.value = "connection closed"
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
function extract_SVGs() {
   var modcmd = new Object;
   modcmd.modCmd = "AutoExtractFaces";
   modcmd.thickness = Number(mod.thickness.value * 25.4); // inch to mm
   socket_send(JSON.stringify(modcmd))
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
