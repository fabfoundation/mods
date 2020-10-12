//
// Othermill/Bantam Tools milling machine
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez Arroyo 13-May-2020
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
    var name = 'Othermill / Bantam Tools'
    //
    // initialization
    //
    var init = function() {
        mod.speed.value = 4 // mm/s
        mod.plunge.value = 2 // mm/s
        mod.spindle_speed.value = 16400 // rpm
        mod.tool = 1 // tool tumber
        mod.ox.value = 0.0 // x offset mm
        mod.oy.value = 0.0 // y offset mm
        mod.jz.value = 2 // jog height mm
        mod.tz.value = 0.0 // zero plate thickness in mm
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

    var interface = function(div) {
        mod.div = div
        div.appendChild(document.createTextNode('job parameters:'))
        div.appendChild(document.createElement('br'))
        //
        // speed
        //
        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0cut speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.speed = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        //
        // plunge speed
        //
        div.appendChild(document.createTextNode('plunge speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.plunge = input
        div.appendChild(document.createTextNode(' (mm/s)'))
        div.appendChild(document.createElement('br'))
        //
        // jog
        //
        div.appendChild(document.createTextNode('\u00a0jog height: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.jz = input
        div.appendChild(document.createTextNode(' (mm)\u00a0'))
        div.appendChild(document.createElement('br'))

        //
        // spindle speed
        //
        div.appendChild(document.createTextNode('spindle speed: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.spindle_speed = input
        div.appendChild(document.createTextNode(' (rpm)\u00a0\u00a0'))
        //div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))
        div.appendChild(document.createElement('br'))

        div.appendChild(document.createElement('hr'))

        //
        // home
        //
        div.appendChild(document.createTextNode('home:'))
        div.appendChild(document.createElement('br'))


        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('auto home XYZ')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            var str = "G28.2 X0 Y0 Z0\n";
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
            obj.contents = str
            outputs.file.event(obj)
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('Probe Z0 Plate')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            var warn = confirm("Warning: Make sure that the zero plate is over the material and is grounded to the machine")
            if (warn == true) {
                var jog_height = parseFloat(mod.jz.value)
                var zero_plate = parseFloat(mod.tz.value)
                var str = "G91\n"
                str += "G38.2 Z-70 F90\n"
                str += "G90\n"
                str += "G10 L20 P2 Z" + zero_plate + "\n"
                str += "G91\n"
                str += "G0 Z" + jog_height + "\n"
                str += "G90\n"
                var obj = {}
                obj.type = 'command'
                obj.name = mod.name + '.nc'
                obj.contents = str
                outputs.file.event(obj)
            } // end if
        })
        div.appendChild(btn)

        div.appendChild(document.createElement('br'))

        div.appendChild(document.createTextNode('\u00a0zero plate thickness: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.tz = input
        div.appendChild(document.createTextNode(' (mm)'))
        div.appendChild(document.createElement('hr'))

        //
        // origin x (mm)
        //
        div.appendChild(document.createTextNode('custom origin:'))
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
        //
	// svg
	//
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
	circle.setAttribute("cx", 25)
	circle.setAttribute("cy", 25)
	circle.setAttribute("r", 15)
        circle.setAttribute("fill", "red")
	div.appendChild(circle)

// Vanilla js
var ns = 'http://www.w3.org/2000/svg'

var svg = document.createElementNS(ns, 'svg')
svg.setAttributeNS(null, 'width', '100%')
svg.setAttributeNS(null, 'height', '100%')
div.appendChild(svg)
var rect = document.createElementNS(ns, 'rect')
rect.setAttributeNS(null, 'width', 100)
rect.setAttributeNS(null, 'height', 100)
rect.setAttributeNS(null, 'fill', '#f06')
svg.appendChild(rect)

        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('move to custom origin')
        span.appendChild(text)
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            var x0 = parseFloat(mod.ox.value)
            var y0 = parseFloat(mod.oy.value)
            var z0 = 0
            var zjog = parseFloat(mod.jz.value)
            var str = " G55 G90 G0 X" + x0 + " Y" + y0 + "\n" // go to x0 y0 in abs coordinates 
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
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
        btn.appendChild(document.createTextNode('+ Y'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "G91 G21 G0 Y" + mod.step + "\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

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
            var str = "G91 G21 G0 Z" + mod.step + "\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
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
            var str = "G91 G21 G0 X-" + mod.step + "\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('XY0'))
        btn.addEventListener('click', function() {
            var warn = confirm("Warning: This will set the new zero for the X and Y axis")
            if (warn == true) {
                //
                // Check step
                //
                check_step()
                //
                // Create message
                //
                var str = "G28.3 X0 Y0\n"
                //
                // send command
                //
                var obj = {}
                obj.type = 'command'
                obj.name = mod.name + '.nc'
                obj.contents = str
                mods.output(mod, 'file', obj)
            } // close if
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
            var str = "G91 G21 G0 X" + mod.step + "\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('Z0'))
        btn.addEventListener('click', function() {
            var warn = confirm("Warning: This will set the new zero for the Z axis")
            if (warn == true) {
                //
                // Create message
                //
                var str = "G28.3 Z0\n"
                //
                // send command
                //
                var obj = {}
                obj.type = 'command'
                obj.name = mod.name + '.nc'
                obj.contents = str
                mods.output(mod, 'file', obj)
            } // close if
        })
        div.appendChild(btn)


        div.appendChild(document.createElement('br'))

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))


        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('- Y'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = "G91 G21 G0 Y-" + mod.step + "\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createTextNode('\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'))

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
            var str = "G91 G21 G0 Z-" + mod.step + "\n"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = mod.name + '.nc'
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
        // Units are mm
        //
        if (mod.range_big.checked) {
            mod.step = 5
        } else if (mod.range_medium.checked) {
            mod.step = 1
        } else if (mod.range_small.checked) {
            mod.step = 0.1
        }
    }




    function make_path() {
        var dx = 25.4 * mod.width / mod.dpi
        var nx = mod.width
        var cut_speed = 60 * parseFloat(mod.speed.value) // check units input should be mm/s and output is mm/min
        var plunge_speed = 60 * parseFloat(mod.plunge.value) // check units input should be mm/s
        var jog_height = parseFloat(mod.jz.value) // input in mm
        var spindle_speed = parseFloat(mod.spindle_speed.value)
        var tool = mod.tool
        var scale = dx / (nx - 1)
        var x0 = parseFloat(mod.ox.value)
        var y0 = parseFloat(mod.oy.value)
        var z0 = 0
        var xoffset = x0
        var yoffset = y0
        var zoffset = z0
        str = "%\n" // tape start
        // Clear all state: XY plane, inch mode, cancel diameter compensation, cancel length offset
        // coordinate system 2, cancel motion, non-incremental motion, feed/minute mode
        str += "G17\n" // select XY plane
        str += "G21\n" // mm mode
        str += "G40\n" // cancel diameter compensation
        str += "G49\n" // cancel tool length compensation
        // Othermill assumes G55 coordinate system
        str += "G55\n" // custom coordinate system 2
        str += "G80\n" // stop axis movement
        str += "G90\n" // non incremental motion
        str += "G94\n" // feed rate mode: units per minute
        str += "T" + tool + "M06\n" // tool selection, tool change
        str += "F" + cut_speed.toFixed(4) + "\n" // feed rate
        str += "S" + spindle_speed + "\n" // spindle speed
        str += "G00Z" + jog_height.toFixed(4) + "\n" // move up before starting spindle
        str += "M03\n" // spindle on clockwise
        str += "G04 P1\n" // give spindle 1 second to spin up
        //
        // follow segments
        //
        for (var seg = 0; seg < mod.path.length; ++seg) {
            var x = xoffset + scale * mod.path[seg][0][0]
            var y = yoffset + scale * mod.path[seg][0][1]
            var z = zoffset + scale * mod.path[seg][0][2]
            //
            // move up to starting point
            //
            str += "Z" + jog_height.toFixed(4) + "\n"
            str += "G00X" + x.toFixed(4) + "Y" + y.toFixed(4) + "Z" + jog_height.toFixed(4) + "\n"
            //
            // move down
            //
            str += "G01Z" + z.toFixed(4) + " F" + plunge_speed.toFixed(4) + "\n"
            str += "F" + cut_speed.toFixed(4) + "\n" //restore XY feed rate
            for (var pt = 1; pt < mod.path[seg].length; ++pt) {
                //
                // move to next point
                //
                x = xoffset + scale * mod.path[seg][pt][0]
                y = yoffset + scale * mod.path[seg][pt][1]
                z = zoffset + scale * mod.path[seg][pt][2]
                str += "G01X" + x.toFixed(4) + "Y" + y.toFixed(4) + "Z" + z.toFixed(4) + "\n"
            }
        }
        //
        // finish
        //
        str += "G00Z" + jog_height.toFixed(4) + "\n" // move up before stopping spindle
        str += "M05\n" // spindle stop
        str += "M30\n" // program end and reset
        str += "%\n" // tape end




        //
        // output string
        //
        var obj = {}
        obj.type = 'file'
        obj.name = mod.name + '.nc'
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
