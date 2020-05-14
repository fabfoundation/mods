//
// note
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2017
// Modified by Francisco Sanchez 2019
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
    var name = 'note'
    //
    // initialization
    //
    var init = function() {
        mod.text.value = 'place your notes here'
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
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // text
        //
        var text = document.createElement('textarea')
        text.style.backgroundColor = '#D4E157';
        text.setAttribute('spellcheck', 'false')
        text.setAttribute('rows', mods.ui.rows)
        text.setAttribute('cols', mods.ui.cols)
        //
        // watch textarea for resize
        //
        new MutationObserver(update_module).observe(text, {
            attributes: true,
            attributeFilter: ["style"]
        })
        div.appendChild(text)
        mod.text = text
        div.appendChild(document.createElement('br'))
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
