//
// Silhouette Cameo 2 vinyl cutter
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez Arroyo 20-Feb-2020
// 
// GPGL Language 
// Uses \x03 ASCII control character 'End of Text' ETX as a separator (equivalent to ; in HPGL)
// I am using .gpgl but any file extension works
// Resolution 20 steps per 1 mm
// FN0 set portrait mode (+x media out, +y head left), FN1 landscape mode (+x head left, +y media in) FN command seems to be persistent. This sets the Abs origin
// SO0 set origin not working?
// H homes the machine on the left end
// FXpres sets the force with pres 1:31 untested
// !vel sets velocity with vel 1:10 untested
// M x,y move absolute coordinates with pen up only accepts positive values
// O x,y move relative coordinates with pen up
// D x1,y1,x1,y2... draw absolute with pen down (only positive values?)
// E x1,y1,x1,y2... draw relative with pen down
// more commands at https://www.ohthehugemanatee.net/2011/07/gpgl-reference-courtesy-of-graphtec/
//
// Debugging notes:
// - When using Neil's deviceserver.js it takes around 3s to send 27 chars. But echo the string the the device or cat the file to the device it works just fine. I modified deviceserver.js to send the file at once.
// - The coordinate system of this machine is confusing. When you load a page Abs(0,0) is at the top right even though the page is aligned to the left. Home command moves the head to the left but keeps the abs zero intact. +x is to the left unlike Roland machines.
// - Moving the machine with the front panel keys sets the new Abs(0,0). That means the machine won't move to the right or above this point. For some reason SO0 does not set the zero.
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
    var name = 'Silhouette Cameo 2'
    //
    // initialization
    //
    var init = function() {
        mod.force.value = 10
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
                obj.name = mod.name + '.gpgl'
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

        var btn = document.createElement('button')
        //btn.disabled = true
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('set landscape'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var str = "M0,0\x03"
            str += "FN1\x03"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'custom.gpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)

        div.appendChild(document.createElement('br'))

        div.appendChild(document.createTextNode('set plot origin:'))
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

        //
        // left/right
        //
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
            var str = "O" + mod.step + ",0\x03"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'left.gpgl'
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
            var str = "O-" + mod.step + ",0\x03"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'right.gpgl'
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
            var str = "O0," + mod.step + "\x03"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'in.gpgl'
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
            var str = "O0,-" + mod.step + "\x03"
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'out.gpgl'
            obj.contents = str
            mods.output(mod, 'file', obj)
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('br'))





        div.appendChild(document.createTextNode('set parameters:'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('force (1-31): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.force = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('speed (1-10): '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.speed = input
        div.appendChild(document.createElement('br'))


        var btn = document.createElement('button')
        //btn.disabled = true
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('test cut'))
        btn.addEventListener('click', function() {
            //
            // Create message
            //
            var force = parseFloat(mod.force.value)
            var speed = parseFloat(mod.speed.value)
            var str = "!" + speed + "\x03" // set speed
            str += "FX" + force + "\x03" // set force
            str += "E200,0"
            str += ",0,200"
            str += ",-200,0"
            str += ",0,-200\x03"
            str += "O 0,0\x03" // pen up
            //
            // send command
            //
            var obj = {}
            obj.type = 'command'
            obj.name = 'testcut.gpgl'
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
        // Units are mm x 20 eg. 10mm is 200 units
        //
        if (mod.range_big.checked) {
            mod.step = 1000
            console.log('ten checked')
        } else if (mod.range_medium.checked) {
            mod.step = 200
        } else if (mod.range_small.checked) {
            mod.step = 20
        }
    }

    function make_path() {
        var dx = 25.4 * mod.width / mod.dpi
        var dy = 25.4 * mod.height / mod.dpi
        var nx = mod.width
        var ny = mod.height
        var force = parseFloat(mod.force.value)
        var speed = parseFloat(mod.speed.value)
        var str = "!" + speed + "\x03" // set speed
        str += "FX" + force + "\x03" // set force
        var scale = 20.0 * dx / (nx - 1.0) // 20 steps per mm
        var ox = 0
        var oy = 0

        if (mod.botleft.checked) {
            var xoffset = 0.0 * ox
            var yoffset = 20.0 * oy
        } else if (mod.botmid.checked) {
            var xoffset = 20.0 * (ox - dx) / 2
            var yoffset = 20.0 * oy
        } else if (mod.botright.checked) {
            var xoffset = 20.0 * (ox - dx)
            var yoffset = 20.0 * oy
        } else if (mod.midleft.checked) {
            var xoffset = 20.0 * ox
            var yoffset = 20.0 * (oy - dy) / 2
        } else if (mod.midmid.checked) {
            var xoffset = 20.0 * (ox - dx) / 2
            var yoffset = 20.0 * (oy - dy) / 2
        } else if (mod.midright.checked) {
            var xoffset = 20.0 * (ox - dx)
            var yoffset = 20.0 * (oy - dy) / 2
        } else if (mod.topleft.checked) {
            var xoffset = 20.0 * ox
            var yoffset = 20.0 * (oy - dy)
        } else if (mod.topmid.checked) {
            var xoffset = 20.0 * (ox - dx) / 2
            var yoffset = 20.0 * (oy - dy)
        } else if (mod.topright.checked) {
            var xoffset = 20.0 * (ox - dx)
            var yoffset = 20.0 * (oy - dy)
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
            str += "O" + (-1) * rx.toFixed(0) + "," + (-1) * ry.toFixed(0) + "\x03\n" // move up to start point
            str += "E 0,0\x03\n" // pen down
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
                str += "E " + (-1) * rx.toFixed(0) + "," + (-1) * ry.toFixed(0) + "\x03\n" // append next point to the string and new line
                lx = x // store last x coordinate
                ly = y // store last y coordinate
            }
            //str += "\x03\n" // terminate the E command
            str += "O 0,0\x03\n" // pen up at last point
        }
        //
        // return to origin
        //
        str += "O " + lx.toFixed(0) + ", " + ly.toFixed(0) + "\x03" // pen up to origin, relative movement is (-lx,-ly)

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
