//
// label
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
// Modified by Francisco Sanchez Arroyo 02-Feb-2020
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
    //
    // module globals
    //
    var mod = {}
    //
    // name
    //
    var name = 'label'
    //
    // initialization
    //
    var init = function() {
        mod.size.value = '400'
        mod.text.value = 'Simple Label'
        update_text()
    }
    //
    // inputs
    //
    var inputs = {}
    //
    // outputs
    //
    var outputs = {}
    //
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //div.appendChild(document.createTextNode('font size: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        input.addEventListener('input', function(evt) {
            update_text()
        })
        //div.appendChild(input)
        mod.size = input
        //div.appendChild(document.createTextNode(' (%)'))
        //div.appendChild(document.createElement('br'))
        //div.appendChild(document.createTextNode('text: '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function(evt) {
            update_text()
        })
        //div.appendChild(input)
        mod.text = input
        //div.appendChild(document.createElement('br'))
        var span = document.createElement('span')
        var text = document.createTextNode('')
        span.appendChild(text)
        mod.label = text
        div.appendChild(span)
        mod.span = span
    }
    //
    // local functions
    //
    function update_text() {
        mod.label.nodeValue = mod.text.value
        mod.span.style.fontSize = mod.size.value + '%'
        mods.fit(mod.div)
    }
    //
    // return values
    //
    return ({
        mod: mod,
        name: name,
        init: init,
        inputs: inputs,
        outputs: outputs,
        interface: interface
    })
}())
