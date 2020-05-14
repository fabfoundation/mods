//
// Trotec laser cutter
//
// Neil Gershenfeld 1/18/20
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
    var name = 'Trotec laser cutter'
    //
    // initialization
    //
    var init = function() {
        mod.power.value = 25
        mod.velocity.value = 10
        mod.frequency.value = 5000
        mod.xpos.value = 50
        mod.ypos.value = 50
        mod.topleft.checked = true
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
        },
        settings: {
            type: '',
            event: function(evt) {
                set_values(evt.detail)
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        file: {
            type: '',
            event: function(str) {
                obj = {}
                obj.type = 'file'
                obj.name = mod.name + '.tro'
                obj.contents = str
                mods.output(mod, 'file', obj)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('model:'))
        div.appendChild(document.createElement('br'))
        var select = document.createElement('select')
        select.setAttribute('style', 'width:150px');
        var el = document.createElement('option')
        el.textContent = 'Speedy 100'
        el.value = 'Speedy 100'
        select.appendChild(el)
        var el = document.createElement('option')
        el.textContent = 'Speedy 100 Flexx CO2'
        el.value = 'Speedy 100 Flexx CO2'
        select.appendChild(el)
        var el = document.createElement('option')
        el.textContent = 'Speedy 100 Flexx fiber'
        el.value = 'Speedy 100 Flexx fiber'
        select.appendChild(el)
        var el = document.createElement('option')
        el.textContent = 'Speedy 400'
        el.value = 'Speedy 400'
        select.appendChild(el)
        div.appendChild(select)
        mod.model = select
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('power (%): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.power = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('velocity (mm/s): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.velocity = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('frequency (Hz): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.frequency = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('origin (mm):'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('x: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.xpos = input
        div.appendChild(document.createTextNode(' y: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.ypos = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('alignment:'))
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'topleft'
        div.appendChild(input)
        mod.topleft = input
        div.appendChild(document.createTextNode(' left \u00A0\u00A0 top \u00A0\u00A0 right '))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'topright'
        div.appendChild(input)
        mod.topright = input
        div.appendChild(document.createElement('br'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'botleft'
        div.appendChild(input)
        mod.botleft = input
        div.appendChild(document.createTextNode(' left bottom right '))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'botright'
        div.appendChild(input)
        mod.botright = input
    }
    //
    // local functions
    //
    // set_values
    //
    function set_values(settings) {
        for (var s in settings) {
            switch (s) {
                case 'power (%)':
                    mod.power.value = settings[s]
                    break
                case 'velocity (mm/s)':
                    mod.velocity.value = settings[s]
                    break
                case 'frequency (Hz)':
                    mod.frequency.value = settings[s]
                    break
            }
        }
    }
    //
    // make_path
    //
    function make_path() {
        var model = mod.model.value
        if (model == "Speedy 100") {
            var um_per_inc = 5
            var str = "SL0\n" // CO2
        } else if (model == "Speedy 100 Flexx CO2") {
            var um_per_inc = 5
            var str = "SL0\n" // CO2
        } else if (model == "Speedy 100 Flexx fiber") {
            var um_per_inc = 5
            var str = "SL4\n" // fiber pulse
        } else if (model == "Speedy 400") {
            var um_per_inc = 5.097
            var str = "SL0\n" // CO2
        }
        var dx = 25.4 * mod.width / mod.dpi
        var dy = 25.4 * mod.height / mod.dpi
        var nx = mod.width
        var ny = mod.height
        var power = 100 * parseFloat(mod.power.value)
        var frequency = parseFloat(mod.frequency.value)
        var scale = 1000 * (dx / (nx - 1)) / um_per_inc
        var velocity = parseFloat(mod.velocity.value) * 1000 / um_per_inc
        var ox = parseFloat(mod.xpos.value)
        var oy = parseFloat(mod.ypos.value)
        var xorg = 2600 // Speedy
        var yorg = 800 // "
        if (mod.botleft.checked) {
            var xoffset = xorg + 1000 * ox / um_per_inc
            var yoffset = yorg + 1000 * (oy - dy) / um_per_unc
        } else if (mod.botright.checked) {
            var xoffset = xorg + 1000 * (ox - dx) / um_per_inc
            var yoffset = yorg + 1000 * (oy - dy) / um_per_inc
        } else if (mod.topleft.checked) {
            var xoffset = xorg + 1000 * ox / um_per_inc
            var yoffset = yorg + 1000 * oy / um_per_inc
        } else if (mod.topright.checked) {
            var xoffset = xorg + 1000 * (ox - dx) / um_per_inc
            var yoffset = yorg + 1000 * oy / um_per_inc
        }
        str += "ED3\n" // exhaust on
        str += "ED4\n" // air assist on
        str += "VS" + velocity.toFixed(0) + "\n" // set velocity
        str += "LF" + frequency.toFixed(0) + "\n" // set frequency
        str += "LP" + power.toFixed(0) + "\n" // set power
        str += "EC\n" // execute
        //
        // loop over segments
        //
        for (var seg = 0; seg < mod.path.length; ++seg) {
            //
            // loop over points
            //
            x = xoffset + scale * mod.path[seg][0][0]
            y = yoffset + scale * (ny - mod.path[seg][0][1])
            if (x < 0) x = 0
            if (y < 0) y = 0
            str += "PA" + x.toFixed(0) + "," + y.toFixed(0) + "\n" // move to start point
            str += "PD\n" // laser on
            for (var pt = 1; pt < mod.path[seg].length; ++pt) {
                x = xoffset + scale * mod.path[seg][pt][0]
                y = yoffset + scale * (ny - mod.path[seg][pt][1])
                if (x < 0) x = 0
                if (y < 0) y = 0
                str += "PA" + x.toFixed(0) + "," + y.toFixed(0) + "\n" // move to next point
            }
            str += "PU\n" // laser off
            str += "EC\n" // execute
        }
        str += "EO3\n" // exhaust off
        str += "EO4\n" // air assist off
        str += "PA0,0\n" // move home   
        str += "EC\n" // execute
        outputs.file.event(str)
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
