//
// image crop
//
// Sol Bekic
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
    var name = 'image crop'
    //
    // initialization
    //
    var init = function() {}
    //
    // inputs
    //
    var inputs = {
        image: {
            type: 'RGBA',
            event: function(evt) {
                mod.input = evt.detail
                crop_image()
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        image: {
            type: 'RGBA',
            event: function() {
                var ctx = mod.img.getContext("2d")
                var img = ctx.getImageData(0, 0, mod.img.width, mod.img.height)
                mods.output(mod, 'image', img)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // on-screen drawing canvas
        //
        var canvas = document.createElement('canvas')
        canvas.width = mods.ui.canvas
        canvas.height = mods.ui.canvas
        canvas.style.backgroundColor = 'rgb(255,255,255)'
        div.appendChild(canvas)
        mod.canvas = canvas
        div.appendChild(document.createElement('br'))
        //
        // values
        //
        div.appendChild(document.createTextNode('left: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cl = input
        div.appendChild(document.createTextNode('right: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cr = input
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('top: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.ct = input
        div.appendChild(document.createTextNode('bottom: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.cb = input
        div.appendChild(document.createElement('br'))
        //
        // crop button
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('crop'))
        btn.addEventListener('click', crop_image)
        div.appendChild(btn)
        //
        // off-screen image canvas
        //
        var canvas = document.createElement('canvas')
        mod.img = canvas
    }
    //
    // local functions
    //
    // crop image
    function crop_image() {
        if (!mod.input) return

        var cl = parseFloat(mod.cl.value)
        var cr = parseFloat(mod.cr.value)
        var ct = parseFloat(mod.ct.value)
        var cb = parseFloat(mod.cb.value)

        var cw = mod.input.width - cl - cr
        var ch = mod.input.width - ct - cb

        // preview image
        var ctx = mod.img.getContext("2d")
        ctx.canvas.width = mod.input.width
        ctx.canvas.height = mod.input.height
        ctx.putImageData(mod.input, 0, 0)

        if (mod.img.width > mod.img.height) {
            var x0 = 0
            var y0 = mod.canvas.height * .5 * (1 - mod.img.height / mod.img.width)
            var w = mod.canvas.width
            var h = mod.canvas.width * mod.input.height / mod.img.width
            var m = w / mod.input.width
        } else {
            var x0 = mod.canvas.width * .5 * (1 - mod.img.width / mod.img.height)
            var y0 = 0
            var w = mod.canvas.height * mod.input.width / mod.img.height
            var h = mod.canvas.height
            var m = h / mod.img.height
        }
        var ctx = mod.canvas.getContext("2d")
        ctx.clearRect(0, 0, mod.canvas.width, mod.canvas.height)
        ctx.drawImage(mod.img, x0, y0, w, h)
        ctx.strokeStyle = 'red'
        ctx.strokeWidth = 2
        ctx.strokeRect(x0 + cl * m, y0 + ct * m, cw * m, ch * m)

        // output image
        var ctx = mod.img.getContext("2d")
        ctx.canvas.width = cw
        ctx.canvas.height = ch
        ctx.putImageData(mod.input, -cl, -ct)
        outputs.image.event()
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
