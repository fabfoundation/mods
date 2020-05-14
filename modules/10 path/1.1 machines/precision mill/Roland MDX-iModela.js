//
// Roland MDX/iModela milling machine
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez 09-May-2020
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
    var name = 'Roland MDX / iModela'
    //
    // initialization
    //
    var init = function() {
        mod.speed.value = 4
        mod.ox.value = 10
        mod.oy.value = 10
        mod.oz.value = 0
        mod.jz.value = 2
        mod.model.value = 'mdx_20'
        mod.model.dispatchEvent(new Event('change'))
    }
    //
    // inputs
    //
    var inputs = {
        path: {
            type: '',
            event: function(evt) {
                mod.name = evt.detail.name
                mod.path = evt.detail.path
                mod.dpi = evt.detail.dpi
                mod.width = evt.detail.width
                mod.height = evt.detail.height
                make_path()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        file: {
            type: '',
            event: function(obj) {
                mods.output(mod, 'file', obj)
            }
        }
    }
    //
    // interface
    //
    var models = {
        'imodela': {
            units: 100.0,
            hx: 0,
            hy: 55.0,
            hz: 26.0
        },
        'mdx_15': {
            units: 40.0,
            hx: 0,
            hy: 92.4,
            hz: 60.5
        },
        'mdx_20': {
            units: 40.0,
            hx: 0,
            hy: 152.4,
            hz: 60.5
        },
        'mdx_40': {
            units: 100.0,
            hx: 0,
            hy: 152.4,
            hz: 60.5
        }
    }
    var interface = function(div) {
        mod.div = div
        //
        // model
        //
        div.appendChild(document.createTextNode('model: '))
        var select = document.createElement('select')
        select.setAttribute('style', 'width:100px');
        var el = document.createElement('option')
        el.textContent = 'iModela'
        el.value = 'imodela'
        select.appendChild(el)
        var el = document.createElement('option')
        el.textContent = 'MDX-15'
        el.value = 'mdx_15'
        select.appendChild(el)
        var el = document.createElement('option')
        el.textContent = 'MDX-20'
        el.value = 'mdx_20'
        select.appendChild(el)
        var el = document.createElement('option')
        el.textContent = 'MDX-40'
        el.value = 'mdx_40'
        select.appendChild(el)
        select.addEventListener('change', function() {
            var model = models[this.value]
            mod.units = model.units
            mod.hx.value = model.hx
            mod.hy.value = model.hy
            mod.hz.value = model.hz
        })
        div.appendChild(select)
        mod.model = select
        div.appendChild(document.createElement('hr'))
        //
        // job parameters
        //
        div.appendChild(document.createTextNode('job settings:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('cut speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.speed = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('\u00a0\u00a0jog z: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.jz = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('hr'))
        //
        // origin x (mm)
        //
        div.appendChild(document.createTextNode('origin:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('x: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.ox = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode(' y: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.oy = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('br'))
        //div.appendChild(document.createTextNode('z: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        //div.appendChild(input)
        mod.oz = input
        //div.appendChild(document.createTextNode(' (mm)'))
        //div.appendChild(document.createElement('br'))
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('move to origin')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            var x0 = mod.units * parseFloat(mod.ox.value);
            var y0 = mod.units * parseFloat(mod.oy.value);
            var z0 = mod.units * parseFloat(mod.oz.value);
            var zjog = mod.units * parseFloat(mod.jz.value);
            var str = "PA;PA;VS10;!VZ10;!PZ0," + zjog + ";PU" + x0 + "," + y0 + ";Z" + x0 + "," + y0 + "," + z0 + ";!MC0;"
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            outputs.file.event(obj)
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('hr'))

        //
        // home
        //
        div.appendChild(document.createTextNode('home:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('x: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.hx = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode(' y: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.hy = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('z: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.hz = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('br'))
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('move home and stop')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            var xhome = mod.units * parseFloat(mod.hx.value);
            var yhome = mod.units * parseFloat(mod.hy.value);
            var zhome = mod.units * parseFloat(mod.hz.value);
            var str = "PA;PA;!PZ0," + zhome + ";PU" + xhome + "," + yhome + ";!MC0;";
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            outputs.file.event(obj)
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('hr'))


        //
        // manual move buttons
        //
        div.appendChild(document.createTextNode('manual move:'))
        div.appendChild(document.createElement('br'))

        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_big'
        div.appendChild(input)
        mod.range_big = input
        div.appendChild(document.createTextNode('5mm'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_medium'
        div.appendChild(input)
        mod.range_medium = input
        mod.range_medium.checked = true
        div.appendChild(document.createTextNode('1mm'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_small'
        div.appendChild(input)
        mod.range_small = input
        div.appendChild(document.createTextNode('0.1mm'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createElement('br'))



        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('+Y'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;VS10;PR0," + mod.step + ";!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('+Z'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;!VZ5;PR;!ZM" + mod.step + ";!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createElement('br'))

        div.appendChild(document.createTextNode('\u00a0\u00a0'))


        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('-X'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;VS10;PR-" + mod.step + ",0;!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.disabled = true
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('XY0'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;VS10;PR0," + mod.step + ";!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('+X'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;VS10;PR" + mod.step + ",0;!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.disabled = true
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Z0'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var str = "PR;!PZ0;!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createElement('br'))

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))


        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('-Y'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;VS10;PR0,-" + mod.step + ";!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('-Z'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "PA;PA;!VZ5;PR;!ZM-" + mod.step + ";!MC0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.rml'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)



    }
    //
    // local functions
    //

    function check_step() {
        //
        // Checks how big is the manual move step 
        // Units are mm x 40 eg. 10mm is 400 units
        //
        if (mod.range_big.checked) {
            mod.step = 5 * mod.units
            console.log('ten checked')
        } else if (mod.range_medium.checked) {
            mod.step = mod.units
        } else if (mod.range_small.checked) {
            mod.step = mod.units / 10
        }
    }




    function make_path() {
        var dx = 25.4 * mod.width / mod.dpi
        var nx = mod.width
        var speed = parseFloat(mod.speed.value)
        var jog = parseFloat(mod.jz.value)
        var ijog = Math.floor(mod.units * jog)
        var scale = mod.units * dx / (nx - 1)
        var x0 = parseFloat(mod.ox.value)
        var y0 = parseFloat(mod.oy.value)
        var z0 = parseFloat(mod.oz.value)
        var xoffset = mod.units * x0
        var yoffset = mod.units * y0
        var zoffset = mod.units * z0
        var str = "PA;PA;" // plot absolute
        str += "VS" + speed + ";!VZ" + speed + ";"
        str += "!PZ" + 0 + "," + ijog + ";" // set jog
        str += "!MC1;\n" // turn motor on
        //
        // follow segments
        //
        for (var seg = 0; seg < mod.path.length; ++seg) {
            //
            // move up to starting point
            //
            x = xoffset + scale * mod.path[seg][0][0]
            y = yoffset + scale * mod.path[seg][0][1]
            str += "PU" + x.toFixed(0) + "," + y.toFixed(0) + ";\n"
            //
            // move down
            //
            z = zoffset + scale * mod.path[seg][0][2]
            str += "Z" + x.toFixed(0) + "," + y.toFixed(0) + "," + z.toFixed(0) + ";\n"
            for (var pt = 1; pt < mod.path[seg].length; ++pt) {
                //
                // move to next point
                //
                x = xoffset + scale * mod.path[seg][pt][0]
                y = yoffset + scale * mod.path[seg][pt][1]
                z = zoffset + scale * mod.path[seg][pt][2]
                str += "Z" + x.toFixed(0) + "," + y.toFixed(0) + "," + z.toFixed(0) + ";\n"
            }
            //
            // move up
            //
            str += "PU" + x.toFixed(0) + "," + y.toFixed(0) + ";\n"
        }
        //
        // turn off motor and move back
        //
        var xhome = mod.units * parseFloat(mod.hx.value)
        var yhome = mod.units * parseFloat(mod.hy.value)
        var zhome = mod.units * parseFloat(mod.hz.value)
        str += "PA;PA;!PZ0," + zhome + ";PU" + xhome + "," + yhome + ";!MC0;"
        //
        // output string
        //
        var obj = {}
        obj.type = 'file'
        obj.name = mod.name + '.rml'
        obj.contents = str
        outputs.file.event(obj)
    }
    //
    // return values
    //
    return ({
        name: name,
        init: init,
        inputs: inputs,
        outputs: outputs,
        interface: interface
    })
}())
