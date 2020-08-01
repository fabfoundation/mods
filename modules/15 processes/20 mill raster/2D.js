//
// mill raster 2D
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2016
// Modified by Francisco Sanchez Arroyo 31-Jan-2020
// Modified by Sol Bekic 21-Jul-2020
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
    var name = 'mill raster 2D'
    //
    // initialization
    //
    var init = function() {
        mod.dia_in.value = 0.0156
        mod.dia_mm.value = 25.4 * parseFloat(mod.dia_in.value)
        mod.cut_in.value = 0.004
        mod.cut_mm.value = 25.4 * parseFloat(mod.cut_in.value)
        mod.max_in.value = 0.004
        mod.max_mm.value = 25.4 * parseFloat(mod.max_in.value)
        mod.number.value = 4
        mod.stepover.value = 0.5
        mod.merge.value = 1
        mod.sort.checked = true
    }
    //
    // inputs
    //
    var inputs = {
        imageInfo: {
            type: 'object',
            event: function(evt) {
                mod.name = evt.detail.name
                mod.dpi = evt.detail.dpi
                mod.width = evt.detail.width
                mod.height = evt.detail.height
                var ctx = mod.img.getContext("2d")
                ctx.canvas.width = mod.width
                ctx.canvas.height = mod.height
            }
        },
        path: {
            type: 'array',
            event: function(evt) {
                if (mod.label.nodeValue == 'calculating') {
                    draw_path(evt.detail)
                    accumulate_path(evt.detail)
                    mod.offsetCount += 1
                    if ((mod.offsetCount != parseInt(mod.number.value)) && (evt.detail.length > 0)) {
                        mod.offset += parseFloat(mod.stepover.value)
                        outputs.offset.event()
                    } else {
                        mod.label.nodeValue = 'calculate'
                        mod.labelspan.style.fontWeight = 'normal'
                        merge_path()
                        clear_path()
                        draw_path(mod.path)
                        draw_connections()
                        add_depth()
                        outputs.toolpath.event()
                    }
                }
            }
        },
        settings: {
            type: 'object',
            event: function(evt) {
                set_values(evt.detail)
            }
        }
    }
    //
    // outputs
    //
    var outputs = {
        diameter: {
            type: 'number',
            event: function() {
                mods.output(mod, 'diameter', Math.ceil(mod.dpi * mod.dia_in.value))
            }
        },
        offset: {
            type: 'number',
            event: function() {
                var pixels = mod.offset * parseFloat(mod.dia_in.value) * mod.dpi
                mods.output(mod, 'offset', pixels)
            }
        },
        toolpath: {
            type: 'object',
            event: function() {
                cmd = {}
                cmd.path = mod.path
                cmd.name = mod.name
                cmd.dpi = mod.dpi
                cmd.width = mod.width
                cmd.height = mod.height
                cmd.depth = mod.depth
                mods.output(mod, 'toolpath', cmd)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
        //
        // tool diameter
        //
        div.appendChild(document.createTextNode('tool diameter'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('mm: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function() {
            mod.dia_in.value = parseFloat(mod.dia_mm.value) / 25.4
        })
        div.appendChild(input)
        mod.dia_mm = input
        div.appendChild(document.createTextNode(' in: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function() {
            mod.dia_mm.value = parseFloat(mod.dia_in.value) * 25.4
        })
        div.appendChild(input)
        mod.dia_in = input
        div.appendChild(document.createElement('br'))
        //
        // cut depth
        //
        div.appendChild(document.createTextNode('cut depth'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('mm: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function() {
            mod.cut_in.value = parseFloat(mod.cut_mm.value) / 25.4
        })
        div.appendChild(input)
        mod.cut_mm = input
        div.appendChild(document.createTextNode(' in: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function() {
            mod.cut_mm.value = parseFloat(mod.cut_in.value) * 25.4
        })
        div.appendChild(input)
        mod.cut_in = input
        div.appendChild(document.createElement('br'))
        //
        // max depth
        //
        div.appendChild(document.createTextNode('max depth'))
        div.appendChild(document.createElement('br'))
        div.appendChild(document.createTextNode('mm: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function() {
            mod.max_in.value = parseFloat(mod.max_mm.value) / 25.4
        })
        div.appendChild(input)
        mod.max_mm = input
        div.appendChild(document.createTextNode(' in: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        input.addEventListener('input', function() {
            mod.max_mm.value = parseFloat(mod.max_in.value) * 25.4
        })
        div.appendChild(input)
        mod.max_in = input
        div.appendChild(document.createElement('br'))
        //
        // offset number
        //
        div.appendChild(document.createTextNode('offset number: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.number = input
        div.appendChild(document.createTextNode(' (0 = fill)'))
        div.appendChild(document.createElement('br'))
        //
        // offset stepover
        //
        div.appendChild(document.createTextNode('offset stepover: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.stepover = input
        div.appendChild(document.createTextNode(' (1 = diameter)'))
        div.appendChild(document.createElement('br'))
        //
        // direction
        //
        div.appendChild(document.createTextNode('direction: '))
        div.appendChild(document.createTextNode('climb'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'direction'
        input.id = mod.div.id + 'climb'
        input.checked = true
        div.appendChild(input)
        mod.climb = input
        div.appendChild(document.createTextNode(' conventional'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'direction'
        input.id = mod.div.id + 'conventional'
        div.appendChild(input)
        mod.conventional = input
        div.appendChild(document.createElement('br'))
        //
        // path merge
        //
        div.appendChild(document.createTextNode('path merge: '))
        var input = document.createElement('input')
        input.type = 'text'
        input.size = 6
        div.appendChild(input)
        mod.merge = input
        div.appendChild(document.createTextNode(' (1 = diameter)'))
        div.appendChild(document.createElement('br'))
        //
        // path order
        //
        div.appendChild(document.createTextNode('path order: '))
        div.appendChild(document.createTextNode('forward'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'order'
        input.id = mod.div.id + 'forward'
        input.checked = true
        div.appendChild(input)
        mod.forward = input
        div.appendChild(document.createTextNode(' reverse'))
        var input = document.createElement('input')
        input.type = 'radio'
        input.name = mod.div.id + 'order'
        input.id = mod.div.id + 'reverse'
        div.appendChild(input)
        mod.reverse = input
        div.appendChild(document.createElement('br'))
        //
        // sort distance
        //
        div.appendChild(document.createTextNode('sort distance: '))
        var input = document.createElement('input')
        input.type = 'checkbox'
        input.id = mod.div.id + 'sort'
        div.appendChild(input)
        mod.sort = input
        div.appendChild(document.createElement('br'))
        //
        // calculate
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode('calculate')
        mod.label = text
        span.appendChild(text)
        mod.labelspan = span
        btn.appendChild(span)
        btn.addEventListener('click', function() {
            mod.label.nodeValue = 'calculating'
            mod.labelspan.style.fontWeight = 'bold'
            mod.offset = 0.5
            mod.offsetCount = 0
            mod.path = []
            clear_path()
            outputs.diameter.event()
            outputs.offset.event()
        })
        div.appendChild(btn)
        div.appendChild(document.createTextNode(' '))
        //
        // view
        //
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        btn.appendChild(document.createTextNode('view'))
        btn.addEventListener('click', function() {
            var win = window.open('')
            var btn = document.createElement('button')
            btn.appendChild(document.createTextNode('close'))
            btn.style.padding = mods.ui.padding
            btn.style.margin = 1
            btn.addEventListener('click', function() {
                win.close()
            })
            win.document.body.appendChild(btn)
            win.document.body.appendChild(document.createElement('br'))
            var svg = document.getElementById(mod.div.id + 'svg')
            var clone = svg.cloneNode(true)
            clone.setAttribute('width', mod.img.width)
            clone.setAttribute('height', mod.img.height)
            win.document.body.appendChild(clone)
        })
        div.appendChild(btn)
        div.appendChild(document.createElement('br'))
        //
        // on-screen SVG
        //
        var svgNS = "http://www.w3.org/2000/svg"
        var svg = document.createElementNS(svgNS, "svg")
        svg.setAttribute('id', mod.div.id + 'svg')
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/",
            "xmlns:xlink", "http://www.w3.org/1999/xlink")
        svg.setAttribute('width', mods.ui.canvas)
        svg.setAttribute('height', mods.ui.canvas)
        svg.style.backgroundColor = 'rgb(255,255,255)'
        var g = document.createElementNS(svgNS, 'g')
        g.setAttribute('id', mod.div.id + 'g')
        svg.appendChild(g)
        div.appendChild(svg)
        div.appendChild(document.createElement('br'))
        //
        // off-screen image canvas
        //
        var canvas = document.createElement('canvas')
        mod.img = canvas
    }
    //
    // local functions
    //
    // set_values
    //
    function set_values(settings) {
        for (var s in settings) {
            switch (s) {
                case 'tool diameter (in)':
                    mod.dia_in.value = settings[s]
                    mod.dia_mm.value = parseFloat(mod.dia_in.value) * 25.4
                    break
                case 'cut depth (in)':
                    mod.cut_in.value = settings[s]
                    mod.cut_mm.value = parseFloat(mod.cut_in.value) * 25.4
                    break
                case 'max depth (in)':
                    mod.max_in.value = settings[s]
                    mod.max_mm.value = parseFloat(mod.max_in.value) * 25.4
                    break
                case 'tool diameter (mm)':
                    mod.dia_mm.value = settings[s]
                    mod.dia_in.value = parseFloat(mod.dia_mm.value) / 25.4
                    break
                case 'cut depth (mm)':
                    mod.cut_mm.value = settings[s]
                    mod.cut_in.value = parseFloat(mod.cut_mm.value) / 25.4
                    break
                case 'max depth (mm)':
                    mod.max_mm.value = settings[s]
                    mod.max_in.value = parseFloat(mod.max_mm.value) / 25.4
                    break
                case 'offset number':
                    mod.number.value = settings[s]
                case 'overlap':
                case 'offset stepover':
                    mod.stepover.value = settings[s]
                    break
            }
        }
    }
    //
    // clear_path
    //
    function clear_path() {
        var svg = document.getElementById(mod.div.id + 'svg')
        svg.setAttribute('viewBox', "0 0 " + (mod.img.width - 1) + " " + (mod.img.height - 1))
        var g = document.getElementById(mod.div.id + 'g')
        svg.removeChild(g)
        var g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('id', mod.div.id + 'g')
        svg.appendChild(g)
    }
    //
    // accumulate_path
    //    todo: replace inefficient insertion sort
    //    todo: move sort out of main thread
    //
    function accumulate_path(path) {
        var forward = mod.forward.checked
        var conventional = mod.conventional.checked
        var sort = mod.sort.checked
        for (var segnew = 0; segnew < path.length; ++segnew) {
            if (conventional)
                path[segnew].reverse()
            if (mod.path.length == 0)
                mod.path.splice(0, 0, path[segnew])
            else if (sort) {
                var xnew = path[segnew][0][0]
                var ynew = path[segnew][0][1]
                var dmin = Number.MAX_VALUE
                var segmin = -1
                for (var segold = 0; segold < mod.path.length; ++segold) {
                    var xold = mod.path[segold][0][0]
                    var yold = mod.path[segold][0][1]
                    var dx = xnew - xold
                    var dy = ynew - yold
                    var d = Math.sqrt(dx * dx + dy * dy)
                    if (d < dmin) {
                        dmin = d
                        segmin = segold
                    }
                }
                if (forward)
                    mod.path.splice(segmin + 1, 0, path[segnew])
                else
                    mod.path.splice(segmin, 0, path[segnew])
            } else {
                if (forward)
                    mod.path.splice(mod.path.length, 0, path[segnew])
                else
                    mod.path.splice(0, 0, path[segnew])
            }
        }
    }
    //
    // merge_path
    //
    function merge_path() {
        var dmerge = mod.dpi * parseFloat(mod.merge.value) * parseFloat(mod.dia_in.value)
        var seg = 0
        while (seg < (mod.path.length - 1)) {
            var xold = mod.path[seg][mod.path[seg].length - 1][0]
            var yold = mod.path[seg][mod.path[seg].length - 1][1]
            var xnew = mod.path[seg + 1][0][0]
            var ynew = mod.path[seg + 1][0][1]
            var dx = xnew - xold
            var dy = ynew - yold
            var d = Math.sqrt(dx * dx + dy * dy)
            if (d < dmerge)
                mod.path.splice(seg, 2, mod.path[seg].concat(mod.path[seg + 1]))
            else
                seg += 1
        }
    }
    //
    // add_depth
    //
    function add_depth() {
        var cut = parseFloat(mod.cut_in.value)
        var max = parseFloat(mod.max_in.value)
        var newpath = []
        for (var seg = 0; seg < mod.path.length; ++seg) {
            var depth = cut
            if ((mod.path[seg][0][0] == mod.path[seg][mod.path[seg].length - 1][0]) &&
                (mod.path[seg][0][0] == mod.path[seg][mod.path[seg].length - 1][0])) {
                var newseg = []
                while (depth <= max) {
                    var idepth = -Math.round(mod.dpi * depth)
                    for (var pt = 0; pt < mod.path[seg].length; ++pt) {
                        var point = mod.path[seg][pt].concat(idepth)
                        newseg.splice(newseg.length, 0, point)
                    }
                    if (depth == max)
                        break
                    depth += cut
                    if (depth > max)
                        depth = max
                }
                newpath.splice(newpath.length, 0, newseg)
            } else {
                var newseg = []
                while (depth <= max) {
                    var idepth = -Math.round(mod.dpi * depth)
                    for (var pt = 0; pt < mod.path[seg].length; ++pt) {
                        var point = mod.path[seg][pt].concat(idepth)
                        newseg.splice(newseg.length, 0, point)
                    }
                    newpath.splice(newpath.length, 0, newseg)
                    newseg = []
                    if (depth == max)
                        break
                    depth += cut
                    if (depth > max)
                        depth = max
                }
            }
        }
        mod.path = newpath
        mod.depth = Math.round(parseFloat(mod.max_in.value) * mod.dpi)
    }
    //
    // draw_path
    //
    function draw_path(path) {
        var g = document.getElementById(mod.div.id + 'g')
        var h = mod.img.height
        var w = mod.img.width
        var xend = null
        var yend = null
        //
        // loop over segments
        //
        for (var segment = 0; segment < path.length; ++segment) {
            if (path[segment].length > 1) {
                //
                // loop over points
                //
                for (var point = 1; point < path[segment].length; ++point) {
                    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
                    line.setAttribute('stroke', 'black')
                    line.setAttribute('stroke-width', 1)
                    line.setAttribute('stroke-linecap', 'round')
                    var x1 = path[segment][point - 1][0]
                    var y1 = h - path[segment][point - 1][1] - 1
                    var x2 = path[segment][point][0]
                    var y2 = h - path[segment][point][1] - 1
                    xend = x2
                    yend = y2
                    line.setAttribute('x1', x1)
                    line.setAttribute('y1', y1)
                    line.setAttribute('x2', x2)
                    line.setAttribute('y2', y2)
                    var dx = x2 - x1
                    var dy = y2 - y1
                    var d = Math.sqrt(dx * dx + dy * dy)
                    if (d > 0) {
                        nx = 6 * dx / d
                        ny = 6 * dy / d
                        var tx = 3 * dy / d
                        var ty = -3 * dx / d
                        g.appendChild(line)
                        triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
                        triangle.setAttribute('points', x2 + ',' + y2 + ' ' + (x2 - nx + tx) + ',' + (y2 - ny + ty) +
                            ' ' + (x2 - nx - tx) + ',' + (y2 - ny - ty))
                        triangle.setAttribute('fill', 'black')
                        g.appendChild(triangle)
                    }
                }
            }
        }
    }
    //
    // draw_connections
    //
    function draw_connections() {
        var g = document.getElementById(mod.div.id + 'g')
        var h = mod.img.height
        var w = mod.img.width
        //
        // loop over segments
        //
        for (var segment = 1; segment < mod.path.length; ++segment) {
            //
            // draw connection from previous segment
            //
            var line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
            line.setAttribute('stroke', 'red')
            line.setAttribute('stroke-width', 1)
            line.setAttribute('stroke-linecap', 'round')
            var x1 = mod.path[segment - 1][mod.path[segment - 1].length - 1][0]
            var y1 = h - mod.path[segment - 1][mod.path[segment - 1].length - 1][1] - 1
            var x2 = mod.path[segment][0][0]
            var y2 = h - mod.path[segment][0][1] - 1
            line.setAttribute('x1', x1)
            line.setAttribute('y1', y1)
            line.setAttribute('x2', x2)
            line.setAttribute('y2', y2)
            var dx = x2 - x1
            var dy = y2 - y1
            var d = Math.sqrt(dx * dx + dy * dy)
            if (d > 0) {
                nx = 6 * dx / d
                ny = 6 * dy / d
                var tx = 3 * dy / d
                var ty = -3 * dx / d
                g.appendChild(line)
                triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
                triangle.setAttribute('points', x2 + ',' + y2 + ' ' + (x2 - nx + tx) + ',' + (y2 - ny + ty) +
                    ' ' + (x2 - nx - tx) + ',' + (y2 - ny - ty))
                triangle.setAttribute('fill', 'red')
                g.appendChild(triangle)
            }
        }
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
