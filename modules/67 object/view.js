//
// view object
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// modified by Francisco Sanchez Arroyo 08-Feb-2020
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
    var name = 'view object'
    //
    // initialization
    //
    var init = function() {}
    //
    // inputs
    //
    var inputs = {
        input: {
            type: '',
            event: function(evt) {
                mod.text.value = JSON.stringify(evt.detail)
                outputs.output.event(evt.detail)
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        output: {
            type: '',
            event: function(obj) {
                mods.output(mod, 'output', obj)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        var text = document.createElement('textarea')
        text.setAttribute('rows', mods.ui.rows)
        text.setAttribute('cols', mods.ui.cols)
        div.appendChild(text)
        //
        // watch textarea for resize
        //
        new MutationObserver(update_module).observe(text, {
            attributes: true,
            attributeFilter: ["style"]
        })
        mod.text = text
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('format: '))
        div.appendChild(document.createTextNode('JSON'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'format'
        input.id = mod.div.id + 'JSON'
        input.checked = true
        div.appendChild(input)
        mod.JSON = input
        div.appendChild(document.createElement('br'))
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('view')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            view_window()
        })
        div.appendChild(btn)
    }
    //
    // local functions
    //
    //
    // update module
    //
    function update_module() {
        mods.fit(mod.div)
    }

    function view_window() {
        var win = window.open('')
        var btn = document.createElement('button')
        btn.appendChild(document.createTextNode('close'))
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.addEventListener('click', function() {
            win.close()
        })
        win.document.body.appendChild(btn)
        var text = document.createElement('textarea')
        text.style.width = '100%'
        text.style.height = '100%'
        text.value = mod.text.value
        win.document.body.appendChild(text)
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
