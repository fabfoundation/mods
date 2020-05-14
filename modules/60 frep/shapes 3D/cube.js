//
// frep cube
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
(function() {
    //
    // module globals
    //
    var mod = {}
    //
    // name
    //
    var name = 'frep cube'
    //
    // initialization
    //
    var init = function() {
        mod.xmin.value = '-1'
        mod.ymin.value = '-1'
        mod.zmin.value = '-1'
        mod.xmax.value = '1'
        mod.ymax.value = '1'
        mod.zmax.value = '1'
    }
    //
    // inputs
    //
    var inputs = {
        variables: {
            type: '',
            event: function(evt) {
                for (var p in evt.detail)
                    mod[p].value = evt.detail[p]
                outputs.variables.event()
                outputs.shape.event()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        shape: {
            type: '',
            event: function() {
                var xmin = parseFloat(mod.xmin.value)
                var xmax = parseFloat(mod.xmax.value)
                var ymin = parseFloat(mod.ymin.value)
                var ymax = parseFloat(mod.ymax.value)
                var zmin = parseFloat(mod.zmin.value)
                var zmax = parseFloat(mod.zmax.value)
                var xfn = `Math.min(X-(${xmin}),(${xmax})-X)`
                var yfn = `Math.min(Y-(${ymin}),(${ymax})-Y)`
                var zfn = `Math.min(Z-(${zmin}),(${zmax})-Z)`
                var fn = `Math.min(Math.min(${xfn},${yfn}),${zfn})`
                var variables = ['X', 'Y', 'Z']
                var limits = [
                    [xmin, xmax],
                    [ymin, ymax],
                    [zmin, zmax]
                ]
                var type = 'Magnitude'
                var shape = {
                    function: fn,
                    variables: variables,
                    limits: limits,
                    type: type
                }
                mods.output(mod, 'shape', shape)
            }
        },
        variables: {
            type: '',
            event: function() {
                var xmin = parseFloat(mod.xmin.value)
                var xmax = parseFloat(mod.xmax.value)
                var ymin = parseFloat(mod.ymin.value)
                var ymax = parseFloat(mod.ymax.value)
                var zmin = parseFloat(mod.zmin.value)
                var zmax = parseFloat(mod.zmax.value)
                var vars = {
                    xmin: xmin,
                    ymin: ymin,
                    zmin: zmin,
                    xmax: xmax,
                    ymax: ymax,
                    zmax: zmax
                }
                mods.output(mod, 'variables', vars)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // xmin
        //
        div.appendChild(document.createTextNode('xmin: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.xmin = input
        //
        // xmax
        //
        div.appendChild(document.createTextNode(' xmax: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.xmax = input
        div.appendChild(document.createElement('br'))
        //
        // ymin
        //
        div.appendChild(document.createTextNode('ymin: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.ymin = input
        //
        // ymax
        //
        div.appendChild(document.createTextNode(' ymax: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.ymax = input
        div.appendChild(document.createElement('br'))
        //
        // zmin
        //
        div.appendChild(document.createTextNode('zmin: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.zmin = input
        //
        // zmax
        //
        div.appendChild(document.createTextNode(' zmax: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 3
        div.appendChild(input)
        mod.zmax = input
        div.appendChild(document.createElement('br'))
        //
        // output button
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('output'))
        btn.addEventListener('click', function() {
            outputs.variables.event()
            outputs.shape.event()
        })
        div.appendChild(btn)
    }
    //
    // local functions
    //
    ;
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
