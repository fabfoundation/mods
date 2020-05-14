//
// blank
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2020
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
    var name = 'blank'
    //
    // initialization
    //
    var init = function() {}
    //
    // inputs
    //
    var inputs = {
        input: {
            type: 'object',
            event: function(evt) {}
        }
    }
    //
    // outputs
    //
    var outputs = {
        output: {
            type: 'object',
            event: function() {}
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('hello world'))
    }
    //
    // local functions
    //

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
