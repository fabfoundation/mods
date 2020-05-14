//
// vector mask
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
var name = 'vector mask'
//
// initialization
//
var init = function() {
   mod.fill.checked = true
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
         }},
   palette:{type:'text',
      event:function(evt){
         mod.palette = JSON.parse(evt.detail)
         }},
   path:{type:'array',
      event:function(evt){
         make_mask(evt.detail)
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
   //
   // fill
   //
   div.appendChild(document.createTextNode('fill masks: '))
   var input = document.createElement('input')
      input.type = 'checkbox'
      input.id = mod.div.id+'fill'
      div.appendChild(input)
      mod.fill = input
   div.appendChild(document.createElement('br'))
   }
//
// local functions
//
//
// make_mask
//
function make_mask(path) {
   //
   // save mask
   //
   save_mask(path)
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
function save_mask(path) {
   //
   // create SVG
   //
   var imgwidth = mod.image.width/parseFloat(mod.imageInfo.dpi)
   var imgheight = mod.image.height/parseFloat(mod.imageInfo.dpi)
   var svgNS = "http://www.w3.org/2000/svg"
   var svg = document.createElementNS(svgNS,"svg")
      svg.setAttributeNS("http://www.w3.org/2000/xmlns/",
         "xmlns:xlink","http://www.w3.org/1999/xlink")
      svg.setAttribute('width',(3+imgwidth)+'in')
      svg.setAttribute('height',(3+imgheight)+'in')
      svg.style.backgroundColor = 'rgb(255,255,255)'
      svg.setAttribute('viewBox','0 0 '+(3+imgwidth)+' '+(3+imgheight))
   //
   // background
   //
   var rect = document.createElementNS(svgNS,'rect')
      rect.setAttribute('x','0')
      rect.setAttribute('y','0')
      rect.setAttribute('width',3+imgwidth)
      rect.setAttribute('height',3+imgheight)
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
      polyline.setAttribute('points','0.5,0.5 '+
         '0.5,'+(imgheight+2.5)+' '+
         (imgwidth+2.5)+','+(imgheight+2.5)+' '+
         (imgwidth+2.5)+',0.9 '+
         (imgwidth+2.1)+',0.5 '+
         '0.5,0.5')
      g.appendChild(polyline)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx','1')
      circle.setAttribute('cy','1')
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx','1')
      circle.setAttribute('cy',(2+imgheight))
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx',(2+imgwidth))
      circle.setAttribute('cy',(2+imgheight))
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   var circle = document.createElementNS(svgNS,'circle')
      circle.setAttribute('cx',(2+imgwidth))
      circle.setAttribute('cy','1')
      circle.setAttribute('r','0.125')
      circle.setAttribute('stroke','red')
      circle.setAttribute('stroke-width','0.01')
      circle.setAttribute('fill','none')
      g.appendChild(circle)
   //
   // name
   //
   var name = mod.imageInfo.name+'.'+mod.palette[mod.index][0]
   name += '.'+mod.palette[mod.index][1]
   name += '.'+mod.palette[mod.index][2]
   if (mod.palette[mod.index][3] != undefined)
      name += '.'+mod.palette[mod.index][3]
   var text = document.createElementNS(svgNS,'text')
      text.setAttribute('id',mod.div.id+'svgtext')
      text.setAttribute('x',(3+imgwidth)/2)
      text.setAttribute('y','1')
      text.setAttribute('fill','red')
      text.setAttribute('font-size','.5')
      text.setAttribute('text-anchor','middle')
      text.setAttribute('dy','.2')
      text.textContent = name
      svg.appendChild(text)
   //
   // mask
   //
   var g = document.createElementNS(svgNS,'g')
      svg.appendChild(g)
   for (var seg = 0; seg < path.length; ++seg) {
      var points = ''
      for (var pt = 0; pt < path[seg].length; ++ pt) {
         var x = 1.5+imgwidth*path[seg][pt][0]/(mod.image.width-1)
         var y = 1.5+imgheight*(1-path[seg][pt][1]/(mod.image.height-1))
         points += x+','+y+' '
         }
      var x = 1.5+imgwidth*path[seg][0][0]/(mod.image.width-1)
      var y = 1.5+imgheight*(1-path[seg][0][1]/(mod.image.height-1))
      points += x+','+y+' '
      if (mod.fill.checked == true) {
         var polyline = document.createElementNS(svgNS,'polyline')
            polyline.setAttribute('stroke','none')
            polyline.setAttribute('fill','black')
            polyline.setAttribute('fill-rule','evenodd')
            polyline.setAttribute('points',points)
            g.appendChild(polyline)
         }
      else {
         var polyline = document.createElementNS(svgNS,'polyline')
            polyline.setAttribute('stroke','black')
            polyline.setAttribute('stroke-width','0.01')
            polyline.setAttribute('stroke-linecap','round')
            polyline.setAttribute('fill','none')
            polyline.setAttribute('points',points)
            g.appendChild(polyline)
         }
      }
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

