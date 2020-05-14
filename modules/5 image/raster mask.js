//
// raster mask
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
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
var name = 'raster mask'
//
// initialization
//
var init = function() {
   }
//
// inputs
//
var inputs = {
   imageInfo:{type:'object',
      event:function(evt){
         mod.imageInfo = evt.detail
         }},
   image:{type:'RGBA',
      event:function(evt){
         mod.image = evt.detail
         mod.labelspan.style.fontWeight = 'bold'         
         var ctx = mod.convert.getContext("2d")
         ctx.canvas.width = mod.image.width
         ctx.canvas.height = mod.image.height 
         }},
   palette:{type:'text',
      event:function(evt){
         mod.palette = JSON.parse(evt.detail)
         }},
   mask:{type:'RGBA',
      event:function(evt){
         var ctx = mod.convert.getContext("2d")
         ctx.putImageData(evt.detail,0,0)
         make_mask()
         }}}
//
// outputs
//
var outputs = {
   image:{type:'RGBA',
      event:function(){
         mods.output(mod,'image',mod.image)
         }},
   color:{type:'RGB',
      event:function(evt){
         mods.output(mod,'color',evt)
         }},
   SVG:{type:'file',
      event:function(evt){
         mods.output(mod,'SVG',evt)
         }}}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // off-screen conversion canvas
   //
   var canvas = document.createElement('canvas')
      mod.convert = canvas
   //
   // button
   //
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var span = document.createElement('span')
         var text = document.createTextNode('calculate masks')
            mod.label = text
            span.appendChild(text)
         mod.labelspan = span
         btn.appendChild(span)
      btn.addEventListener('click',function(){
         mod.index = 0
         outputs.color.event(mod.palette[mod.index])
         outputs.image.event()
         })
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
//
// make_mask
//
function make_mask() {
   //
   // save mask
   //
   save_mask()
   //
   // check for next mask
   //
   if (mod.index < (mod.palette.length-1)) {
      //
      // yes, output
      //
      mod.index += 1
      outputs.color.event(mod.palette[mod.index])
      outputs.image.event()
      }
   else {
      //
      // no, done
      //
      mod.labelspan.style.fontWeight = 'normal' 
      }        
   }
//
// save_mask
//
function save_mask(mask) {
   //
   // create SVG
   //
   var imgwidth = mod.image.width/parseFloat(mod.imageInfo.dpi)
   var imgheight = mod.image.height/parseFloat(mod.imageInfo.dpi)
   var svgNS = "http://www.w3.org/2000/svg"
   var svg = document.createElementNS(svgNS,"svg")
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/",
         "xmlns:xlink","http://www.w3.org/1999/xlink")
      svg.setAttribute('width',(2+imgwidth)+'in')
      svg.setAttribute('height',(2+imgheight)+'in')
      svg.style.backgroundColor = 'rgb(255,255,255)'
      svg.setAttribute('viewBox','0 0 '+(2+imgwidth)+' '+(2+imgheight))
   //
   // background
   //
   var rect = document.createElementNS(svgNS,'rect')
      rect.setAttribute('x','0')
      rect.setAttribute('y','0')
      rect.setAttribute('width',2+imgwidth)
      rect.setAttribute('height',2+imgheight)
      rect.setAttribute('stroke','none')
      rect.setAttribute('fill','white')
      svg.appendChild(rect)
   //
   // registration
   //
   var g = document.createElementNS(svgNS,'g')
      svg.appendChild(g)
   var polyline = document.createElementNS(svgNS,'polyline')
      polyline.setAttribute('stroke','red')
      polyline.setAttribute('stroke-width','0.01')
      polyline.setAttribute('stroke-linecap','round')
      polyline.setAttribute('fill','none')
      polyline.setAttribute('points','0.25,0.25 '+
         '0.25,'+(imgheight+1.75)+' '+
         (imgwidth+1.75)+','+(imgheight+1.75)+' '+
         (imgwidth+1.75)+',0.65 '+
         (imgwidth+1.35)+',0.25 '+
         '0.25,0.25')
      g.appendChild(polyline)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx','.75')
      circle.setAttribute('cy','.75')
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx','.75')
      circle.setAttribute('cy',(1.25+imgheight))
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx',(1.25+imgwidth))
      circle.setAttribute('cy',(1.25+imgheight))
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx',(1.25+imgwidth))
      circle.setAttribute('cy','.75')
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   //
   // name
   //
   var name = mod.imageInfo.name
   if (mod.palette[mod.index][3] != undefined)
      name += '-'+mod.palette[mod.index][3]
   else {
      name += '-'+mod.palette[mod.index][0]
      name += '.'+mod.palette[mod.index][1]
      name += '.'+mod.palette[mod.index][2]
      }
   var text = document.createElementNS(svgNS,'text')
      text.setAttribute('id',mod.div.id+'svgtext')
      text.setAttribute('x',(2+imgwidth)/2)
      text.setAttribute('y','.75')
      text.setAttribute('fill','red')
      text.setAttribute('font-size','.4')
      text.setAttribute('text-anchor','middle')
      text.textContent = name
      svg.appendChild(text)
   //
   // raster mask
   //
   var href = mod.convert.toDataURL()
   var img = document.createElementNS(svgNS,'image')
      img.setAttribute('id',mod.div.id+'svgimg')
      img.setAttribute('x','1')
      img.setAttribute('y','1')
      img.setAttribute('width',imgwidth)
      img.setAttribute('height',imgheight)
      img.setAttributeNS('http://www.w3.org/1999/xlink','href',href)
      svg.appendChild(img)
   //
   // file
   //
   var obj = {}
   obj.type = 'file'
   obj.name = name+'.svg'
   var xml = new XMLSerializer().serializeToString(svg)
   obj.contents = xml
   outputs.SVG.event(obj)
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

