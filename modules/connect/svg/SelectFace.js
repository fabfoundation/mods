//
// SelectFace module receives a selected face from Tools/FabLab Connect command of SolidWorks products
//
// Shawn Liu @ Dassault Systemes SolidWorks Corporation
// (c) Massachusetts Institute of Technology 2017
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
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
var name = 'SelectFace connect'
//
// initialization
//
var init = function() {
   mod.address = getParameterByName('swIP') || '127.0.0.1'
   mod.port = getParameterByName('swPort') || '8787'
   mod.socket = 0
   mod.margin.value = 10  //10mm
   mod.includeInner.checked = true;
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
   SVG:{type:'string',
      event:function(data){
         mods.output(mod,'SVG',data)}}}
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
      div.appendChild(document.createElement('br'))
      div.appendChild(document.createTextNode('settings:'))
      div.appendChild(document.createElement('br'))
      div.appendChild(document.createTextNode('margin (mm): '))
      input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.margin = input
      div.appendChild(document.createElement('br'))
      input = document.createElement('input')
      input.type = 'checkbox'
      input.size = 10
      div.appendChild(input)
      div.appendChild(document.createTextNode('include inner faces'))
      mod.includeInner = input
      div.appendChild(document.createElement('br'))
      var btn = document.createElement('button')
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('Update'))
      btn.addEventListener('click', function () {
          update_settings()
      })
      div.appendChild(btn)
   }
//
// local functions
//

function getParameterByName(name, url) {
    if (!url) url = window.location.href
    name = name.replace(/[\[\]]/g, "\\$&")
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url)
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, " "))
}

function update_settings() {
    var modcmd = new Object
    modcmd.modCmd = "SetMargin"
    modcmd.margin = Number(mod.margin.value) // mm
    socket_send(JSON.stringify(modcmd))
    var innerCmd = new Object
    innerCmd.modCmd = "SetIncludeInner"
    innerCmd.includeInner = mod.includeInner.checked
    socket_send(JSON.stringify(innerCmd))
    socket_send('{"modCmd":"EnableSelectFaceNotify","selectFaceNotify":true}')
}

function socket_open() {
   var url = "ws://"+mod.address+':'+mod.port
   mod.socket = new WebSocket(url)
   mod.socket.onopen = function(event) {
       mod.status.value = "opened"
       var connect= {}
       connect.modCmd = 'connect'
       connect.owner = getParameterByName('swOwner')
       connect.id = getParameterByName('swID') 
       socket_send(JSON.stringify(connect))
       update_settings()
      }
   mod.socket.onerror = function(event) {
      mod.status.value = "can not open"
      }
   mod.socket.onmessage = function(event) {
      mod.status.value = "receive"
      console.log('receive :' + event.data)
      var swData = JSON.parse(event.data)
      if (swData.swType === "FaceSVG") {
          outputs.SVG.event(swData.data)
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
