//
// GCC vinyl cutter
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// modified by Francisco Sanchez Arroyo 06-Feb-2020
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
    var name = 'GCC vinyl cutter Relative'
    //
    // initialization
    //
    var init = function() {
        mod.force.value = 50
        mod.speed.value = 2
    }
    //
    // inputs
    //
    var inputs = {
        toolpath: {
            type: 'object',
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
            type: 'object',
            event: function(str) {
                obj = {}
                obj.type = 'file'
                obj.name = mod.name + '.hpgl'
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

        //
        // manual move to origin
        //
        div.appendChild(document.createTextNode('set origin:'))
        div.appendChild(document.createElement('br'))

        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_big'
        div.appendChild(input)
        mod.range_big = input
        div.appendChild(document.createTextNode('50mm'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_medium'
        div.appendChild(input)
        mod.range_medium = input
        mod.range_medium.checked = true
        div.appendChild(document.createTextNode('10mm'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'range'
        input.id = mod.div.id + 'range_small'
        div.appendChild(input)
        mod.range_small = input
        div.appendChild(document.createTextNode('1mm'))
        div.appendChild(document.createElement('br'))



        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('left'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = ";;PR;VS50;PU -" + mod.step + ",0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'left.hpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('right'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = ";;PR;VS50;PU " + mod.step + ",0;"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'right.hpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('in'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = ";;PR;VS50;PU 0,-" + mod.step + ";"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'in.hpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)
        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('out'))
        btn.addEventListener('click', function() {
            //
            // Check step
            //
            check_step()
            //
            // Create message
            //
            var str = ";;PR;VS50;PU 0," + mod.step + ";"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'out.hpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('br'))

        div.appendChild(document.createTextNode('set parameters:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('\u00A0\u00A0\u00A0force (g): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.force = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('speed (cm/s): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.speed = input
        div.appendChild(document.createElement('br'))

        var btn = document.createElement('button')
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('cut test'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var force = parseFloat(mod.force.value)
            var speed = parseFloat(mod.speed.value)
            var str = ";;PR;!ST1;!FS" + force + ";VS" + speed + ";\n" // init string
            var xc = 9 * 40 // x coordinate of circle centre
            var yc = 9 * 40 // y coordinate of circle centre
            str += "PU " + xc + "," + yc + ";\n" // go to circle centre
            str += "CI " + xc + ";\n" // make a circle radius 9 mm
            var rx = -5 * 40 // relative dx from x=9 to x=4
            var ry = -5 * 40
            str += "PU " + rx + "," + ry + ";\n" // go to bottom left corner of the square
            str += "PD 400,0,0,400,-400,0,0,-400;\n" // cut a 100mm square
            var rx = -4 * 40 // relative dx from x=4 to x=0
            var ry = -4 * 40
            str += "PU " + rx + "," + ry + ";\n" // go to starting point (0,0)
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'test.hpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('br'))


        div.appendChild(document.createTextNode('image origin:'))
        div.appendChild(document.createElement('br'))

        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'topleft'
        div.appendChild(input)
        mod.topleft = input
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'topmid'
        div.appendChild(input)
        mod.topmid = input
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
        input.id = mod.div.id + 'midleft'
        div.appendChild(input)
        mod.midleft = input
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'midmid'
        div.appendChild(input)
        mod.midmid = input
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'midright'
        div.appendChild(input)
        mod.midright = input

        div.appendChild(document.createElement('br'))

        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'botleft'
        div.appendChild(input)
        mod.botleft = input
        mod.botleft.checked = true
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'origin'
        input.id = mod.div.id + 'botmid'
        div.appendChild(input)
        mod.botmid = input
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


    function check_step() {
        //
        // Checks how big is the manual move step 
        // Units are mm x 40 eg. 10mm is 400 units
        //
        if (mod.range_big.checked) {
            mod.step = 2000
            console.log('ten checked')
        } else if (mod.range_medium.checked) {
            mod.step = 400
        } else if (mod.range_small.checked) {
            mod.step = 40
        }
    }



    function make_path() {
        var dx = 25.4 * mod.width / mod.dpi
        var dy = 25.4 * mod.height / mod.dpi
        var nx = mod.width
        var ny = mod.height
        var force = parseFloat(mod.force.value)
        var speed = parseFloat(mod.speed.value)
        var str = ";;PR;!ST1;!FS" + force + ";VS" + speed + ";\n" // init string
        var scale = 40.0 * dx / (nx - 1.0) // 40 steps per mm
        var ox = 0
        var oy = 0
        if (mod.botleft.checked) {
            var xoffset = 40.0 * ox
            var yoffset = 40.0 * oy
        } else if (mod.botmid.checked) {
            var xoffset = 40.0 * (ox - dx) / 2
            var yoffset = 40.0 * oy
        } else if (mod.botright.checked) {
            var xoffset = 40.0 * (ox - dx)
            var yoffset = 40.0 * oy
        } else if (mod.midleft.checked) {
            var xoffset = 40.0 * ox
            var yoffset = 40.0 * (oy - dy) / 2
        } else if (mod.midmid.checked) {
            var xoffset = 40.0 * (ox - dx) / 2
            var yoffset = 40.0 * (oy - dy) / 2
        } else if (mod.midright.checked) {
            var xoffset = 40.0 * (ox - dx)
            var yoffset = 40.0 * (oy - dy) / 2
        } else if (mod.topleft.checked) {
            var xoffset = 40.0 * ox
            var yoffset = 40.0 * (oy - dy)
        } else if (mod.topmid.checked) {
            var xoffset = 40.0 * (ox - dx) / 2
            var yoffset = 40.0 * (oy - dy)
        } else if (mod.topright.checked) {
            var xoffset = 40.0 * (ox - dx)
            var yoffset = 40.0 * (oy - dy)
        }

        //
        // loop over segments relative coordinates
        //
        var lx = 0 // init the last x coordinate
        var ly = 0 // init the last y coordinate 
        var rx = 0 // init relative movement in x
        var ry = 0 // init relative movement in y
        for (var seg = 0; seg < mod.path.length; ++seg) {
            x = xoffset + scale * mod.path[seg][0][0] // x destination in steps units
            y = yoffset + scale * mod.path[seg][0][1]
            rx = x - lx // calculate the relative x movement
            ry = y - ly // calculate the relative y movement
            str += "PU" + rx.toFixed(0) + "," + ry.toFixed(0) + ";\n" // move up to start point
            str += "PD 0,0;\n" // pen down
            lx = x // store last x coordinate
            ly = y // store last y coordinate
            //
            // loop over points
            //
            for (var pt = 1; pt < mod.path[seg].length; ++pt) {
                x = xoffset + scale * mod.path[seg][pt][0] // x destination in steps units
                y = yoffset + scale * mod.path[seg][pt][1]
                rx = x - lx // calculate the relative x movement
                ry = y - ly // calculate the relative y movement
                str += "PD" + rx.toFixed(0) + "," + ry.toFixed(0) + ";\n" // move down
                lx = x // store last x coordinate
                ly = y // store last y coordinate
            }
            str += "PU 0,0;\n" // move up at last point
        }
        //
        // return to origin
        //
        str += "PU " + (-1) * lx.toFixed(0) + ", " + (-1) * ly.toFixed(0) + ";\n" // pen up to origin, relative movement is (-lx,-ly)


        //
        // send the string
        //
        outputs.file.event(str)
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
