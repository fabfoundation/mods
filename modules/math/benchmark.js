//
// benchmark
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
var name = 'benchmark'
//
// initialization
//
var init = function() {
   mod.terms.value = '1e8'
   mod.workers.value = '4'
   }
//
// inputs
//
var inputs = {
   start:{type:'',
      event:function(evt){
         benchmark()}}}
//
// outputs
//
var outputs = {
   }
//
// interface
//
var interface = function(div){
   mod.div = div
   div.appendChild(document.createTextNode('terms: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.terms = input
   div.appendChild(document.createElement('br'))
   div.appendChild(document.createTextNode('workers: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.workers = input
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var text = document.createTextNode('calculate pi')
         mod.label = text
         btn.appendChild(text)
      btn.addEventListener('click',function() {
         benchmark()
         })
      mod.button = btn
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('value: ')
      div.appendChild(text)
      mod.value = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('time (s): ')
      div.appendChild(text)
      mod.time = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('Mflops: ')
      div.appendChild(text)
      mod.mflops = text
   }
//
// local functions
//
function benchmark() {
   mod.label.nodeValue = 'calculating'
   var nworkers = parseInt(mod.workers.value)
   var count = 0
   var pi = 0
   var time = 0
   var workers = []
   var tstart = Date.now()
   var blob = new Blob(['('+worker.toString()+'())'])
   var url = window.URL.createObjectURL(blob)
   for (var index = 0; index < nworkers; ++index) {
      workers[index] = new Worker(url)
      workers[index].addEventListener('message',function(evt) {
         pi += evt.data.pi
         workers[evt.data.index].terminate()
         count += 1
         if (count == nworkers) {
            window.URL.revokeObjectURL(url)
            var tend = Date.now()
            time = (tend-tstart)/1000
            mod.value.nodeValue = 'value: '+pi
            mod.time.nodeValue = 'time (s): '+time
            var mflops = nworkers*5*terms/(time*1e6)
            mod.mflops.nodeValue = 'Mflops: '+mflops.toFixed(0)
            mod.label.nodeValue = 'calculate pi'
            mods.fit(mod.div)
            }
         })
      var terms = parseFloat(mod.terms.value)
      workers[index].postMessage({terms:terms,index:index})
      }
   }
function worker() {
   self.addEventListener('message',function(evt) {
      var terms = evt.data.terms
      var index = evt.data.index
      var start = 1+index*terms
      var end = (index+1)*terms
      var pi = 0
      for (var term = start; term <= end; ++term)
         pi += 0.5/((term-0.75)*(term-0.25))
      self.postMessage({pi:pi,index:index})
      })
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
