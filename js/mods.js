//
// mods.js
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
// Modified by Francisco Sanchez at The Beach Lab 2019
//  - UI changes
//
// This work may be reproduced, modified, distributed, performed, and
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is
// provided as is; no warranty is provided, and users accept all
// liability.
//
// closure
//
(function () {
   //
   // globals
   //
   var mods = {}
   mods.theme = {}
   mods.mod = {}
   mods.globals = {}
   mods.ui = {
      source: null,
      progname: '',
      border: 0,
      borderRadius: '0px',
      padding: 7,
      bezier: 100,
      canvas: 250,
      rows: 5,
      cols: 20,
      link_color: 'rgb(43, 202, 255)',
      link_highlight: 'rgb(255,0,0)',
      link_stroke_with: 5,
      header: 50,
      selected: {},
      mousedown: null,
      menu: null,
      top: null,
      left: null,
      xstart: null,
      ystart: null,
      xtrans: null,
      ytrans: null,
      maxzoom: 1.9,
      minzoom: 0.4
   }
   mods.darktheme = {
      status: "dark",
      background: "rgb(51, 51, 51)",
      text: "white",
      link: "white",
      alink: "white",
      vlink: "white",
      logodot: "white",
      logorect: "white"
   }
   mods.lighttheme = {
      status: "light",
      background: "rgb(255, 255, 255)",
      text: "black",
      link: "black",
      alink: "black",
      vlink: "black",
      logodot: "red",
      logorect: "blue"
   }
   mods.theme = mods.lighttheme
   //
   // Toggle Dark Mode 'd'
   //
   window.addEventListener('keydown', function (evt) {
      if (evt.code == 'KeyD') 
      {
         var div = document.getElementById('prompt')
         if (mods.theme == mods.lighttheme) 
         {
            mods.theme = mods.darktheme
         }
         else if (mods.theme == mods.darktheme) 
         {
            mods.theme = mods.lighttheme
         }
         document.body.style.backgroundColor = mods.theme.background
         div.style.color = mods.theme.text
         document.body.aLink = mods.theme.alink
         document.body.link = mods.theme.link
         document.body.vLink = mods.theme.vlink         
      }
   })
   //
   // UI
   //
   document.body.style.overflow = "hidden"
   document.body.style.fontFamily = "monospace"
   document.body.style.backgroundColor = mods.theme.background
   document.body.aLink = mods.theme.alink
   document.body.link = mods.theme.link
   document.body.vLink = mods.theme.vlink
   function mods_transform() {
      var transform = document.body.style.transform
      var m = new DOMMatrix(getComputedStyle(document.body).transform)
      var s = m.m11
      var tx = m.m41/s
      var ty = m.m42/s
      var origin = document.body.style.transformOrigin
      var pxx = origin.indexOf('px')
      var ox = parseFloat(origin.slice(0, pxx))
      var pxy = origin.indexOf('px', pxx + 2)
      var oy = parseFloat(origin.slice(pxx + 2, pxy))
      return ({ s: s, tx: tx, ty: ty, ox: ox, oy: oy })
   }
   document.body.style.transform = 'scale(1) translate(0px,0px)'
   document.body.style.transformOrigin = '0px 0px'
   //
   // scroll wheel event
   //
   window.addEventListener('wheel', function (evt) {
      /*
      (xw+tx-ox)*s+ox = xs
      xw = ox-tx+(xs-ox)/s
      (xw+tx0-ox0)*s+ox0  = (xw+tx1-ox1)*s+ox1
      (tx0-ox0)*s+ox0  = (tx1-ox1)*s+ox1
      tx0+(ox1-ox0)+(ox0-ox1)/s  = tx1
      tx0+(ox1-ox0)*(1-1/s)  = tx1
      */
      var el = document.elementFromPoint(evt.pageX, evt.pageY)
      if ((el.tagName == "HTML") || (el.tagName == "BODY")) {
         set_prompt('scroll to zoom')
         //evt.preventDefault()
         evt.stopPropagation()
         var t = mods_transform()
         if (evt.deltaY > 0)
         {
             if (t.s < mods.ui.maxzoom)
               var scale = t.s * 1.1
         }
         else
         {
            if (t.s > mods.ui.minzoom)
               var scale = t.s * 0.9
         }
         var tx = t.tx + (evt.pageX - t.ox) * (1 - 1 / t.s)
         var ty = t.ty + (evt.pageY - t.oy) * (1 - 1 / t.s)
         document.body.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`
         document.body.style.transformOrigin = `${evt.pageX}px ${evt.pageY}px`
      }
   })
   //
   // body mouse events
   //
   window.addEventListener('mousedown', function (evt) {
      //
      // get element mouse is over
      //
      var el = document.elementFromPoint(evt.pageX, evt.pageY)
      //
      // check if on body
      //
      if ((el.tagName == "HTML") || (el.tagName == "BODY")) {
         //
         // remember button
         //
         mods.ui.mousedown = evt.button
         if (mods.ui.mousedown == 0) {
            set_prompt('left-drag to pan, right-drag to select, d to toggle dark mode')
            if (mods.ui.menu != null) {
               document.body.removeChild(mods.ui.menu)
               mods.ui.menu = null
            }
         }
         else if (mods.ui.mousedown == 2) {
            set_prompt('menu; left-drag to pan, right-drag to select')
         }
         //
         // remember position
         //
         var t = mods_transform()
         mods.ui.xstart = evt.pageX
         mods.ui.ystart = evt.pageY
         mods.ui.xtrans = t.tx
         mods.ui.ytrans = t.ty
      }
   })
   window.addEventListener('mousemove', function (evt) {
      //
      // mouse move
      //
      if (mods.ui.mousedown != null) {
         evt.preventDefault()
         evt.stopPropagation()
         var t = mods_transform()
         if (mods.ui.mousedown == 0) {
            //
            // pan on left drag
            //
            xtrans = mods.ui.xtrans + (evt.pageX - mods.ui.xstart) / t.s
            ytrans = mods.ui.ytrans + (evt.pageY - mods.ui.ystart) / t.s
            document.body.style.transform = `scale(${t.s}) translate(${xtrans}px,${ytrans}px)`
         }
         else if (mods.ui.mousedown == 2) {
            //
            // select on right drag
            //
            var rect = document.getElementById('svgrect')
            if (rect == undefined) {
               //
               // start dragging
               //
               if (mods.ui.menu != null) {
                  document.body.removeChild(mods.ui.menu)
                  mods.ui.menu = null
               }
               set_prompt('right-drag to select')
               var t = mods_transform()
               var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
               rect.setAttribute('id', 'svgrect')
               rect.setAttribute('x', t.ox - t.tx + (evt.pageX - t.ox) / t.s)
               rect.setAttribute('y', t.oy - t.ty + (evt.pageY - t.oy) / t.s - mods.ui.header)
               rect.setAttribute('width', 0)
               rect.setAttribute('height', 0)
               rect.setAttribute('fill', 'rgb(200,200,200)')
               rect.setAttribute('stroke', 'none')
               var svg = document.getElementById('svg')
               svg.insertBefore(rect, svg.firstChild)
            }
            else {
               //
               // continue dragging
               //
               var rect = document.getElementById('svgrect')
               var xp = t.ox - t.tx + (mods.ui.xstart - t.ox) / t.s
               var yp = t.oy - t.ty + (mods.ui.ystart - t.oy) / t.s - mods.ui.header
               var xw = t.ox - t.tx + (evt.pageX - t.ox) / t.s
               var yw = t.oy - t.ty + (evt.pageY - t.oy) / t.s - mods.ui.header
               if (xw < xp) {
                  rect.setAttribute('x', xw)
                  rect.setAttribute('width', xp - xw)
               }
               else
                  rect.setAttribute('width', xw - xp)
               if (yw < yp) {
                  rect.setAttribute('y', yw)
                  rect.setAttribute('height', yp - yw)
               }
               else
                  rect.setAttribute('height', yw - yp)
            }
         }
      }
   })
   window.addEventListener('mouseup', function (evt) {
      //
      // mouse up
      //
      mods.ui.mousedown = null
      //
      // check for selection rectangle
      //
      var rect = document.getElementById('svgrect')
      if (rect != null) {
         //
         // rectangle exists, selecting modules
         //
         var x = parseFloat(rect.getAttribute('x'))
         var y = parseFloat(rect.getAttribute('y'))
         var width = parseFloat(rect.getAttribute('width'))
         var height = parseFloat(rect.getAttribute('height'))
         svg.removeChild(rect)
         var modules = document.getElementById('modules')
         //
         // loop to find selected modules
         //
         mods.ui.selected = {}
         for (var module in modules.childNodes) {
            var container = modules.childNodes[module]
            var id = container.id
            if (id != undefined) {
               var name = container.firstChild
               var left = parseFloat(container.dataset.left)
               var top = parseFloat(container.dataset.top)
               if ((x <= left) && (left <= x + width) && (y <= top) && (top <= y + height)) {
                  //
                  // module is in selection rectangle
                  //
                  name.style.fontWeight = "bold"
                  mods.ui.selected[id] = true
               }
               else {
                  //
                  // module is not in selection rectangle
                  //
                  name.style.fontWeight = "normal"
               }
            }
         }
      }
   })
   //
   // context menu
   //
   window.addEventListener('contextmenu', function (evt) {
      evt.stopPropagation()
      evt.preventDefault()
      if (mods.ui.menu != null) {
         document.body.removeChild(mods.ui.menu)
         mods.ui.menu = null
      }
      var div = document.createElement('div')
      make_menu(div)
      add_menu(div, 'modules', modules)
      add_menu(div, 'programs', programs)
      add_menu(div, 'edit', edit)
      add_menu(div, 'options', options)
      document.body.appendChild(div)
      function make_menu(div) {
         mods.ui.menu = div
         div.style.position = "absolute"
         var t = mods_transform()
         div.style.top = t.oy - t.ty + (evt.pageY - t.oy) / t.s
         div.style.left = t.ox - t.tx + (evt.pageX - t.ox) / t.s
         div.style.zIndex = 0
         div.style.cursor = 'default'
         div.style.backgroundColor = "rgb(69, 212, 255)"
         div.style.padding = 1.5 * mods.ui.padding
         div.style.textAlign = 'left'
         div.style.border = mods.ui.border + 'px solid'
         div.style.borderRadius = mods.ui.borderRadius
      }
      function add_menu(div, text, click) {
         var textdiv = document.createElement('div')
         textdiv.appendChild(document.createTextNode(text))
         textdiv.appendChild(document.createElement('br'))
         textdiv.addEventListener('mouseover', function (evt) {
            evt.target.style.fontWeight = 'bold'
         })
         textdiv.addEventListener('mouseout', function (evt) {
            evt.target.style.fontWeight = 'normal'
         })
         textdiv.addEventListener('mousedown', click)
         textdiv.addEventListener('touchend', click)
         div.appendChild(textdiv)
      }
      //
      // modules menu
      //
      function modules(evt) {
         evt.preventDefault()
         evt.stopPropagation()
         document.body.removeChild(evt.target.parentNode)
         var div = document.createElement('div')
         make_menu(div)
         set_prompt('modules')
         //
         // open server module
         //
         add_menu(div, 'open server module', function (evt) {
            function module_label(label) {
               var div = document.createElement('div')
               var i = document.createElement('i')
               i.appendChild(document.createTextNode(label))
               div.appendChild(i)
               div.appendChild(document.createElement('br'))
               menu.appendChild(div)
            }
            function module_menu(label, module) {
               var div = document.createElement('div')
               div.appendChild(
                  document.createTextNode('\u00A0\u00A0\u00A0' + label))
               div.addEventListener('mouseover', function (evt) {
                  evt.target.style.fontWeight = 'bold'
               })
               div.addEventListener('mouseout', function (evt) {
                  evt.target.style.fontWeight = 'normal'
               })
               div.addEventListener('mousedown', function (evt) {
                  evt.preventDefault()
                  evt.stopPropagation()
                  document.body.removeChild(evt.target.parentNode)
                  mods.ui.menu = null
                  var t = mods_transform()
                  mod_message_handler(module,
                     t.oy - t.ty + (evt.pageY - t.oy) / t.s,
                     t.ox - t.tx + (evt.pageX - t.ox) / t.s)
               })
               div.appendChild(document.createElement('br'))
               menu.appendChild(div)
            }
            document.body.removeChild(evt.target.parentNode)
            var menu = document.createElement('div')
            make_menu(menu)
            document.body.appendChild(menu)
            menu.style.width = mods.ui.canvas
            menu.style.height = mods.ui.canvas
            menu.style.overflow = 'auto'
            var req = new XMLHttpRequest()
            req.responseType = 'text'
            req.onreadystatechange = function () {
               if (req.readyState == XMLHttpRequest.DONE) {
                  var str = req.response
                  eval(str)
               }
            }
            req.open('GET', 'modules/index.js' + '?rnd=' + Math.random())
            req.send()
         })
         //
         // open local module
         //
         add_menu(div, 'open local module', function (evt) {
            var t = mods_transform()
            mods.ui.top = t.oy - t.ty + (evt.pageY - t.oy) / t.s
            mods.ui.left = t.ox - t.tx + (evt.pageX - t.ox) / t.s
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            var file = document.getElementById('mod_input')
            file.value = null
            file.click()
         })
         //
         // open remote module
         //
         add_menu(div, 'open remote module', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            set_prompt('remotes not yet implemented')
         })
         document.body.appendChild(div)
      }
      //
      // programs menu
      //
      function programs(evt) {
         evt.preventDefault()
         evt.stopPropagation()
         document.body.removeChild(evt.target.parentNode)
         var div = document.createElement('div')
         make_menu(div)
         set_prompt('programs')
         //
         // open local program
         //
         add_menu(div, 'open local program', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            var file = document.getElementById('prog_input')
            file.value = null
            file.click()
         })
         //
         // open server program
         //
         add_menu(div, 'open server program', function (evt) {
            function program_label(label) {
               var div = document.createElement('div')
               var i = document.createElement('i')
               i.appendChild(document.createTextNode(label))
               div.appendChild(i)
               div.appendChild(document.createElement('br'))
               menu.appendChild(div)
            }
            function program_menu(label, program) {
               var div = document.createElement('div')
               div.appendChild(
                  document.createTextNode('\u00A0\u00A0\u00A0' + label))
               div.addEventListener('mouseover', function (evt) {
                  evt.target.style.fontWeight = 'bold'
               })
               div.addEventListener('mouseout', function (evt) {
                  evt.target.style.fontWeight = 'normal'
               })
               div.addEventListener('mousedown', function (evt) {
                  evt.preventDefault()
                  evt.stopPropagation()
                  if (location.port == 80)
                     var uri = 'http://' + location.hostname
                        + '?program=' + program
                  else
                     var uri = 'http://' + location.hostname + ':'
                        + location.port + '?program=' + program
                  set_prompt('<a href=' + uri + '>program link</a>')
                  prog_message_handler(program)
                  document.body.removeChild(evt.target.parentNode)
                  mods.ui.menu = null
               })
               div.appendChild(document.createElement('br'))
               menu.appendChild(div)
            }
            document.body.removeChild(evt.target.parentNode)
            var menu = document.createElement('div')
            make_menu(menu)
            document.body.appendChild(menu)
            menu.style.width = mods.ui.canvas
            menu.style.height = mods.ui.canvas
            menu.style.overflow = 'auto'
            var req = new XMLHttpRequest()
            req.responseType = 'text'
            req.onreadystatechange = function () {
               if (req.readyState == XMLHttpRequest.DONE) {
                  var str = req.response
                  eval(str)
               }
            }
            req.open('GET', 'programs/index.js' + '?rnd=' + Math.random())
            req.send()
         })
         //
         // open remote program
         //
         add_menu(div, 'open remote program', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            set_prompt('remotes not yet implemented')
         })
         //
         // save local program
         //
         add_menu(div, 'save local program', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            save_program()
         })
         //
         // save local page
         //
         add_menu(div, 'save local page', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            save_page()
         })
         document.body.appendChild(div)
      }
      //
      // edit menu
      //
      function edit(evt) {
         evt.preventDefault()
         evt.stopPropagation()
         document.body.removeChild(evt.target.parentNode)
         var div = document.createElement('div')
         make_menu(div)
         set_prompt('edit')
         //
         // cut
         //
         add_menu(div, 'cut', function (evt) {
            evt.preventDefault()
            evt.stopPropagation()
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            if ((Object.keys(mods.ui.selected).length) == 0) {
               set_prompt("nothing selected")
            }
            else {
               for (var id in mods.ui.selected) {
                  var div = document.getElementById(id)
                  delete_module(id)
                  mods.ui.selected = {}
               }
            }
         })
         //
         // copy
         //
         add_menu(div, 'copy', function (evt) {
            evt.preventDefault()
            evt.stopPropagation()
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            set_prompt('copy not yet implemented')
         })
         //
         // paste
         //
         add_menu(div, 'paste', function (evt) {
            evt.preventDefault()
            evt.stopPropagation()
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            set_prompt('paste not yet implemented')
         })
         document.body.appendChild(div)
      }
      //
      // options menu
      //
      function options(evt) {
         evt.preventDefault()
         evt.stopPropagation()
         document.body.removeChild(evt.target.parentNode)
         mods.ui.menu = null
         var div = document.createElement('div')
         make_menu(div)
         set_prompt('options')
         //
         // view files
         //
         add_menu(div, 'view files', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            var win = window.open('files.html')
         })
         document.body.appendChild(div)
         //
         // view original project
         //
         add_menu(div, 'view cba project', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            var win = window.open('https://gitlab.cba.mit.edu/pub/mods')
         })
         document.body.appendChild(div)
         //
         // view forked project
         //
         add_menu(div, 'view forked project', function (evt) {
            document.body.removeChild(evt.target.parentNode)
            mods.ui.menu = null
            var win = window.open('https://github.com/TheBeachLab/mods')
         })
         document.body.appendChild(div)
      }
   })
   //
   // prompt
   //
   document.body.appendChild(document.createTextNode(' '))
   var span = document.createElement('span')
   span.setAttribute('id', 'logo')
   span.style.display = 'inline-block'
   span.style.verticalAlign = 'middle'
   span.style.width = 20
   span.style.height = 20
   span.style.padding = mods.ui.padding
   span.appendChild(logo(1))
   document.body.appendChild(span)
   document.body.appendChild(document.createTextNode(' '))
   var span = document.createElement('span')
   span.setAttribute('id', 'prompt')
   span.style.display = 'inline-block'
   span.style.verticalAlign = 'middle'
   var innerspan = document.createElement('span')
   span.appendChild(innerspan)
   document.body.appendChild(span)
   function logo(size) {
      var x = 0
      var y = 2.8 * size / 3.8
      var svgNS = "http://www.w3.org/2000/svg"
      var logo = document.createElementNS(svgNS, "svg")
      logo.setAttributeNS("http://www.w3.org/2000/xmlns/",
         "xmlns:xlink", "http://www.w3.org/1999/xlink")
      logo.setAttributeNS(null, 'viewBox', "0 0 " + size + " " + size)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x)
      new_rect.setAttribute("y", y)
      new_rect.setAttribute("fill", mods.theme.logorect)
      logo.appendChild(new_rect)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x + 1.4 * size / 3.8)
      new_rect.setAttribute("y", y)
      new_rect.setAttribute("fill", "blue")
      logo.appendChild(new_rect)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x + 2.8 * size / 3.8)
      new_rect.setAttribute("y", y)
      new_rect.setAttribute("fill", "blue")
      logo.appendChild(new_rect)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x)
      new_rect.setAttribute("y", y - 1.4 * size / 3.8)
      new_rect.setAttribute("fill", "blue")
      logo.appendChild(new_rect)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x + 2.8 * size / 3.8)
      new_rect.setAttribute("y", y - 1.4 * size / 3.8)
      new_rect.setAttribute("fill", "blue")
      logo.appendChild(new_rect)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x + 1.4 * size / 3.8)
      new_rect.setAttribute("y", y - 2.8 * size / 3.8)
      new_rect.setAttribute("fill", "blue")
      logo.appendChild(new_rect)
      var new_rect = document.createElementNS(svgNS, "rect");
      new_rect.setAttribute("width", size / 3.8)
      new_rect.setAttribute("height", size / 3.8)
      new_rect.setAttribute("x", x + 2.8 * size / 3.8)
      new_rect.setAttribute("y", y - 2.8 * size / 3.8)
      new_rect.setAttribute("fill", "blue")
      logo.appendChild(new_rect)
      var new_circ = document.createElementNS(svgNS, "circle");
      new_circ.setAttribute("r", size / (2 * 3.8))
      new_circ.setAttribute("cx", x + size / (2 * 3.8))
      new_circ.setAttribute("cy", y + size / (2 * 3.8) - 2.8 * size / 3.8)
      new_circ.setAttribute("fill", "red")
      logo.appendChild(new_circ)
      var new_circ = document.createElementNS(svgNS, "circle");
      new_circ.setAttribute("r", size / (2 * 3.8))
      new_circ.setAttribute("cx", x + size / (2 * 3.8) + 1.4 * size / 3.8)
      new_circ.setAttribute("cy", y + size / (2 * 3.8) - 1.4 * size / 3.8)
      new_circ.setAttribute("fill", "red")
      logo.appendChild(new_circ)
      return logo
   }
   set_prompt('right click/two finger/long press for menu; scroll for zoom, drag for pan')
   //
   // SVG canvas for drawing
   //
   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
   svg.style.position = 'absolute'
   svg.style.backgroundColor = 'rgba(200,200,200,0)'
   svg.style.top = mods.ui.header
   svg.style.left = 0
   svg.style.zIndex = 0
   svg.style.overflow = 'visible'
   svg.setAttribute('width', 40)
   svg.setAttribute('height', 40)
   svg.setAttribute('id', 'svg')
   svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink")
   document.body.appendChild(svg)
   //
   // link container
   //
   var svg = document.getElementById('svg')
   var g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
   g.setAttribute('id', 'links')
   svg.appendChild(g)
   //
   // file reading controls
   //
   var file = document.createElement('input')
   file.setAttribute('type', 'file')
   file.setAttribute('id', 'mod_input')
   file.style.position = 'absolute'
   file.style.left = 0
   file.style.top = 0
   file.style.width = 0
   file.style.height = 0
   file.style.opacity = 0
   file.addEventListener('change', function () {
      mod_read_handler()
   })
   document.body.appendChild(file)
   var file = document.createElement('input')
   file.setAttribute('type', 'file')
   file.setAttribute('id', 'prog_input')
   file.style.position = 'absolute'
   file.style.left = 0
   file.style.top = 0
   file.style.width = 0
   file.style.height = 0
   file.style.opacity = 0
   file.addEventListener('change', function () {
      prog_read_handler()
   })
   document.body.appendChild(file)
   //
   // module container
   //
   var div = document.createElement('div')
   div.setAttribute('id', 'modules')
   document.body.appendChild(div)
   //
   // check for program load query
   //
   if (location.search.length > 0) {
      var args = location.search.slice(1).split('&')
      for (var a in args) {
         var arg = args[a].split('=')
         if (arg[0] == 'program')
            prog_message_handler(arg[1])
      }
   }
   //
   // program routines
   //
   function prog_read_handler(event) {
      var file = document.getElementById('prog_input')
      var file_reader = new FileReader()
      file_reader.onload = prog_load_handler
      file_reader.readAsText(file.files[0])
      mods.ui.progname = file.files[0].name
   }
   function prog_message_handler(filename) {
      var req = new XMLHttpRequest()
      req.responseType = 'text'
      req.onreadystatechange = function () {
         if (req.readyState == XMLHttpRequest.DONE) {
            prog = JSON.parse(req.response)
            prog_load(prog)
         }
      }
      var index = filename.lastIndexOf('/')
      if (index != -1) {
         mods.ui.progname = filename.slice(index + 1)
      }
      else
         mods.ui.progname = filename
      //
      // send request, with random query to prevent caching
      //
      req.open('GET', filename + '?rnd=' + Math.random())
      req.send()
   }
   function prog_load_handler(event) {
      prog = JSON.parse(event.target.result)
      prog_load(prog)
   }
   function prog_load(prog) {
      //
      // load modules
      //
      for (var idnumber in prog.modules) {
         var module = prog.modules[idnumber]
         var str = module.definition
         try {
            eval('var args = ' + str)
         }
         catch (err) {
            console.log(err.message)
            return
         }
         args.definition = str
         args.id = idnumber
         var t = mods_transform()
         var xw = t.ox - t.tx + (mods.ui.xstart - t.ox) / t.s
         var yw = t.oy - t.ty + (mods.ui.ystart - t.oy) / t.s - mods.ui.header
         args.top = parseFloat(module.top) + yw
         args.left = parseFloat(module.left) + xw
         args.filename = module.filename
         add_module(args)
      }
      //
      // load links
      //
      for (var linkid in prog.links) {
         var str = prog.links[linkid]
         eval('var link = ' + str)
         eval('var linksrc = ' + link.source)
         eval('var linkdst = ' + link.dest)
         var src = document.getElementById(
            JSON.stringify({ id: linksrc.id, type: linksrc.type, name: linksrc.name }))
         var dst = document.getElementById(
            JSON.stringify({ id: linkdst.id, type: linkdst.type, name: linkdst.name }))
         add_link(src, dst)
      }
   }
   function save_program() {
      set_prompt('program name? ')
      get_prompt(mods.ui.progname, function (filename) {
         mods.ui.progname = filename
         var prog = { modules: {}, links: [] }
         var modules = document.getElementById('modules')
         //
         // save modules
         //
         for (var c = 0; c < modules.childNodes.length; ++c) {
            var module = modules.childNodes[c]
            var idnumber = module.id
            prog.modules[idnumber] = {
               definition: update_module_definition(
                  idnumber, module.dataset.definition),
               top: module.dataset.top,
               left: module.dataset.left,
               inputs: {},
               outputs: {}
            }
         }
         //
         // save links
         //
         var svg = document.getElementById('svg')
         var links = svg.getElementById('links')
         for (var l = 0; l < links.childNodes.length; ++l) {
            var link = links.childNodes[l]
            var linkid = link.id
            prog.links.push(linkid)
         }
         //
         // download
         //
         var text = JSON.stringify(prog)
         var a = document.createElement('a')
         a.setAttribute('href', 'data:text/plain;charset=utf-8,' +
            encodeURIComponent(text))
         a.setAttribute('download', filename)
         a.style.display = 'none'
         document.body.appendChild(a)
         a.click()
         document.body.removeChild(a)
      })
   }
   function save_page() {
      set_prompt('page name? ')
      get_prompt(mods.ui.progname + ".html", function (filename) {
         mods.ui.progname = filename
         var prog = { modules: {}, links: [] }
         var modules = document.getElementById('modules')
         //
         // save modules
         //
         for (var c = 0; c < modules.childNodes.length; ++c) {
            var module = modules.childNodes[c]
            var idnumber = module.id
            prog.modules[idnumber] = {
               definition: update_module_definition(
                  idnumber, module.dataset.definition),
               top: module.dataset.top,
               left: module.dataset.left,
               inputs: {},
               outputs: {}
            }
         }
         //
         // save links
         //
         var svg = document.getElementById('svg')
         var links = svg.getElementById('links')
         for (var l = 0; l < links.childNodes.length; ++l) {
            var link = links.childNodes[l]
            var linkid = link.id
            prog.links.push(linkid)
         }
         //
         // read mods.js
         //
         var req = new XMLHttpRequest()
         req.responseType = 'text'
         req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE) {
               //
               // construct page
               //
               var str = req.response
               var text = "<html>\n"
               text += "<head><meta charset='utf-8'>\n"
               text += "<title>mods</title>\n"
               text += "</head>\n"
               text += "<body link='black' alink='black' vlink='black'>\n"
               text += "<" + "script" + ">\n"
               text += str
               text += "var prog = JSON.parse(JSON.stringify(" + JSON.stringify(prog) + "))\n"
               text += "window.mods_prog_load(prog)\n"
               text += "</" + "script" + ">\n"
               text += "</body>\n"
               text += "</html>\n"
               //
               // download page
               //
               var a = document.createElement('a')
               a.setAttribute('href', 'data:text/plain;charset=utf-8,' +
                  encodeURIComponent(text))
               a.setAttribute('download', filename)
               a.style.display = 'none'
               document.body.appendChild(a)
               a.click()
               document.body.removeChild(a)
            }
         }
         //
         // send request, with random query to prevent caching
         //
         req.open('GET', 'js/mods.js' + '?rnd=' + Math.random())
         req.send()
      })
   }
   //
   // add program load to window
   //
   window.mods_prog_load = function (prog) {
      prog_load(prog)
   }
   //
   // module routines
   //
   function mod_read_handler(event) {
      var file = document.getElementById('mod_input')
      var file_reader = new FileReader()
      file_reader.onload = mod_load_handler
      file_reader.readAsText(file.files[0])
   }
   function mod_message_handler(filename, top, left) {
      var req = new XMLHttpRequest()
      req.responseType = 'text'
      req.onreadystatechange = function () {
         if (req.readyState == XMLHttpRequest.DONE) {
            var str = req.response
            try {
               eval('var args = ' + str)
            }
            catch (err) {
               console.log(err.message)
               return
            }
            args.definition = str
            args.id = String(Math.random())
            args.top = top
            args.left = left
            args.filename = filename
            add_module(args)
         }
      }
      //
      // send request, with random query to prevent caching
      //
      req.open('GET', filename + '?rnd=' + Math.random())
      req.send()
   }
   function mod_load_handler(event) {
      str = event.target.result
      try {
         eval('var args = ' + str)
      }
      catch (err) {
         console.log(err.message)
         return
      }
      args.definition = str
      args.id = String(Math.random())
      args.top = mods.ui.top
      args.left = mods.ui.left
      args.filename = ""
      var div = add_module(args)
      return (div)
   }
   function add_module(args) {
      var idnumber = args.id
      mods.mod[idnumber] = args.mod
      var modules = document.getElementById('modules')
      //
      // container
      //
      var container = document.createElement('div')
      container.setAttribute("id", idnumber)
      container.style.position = "absolute"
      container.style.top = args.top
      container.style.left = args.left
      container.dataset.top = args.top
      container.dataset.left = args.left
      container.dataset.filename = args.filename
      container.dataset.name = args.name
      container.style.zIndex = 0
      container.style.width = window.innerWidth
      container.dataset.definition = args.definition
      modules.appendChild(container)
      //
      // name
      //
      var divname = document.createElement('div')
      divname.appendChild(document.createTextNode(args.name))
      divname.addEventListener('mouseover', name_over)
      divname.addEventListener('mouseout', name_out)
      divname.addEventListener('mousedown', name_mousedown)
      divname.addEventListener('touchstart', name_touchdown)
      divname.style.backgroundColor = "rgb(255, 89, 191)"
      divname.style.padding = 1.5 * mods.ui.padding
      divname.style.position = "absolute"
      divname.style.cursor = 'default'
      divname.style.top = 0
      divname.style.left = 0
      divname.style.textAlign = 'center'
      divname.style.border = mods.ui.border + 'px solid'
      divname.style.borderRadius = mods.ui.borderRadius
      container.appendChild(divname)
      //
      // controls
      //
      var divctrl = document.createElement('div')
      var editspan = document.createElement('span')
      editspan.innerHTML = 'edit'
      editspan.style.fontWeight = 'normal'
      editspan.addEventListener('mouseover', function (event) {
         set_prompt('click to edit')
         editspan.style.fontWeight = 'bold'
      })
      editspan.addEventListener('mouseout', function (event) {
         set_prompt('')
         editspan.style.fontWeight = 'normal'
      })
      editspan.addEventListener('mousedown', edit_module)
      divctrl.appendChild(editspan)
      var delspan = document.createElement('span')
      delspan.innerHTML = ' delete '
      delspan.addEventListener('mouseover', function (event) {
         set_prompt('click to delete')
         delspan.style.fontWeight = 'bold'
      })
      delspan.addEventListener('mouseout', function (event) {
         set_prompt('')
         delspan.style.fontWeight = 'normal'
      })
      delspan.addEventListener('mousedown', function (event) {
         delete_module(event.target.parentNode.parentNode.id)
      })
      divctrl.appendChild(delspan)
      divctrl.style.backgroundColor = "rgb(200, 200, 200)"
      divctrl.style.padding = mods.ui.padding
      divctrl.style.position = "absolute"
      divctrl.style.cursor = 'default'
      divctrl.style.top = divname.clientHeight + mods.ui.border
      divctrl.style.left = 0
      divctrl.style.textAlign = 'center'
      divctrl.style.border = mods.ui.border + 'px solid'
      divctrl.style.borderRadius = mods.ui.borderRadius
      container.appendChild(divctrl)
      divctrl.style.left = divname.clientWidth / 2 - divctrl.clientWidth / 2
      //
      // interface
      //
      var divint = document.createElement('div')
      divint.style.backgroundColor = "rgb(240,240,240)"
      divint.style.padding = mods.ui.padding
      divint.style.position = "absolute"
      divint.style.top = divname.clientHeight + divctrl.clientHeight + mods.ui.border
      divint.style.textAlign = 'center'
      divint.style.border = mods.ui.border + 'px solid'
      divint.style.borderRadius = mods.ui.borderRadius
      divint.setAttribute('id', JSON.stringify({ id: idnumber, type: 'interface' }))
      divint.dataset.id = idnumber
      divint.dataset.divNameSize = divname.clientWidth
      args.interface(divint)
      container.appendChild(divint)
      divint.style.left = divname.clientWidth / 2 - divint.clientWidth / 2
      //
      // inputs
      //
      var divin = document.createElement('div')
      divin.setAttribute('id', JSON.stringify({ id: idnumber, type: 'inputs' }))
      var b = document.createElement('b')
      b.appendChild(document.createTextNode('inputs'))
      divin.appendChild(b)
      divin.style.backgroundColor = "rgb(255, 225, 54)"
      divin.style.padding = mods.ui.padding
      divin.style.paddingLeft = '4px'
      divin.style.position = "absolute"
      divin.style.top = divname.clientHeight + divctrl.clientHeight + mods.ui.border
      divin.style.textAlign = 'left'
      divin.style.border = mods.ui.border + 'px solid'
      divin.style.borderRadius = mods.ui.borderRadius
      divin.setAttribute('id', JSON.stringify({ id: idnumber, type: 'inputs' }))
      divin.style.cursor = 'default'
      divin.addEventListener('mousedown', nothing)
      divin.addEventListener('touchstart', nothing)
      divin.addEventListener('mouseup', nothing)
      divin.addEventListener('touchend', nothing)
      for (var v in args.inputs) {
         var div = document.createElement('div')
         if (args.inputs[v].label != undefined)
            div.innerHTML += args.inputs[v].label
         else
            div.innerHTML += v
         if (args.inputs[v].type != '')
            div.innerHTML += ' (' + args.inputs[v].type + ')'
         div.setAttribute('id', JSON.stringify({ id: idnumber, type: 'inputs', name: v }))
         div.addEventListener('mouseover', input_over)
         div.addEventListener('mouseout', input_out)
         div.addEventListener('mousedown', input_mousedown)
         div.addEventListener('touchstart', input_touchdown)
         div.dataset.links = JSON.stringify([])
         div.dataset.name = v
         divin.appendChild(div)
         div.dataset.id = JSON.stringify(
            {
               id: idnumber, type: 'input', name: v,
               rnd: Math.random()
            }) // randomize for unique events
         window.addEventListener(div.dataset.id, args.inputs[v].event)
      }
      container.appendChild(divin)
      if ((Object.keys(args.inputs).length) == 0)
         divin.style.visibility = 'hidden'
      divin.style.left = divname.clientWidth / 2
         - divint.clientWidth / 2 - divin.clientWidth
      for (var i = 1; i < divin.childNodes.length; ++i) {
         divin.childNodes[i].dataset.dx = divin.offsetLeft
            + divin.childNodes[i].offsetLeft
         divin.childNodes[i].dataset.dy = divin.offsetTop
            + divin.childNodes[i].offsetTop
            + divin.childNodes[i].offsetHeight / 2
      }
      //
      // outputs
      //
      var divout = document.createElement('div')
      divout.setAttribute('id', JSON.stringify({ id: idnumber, type: 'outputs' }))
      var b = document.createElement('b')
      b.appendChild(document.createTextNode('outputs'))
      divout.appendChild(b)
      divout.style.backgroundColor = "rgb(255, 163, 25)"
      divout.style.padding = mods.ui.padding
      divout.style.paddingRight = '4px'
      divout.style.position = "absolute"
      divout.style.top = divname.clientHeight + divctrl.clientHeight + mods.ui.border
      divout.style.textAlign = 'right'
      divout.addEventListener('mousedown', nothing)
      divout.style.border = mods.ui.border + 'px solid'
      divout.style.borderRadius = mods.ui.borderRadius
      divout.setAttribute('id', JSON.stringify({ id: idnumber, type: 'outputs' }))
      divout.style.cursor = 'default'
      divout.addEventListener('touchstart', nothing)
      divout.addEventListener('mouseup', nothing)
      divout.addEventListener('touchend', nothing)
      for (var v in args.outputs) {
         var div = document.createElement('div')
         if (args.outputs[v].label != undefined)
            div.innerHTML += args.outputs[v].label
         else
            div.innerHTML += v
         if (args.outputs[v].type != '')
            div.innerHTML += ' (' + args.outputs[v].type + ')'
         div.setAttribute('id', JSON.stringify({ id: idnumber, type: 'outputs', name: v }))
         div.addEventListener('mouseover', output_over)
         div.addEventListener('mouseout', output_out)
         div.addEventListener('mousedown', output_mousedown)
         div.addEventListener('touchstart', output_touchdown)
         div.dataset.links = JSON.stringify([])
         div.dataset.name = v
         divout.appendChild(div)
         div.dataset.id = JSON.stringify(
            {
               id: idnumber, type: 'output', name: v,
               rnd: Math.random()
            }) // randomize for unique events
         window.addEventListener(div.dataset.id, args.outputs[v].event)
      }
      container.appendChild(divout)
      if ((Object.keys(args.outputs).length) == 0)
         divout.style.visibility = 'hidden'
      divout.style.left = divname.clientWidth / 2
         + divint.clientWidth / 2
      for (var i = 1; i < divout.childNodes.length; ++i) {
         divout.childNodes[i].dataset.dx = divout.offsetLeft
            + divout.childNodes[i].offsetLeft
            + divout.childNodes[i].offsetWidth
         divout.childNodes[i].dataset.dy = divout.offsetTop
            + divout.childNodes[i].offsetTop
            + divout.childNodes[i].offsetHeight / 2
      }
      //
      // initialization
      //
      args.init()
      //
      // resize to contents
      //
      container.style.width = divint.clientWidth + divin.clientWidth + divout.clientWidth
      mods.fit(divint)
      //
      // return container
      //
      return (container)
   }
   function delete_module(idnumber) {
      //
      // delete links
      //
      var ins = document.getElementById(
         JSON.stringify({ id: idnumber, type: 'inputs' }))
      var outs = document.getElementById(
         JSON.stringify({ id: idnumber, type: 'outputs' }))
      for (var i = 1; i < ins.childNodes.length; ++i) {
         var links = JSON.parse(ins.childNodes[i].dataset.links)
         for (var l in links)
            delete_link(links[l])
      }
      for (var i = 1; i < outs.childNodes.length; ++i) {
         var links = JSON.parse(outs.childNodes[i].dataset.links)
         for (var l in links)
            delete_link(links[l])
      }
      //
      // delete container
      //
      var modules = document.getElementById('modules')
      var container = document.getElementById(idnumber)
      modules.removeChild(container)
      //
      // clear prompt
      //
      set_prompt('')
   }
   function update_module_definition(id) {
      //
      // get definition
      //
      var module = document.getElementById(id)
      var def = module.dataset.definition
      //
      // check for mod
      //
      if (mods.mod[id] == undefined)
         return def
      //
      // split definition
      //
      var lines = def.split('\n')
      //
      // find init function
      //
      var line = 0
      while (line < lines.length) {
         if (lines[line].indexOf("var init") == 0)
            break
         line += 1
      }
      //
      // read initializations up to inputs function
      //
      while (line < lines.length) {
         if (lines[line].indexOf(".value =") != -1) {
            var start = 4 + lines[line].indexOf("mod.")
            var end = lines[line].indexOf(".value")
            var key = lines[line].slice(start, end)
            var value = mods.mod[id][key]['value']
            lines[line] = "   mod." + key + ".value = '" + value + "'"
         }
         else if (lines[line].indexOf(".checked =") != -1) {
            var start = 4 + lines[line].indexOf("mod.")
            var end = lines[line].indexOf(".checked")
            var key = lines[line].slice(start, end)
            var value = mods.mod[id][key]['checked']
            lines[line] = "   mod." + key + ".checked = " + value
         }
         if (lines[line].indexOf("var inputs") == 0)
            break
         line += 1
      }
      return (lines.join('\n'))
   }
   function edit_module(evt) {
      var mod = evt.target.parentNode.parentNode
      var idnumber = mod.id
      var def = update_module_definition(idnumber)
      //
      // open edit window
      //
      var top = mod.dataset.top
      var left = mod.dataset.left
      var name = mod.dataset.name
      var filename = mod.dataset.filename
      var fontsize = 100
      var win = window.open('')
      var file = document.createElement('input')
      file.setAttribute('type', 'file')
      file.setAttribute('id', 'edit_module_file')
      file.style.position = 'absolute'
      file.style.left = 0
      file.style.top = 0
      file.style.width = 0
      file.style.height = 0
      file.style.opacity = 0
      file.addEventListener('change', function () {
         edit_module_read_handler()
      })
      win.document.body.appendChild(file)
      function edit_module_read_handler() {
         var file = win.document.getElementById('edit_module_file')
         var file_reader = new FileReader()
         file_reader.onload = edit_module_load_handler
         file_reader.readAsText(file.files[0])
      }
      function edit_module_load_handler(event) {
         str = event.target.result
         var text = win.document.getElementById('edit_module_text')
         text.value = str
         update_module(idnumber)
         win.close()
      }
      if (filename != "") {
         var btn = document.createElement('button')
         btn.appendChild(document.createTextNode('reload from server'))
         btn.style.padding = mods.ui.padding
         btn.style.margin = 1
         btn.addEventListener('click', function () {
            var req = new XMLHttpRequest()
            req.responseType = 'text'
            req.onreadystatechange = function () {
               if (req.readyState == XMLHttpRequest.DONE) {
                  text.value = req.response
                  update_module(idnumber)
               }
            }
            req.open('GET', filename + '?rnd=' + Math.random())
            req.send()
            win.close()
         })
         win.document.body.appendChild(btn)
      }
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('load from file'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         var file = win.document.getElementById('edit_module_file')
         file.value = null
         file.click()
      })
      win.document.body.appendChild(btn)
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('update and close'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         update_module(idnumber)
         win.close()
      })
      win.document.body.appendChild(btn)
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('update'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         update_module(idnumber)
      })
      win.document.body.appendChild(btn)
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('close'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         win.close()
      })
      win.document.body.appendChild(btn)
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('save'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         var a = document.createElement('a')
         a.setAttribute('href', 'data:text/plain;charset=utf-8,' +
            encodeURIComponent(text.value))
         a.setAttribute('download', name)
         a.style.display = 'none'
         document.body.appendChild(a)
         a.click()
         document.body.removeChild(a)
      })
      win.document.body.appendChild(btn)
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('increase font'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         fontsize *= 1.2
         text.style.fontSize = fontsize + '%'
      })
      win.document.body.appendChild(btn)
      var btn = document.createElement('button')
      btn.appendChild(document.createTextNode('decrease font'))
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.addEventListener('click', function () {
         fontsize /= 1.2
         text.style.fontSize = fontsize + '%'
      })
      win.document.body.appendChild(btn)
      win.document.body.appendChild(document.createElement('br'))
      var text = document.createElement('textarea')
      text.setAttribute('id', 'edit_module_text')
      text.style.width = '100%'
      text.style.height = '100%'
      text.value = def
      win.document.body.appendChild(text)
      function reload_module(idnumber) {
      }
      function update_module(idnumber) {
         //
         // save links
         //
         var ins = document.getElementById(
            JSON.stringify({ id: idnumber, type: 'inputs' }))
         var inlinks = []
         for (var i = 1; i < ins.childNodes.length; ++i) {
            var links = JSON.parse(ins.childNodes[i].dataset.links)
            for (var l in links)
               inlinks.push(links[l])
         }
         var outs = document.getElementById(
            JSON.stringify({ id: idnumber, type: 'outputs' }))
         var outlinks = []
         for (var i = 1; i < outs.childNodes.length; ++i) {
            var links = JSON.parse(outs.childNodes[i].dataset.links)
            for (var l in links)
               outlinks.push(links[l])
         }
         //
         // delete module
         //
         delete_module(idnumber)
         //
         // add module
         //
         var def = text.value
         try {
            eval('var args = ' + def)
         }
         catch (err) {
            console.log(err.message)
            return
         }
         args.definition = def
         args.id = idnumber
         args.top = top
         args.left = left
         args.filename = filename
         add_module(args)
         //
         // add links
         //
         for (var l in inlinks) {
            eval('var link = ' + inlinks[l])
            eval('var linksrc = ' + link.source)
            eval('var linkdst = ' + link.dest)
            var src = document.getElementById(
               JSON.stringify(
                  { id: linksrc.id, type: linksrc.type, name: linksrc.name }))
            var dst = document.getElementById(
               JSON.stringify(
                  { id: linkdst.id, type: linkdst.type, name: linkdst.name }))
            add_link(src, dst)
         }
         for (var l in outlinks) {
            eval('var link = ' + outlinks[l])
            eval('var linksrc = ' + link.source)
            eval('var linkdst = ' + link.dest)
            var src = document.getElementById(
               JSON.stringify(
                  { id: linksrc.id, type: linksrc.type, name: linksrc.name }))
            var dst = document.getElementById(
               JSON.stringify(
                  { id: linkdst.id, type: linkdst.type, name: linkdst.name }))
            add_link(src, dst)
         }
      }
   }
   //
   // UI routines
   //
   function set_prompt(txt) {
      var span = document.getElementById('prompt')
      span.childNodes[0].innerHTML = ' ' + txt
   }
   function get_prompt(txt, fn) {
      var div = document.getElementById('prompt')
      if (div.childNodes.length > 2)
         //
         // already getting a prompt
         //
         return
      var text = document.createElement('input')
      text.type = 'text'
      text.size = 20
      text.value = txt
      text.addEventListener('keydown', function (evt) {
         if (evt.key == 'Enter') {
            var div = document.getElementById('prompt')
            div.removeChild(div.childNodes[1])
            div.removeChild(div.childNodes[1])
            set_prompt('')
            fn(text.value)
         }
      })
      div.appendChild(text)
      div.appendChild(document.createTextNode(' (enter)'))
      text.focus()
   }
   function nothing(evt) {
      evt.preventDefault()
      evt.stopPropagation()
   }
   //
   // link routines
   //
   mods.add_link = function (src, dst) {
      add_link(src, dst)
   }
   function add_link(src, dst) {
      //
      // link order from out to in
      //
      if (src.id.indexOf('outputs') == -1) {
         var tmp = src
         src = dst
         dst = tmp
      }
      //
      // check if link exists
      //
      var id = JSON.stringify({ source: src.id, dest: dst.id })
      var link = document.getElementById(id)
      if (link != null) {
         //
         // yes, remove it and return
         //
         delete_link(id)
         return
      }
      //
      // no, add link
      //
      var links = JSON.parse(src.dataset.links)
      links.push(id)
      src.dataset.links = JSON.stringify(links)
      var links = JSON.parse(dst.dataset.links)
      links.push(id)
      dst.dataset.links = JSON.stringify(links)
      //
      // draw link
      //
      xsrc = src.parentNode.parentNode.offsetLeft
         + parseFloat(src.dataset.dx)
      ysrc = src.parentNode.parentNode.offsetTop
         + parseFloat(src.dataset.dy)
         - mods.ui.header
      xdst = dst.parentNode.parentNode.offsetLeft
         + parseFloat(dst.dataset.dx)
      ydst = dst.parentNode.parentNode.offsetTop
         + parseFloat(dst.dataset.dy)
         - mods.ui.header
      var links = document.getElementById('links')
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('id', id)
      path.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + mods.ui.bezier) + ','
         + ysrc + ' ' + (xdst - mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', mods.ui.link_color)
      path.setAttribute('stroke-width', mods.ui.link_stroke_with)
      links.appendChild(path)
      /*
      //
      // don't trigger link
      //
      eval('var evtid = '+src.id)
      evtid.type = 'output'
      var evtstr = JSON.stringify(evtid)
      var evt = new CustomEvent(evtstr)
      window.dispatchEvent(evt)
      */
   }
   function delete_link(linkid) {
      //
      // delete a link
      //
      var links = document.getElementById('links')
      links.removeChild(document.getElementById(linkid))
      link = JSON.parse(linkid)
      src = document.getElementById(link.source)
      dst = document.getElementById(link.dest)
      var links = JSON.parse(src.dataset.links)
      var index = links.indexOf(linkid)
      links.splice(index, 1)
      src.dataset.links = JSON.stringify(links)
      var links = JSON.parse(dst.dataset.links)
      var index = links.indexOf(linkid)
      links.splice(index, 1)
      dst.dataset.links = JSON.stringify(links)
   }
   function draw_links(idnumber, color) {
      //
      // draw a module's links
      //
      var ins = document.getElementById(
         JSON.stringify({ id: idnumber, type: 'inputs' }))
      var outs = document.getElementById(
         JSON.stringify({ id: idnumber, type: 'outputs' }))
      for (var i = 1; i < ins.childNodes.length; ++i) {
         var links = JSON.parse(ins.childNodes[i].dataset.links)
         for (var l in links)
            draw_link(links[l], color)
      }
      for (var i = 1; i < outs.childNodes.length; ++i) {
         var links = JSON.parse(outs.childNodes[i].dataset.links)
         for (var l in links)
            draw_link(links[l], color)
      }
   }
   function draw_link(id, color) {
      //
      // draw a link
      //
      var link = JSON.parse(id)
      src = document.getElementById(link.source)
      dst = document.getElementById(link.dest)
      var path = document.getElementById(id)
      xsrc = src.parentNode.parentNode.offsetLeft
         + parseFloat(src.dataset.dx)
      ysrc = src.parentNode.parentNode.offsetTop
         + parseFloat(src.dataset.dy)
         - mods.ui.header
      xdst = dst.parentNode.parentNode.offsetLeft
         + parseFloat(dst.dataset.dx)
      ydst = dst.parentNode.parentNode.offsetTop
         + parseFloat(dst.dataset.dy)
         - mods.ui.header
      path.setAttribute('d', 'M' + xsrc + ',' + ysrc + ' C' + (xsrc + mods.ui.bezier) + ','
         + ysrc + ' ' + (xdst - mods.ui.bezier) + ',' + ydst + ' ' + xdst + ',' + ydst)
      path.setAttribute('stroke', color)
   }
   //
   // mods routines to be called from modules
   //
   mods.fit = function (div) {
      //
      // fit a module
      //
      div.style.left = div.dataset.divNameSize / 2 - div.clientWidth / 2
      var divin = document.getElementById(
         JSON.stringify(
            { id: div.dataset.id, type: 'inputs' }))
      divin.style.left = div.dataset.divNameSize / 2 - div.clientWidth / 2 - divin.clientWidth
      var divout = document.getElementById(
         JSON.stringify(
            { id: div.dataset.id, type: 'outputs' }))
      divout.style.left = div.dataset.divNameSize / 2 + div.clientWidth / 2
   }
   mods.output = function (mod, varname, val) {
      //
      // send module outputs
      //
      var div = mod.div
      var key = JSON.parse(div.id)
      var idnumber = key.id
      var out = document.getElementById(
         JSON.stringify(
            { id: idnumber, type: 'outputs', name: varname }))
      var links = JSON.parse(out.dataset.links)
      for (var l in links) {
         var link = JSON.parse(links[l])
         var dest = JSON.parse(link.dest)
         var divin = document.getElementById(JSON.stringify(
            { id: dest.id, type: 'inputs', name: dest.name }))
         var evt = new CustomEvent(divin.dataset.id, { detail: val })
         window.dispatchEvent(evt)
      }
   }
   //
   // module mod-ification calls
   //
   mods.module_create = function (args) {
      var event = { target: { result: args } }
      var div = mod_load_handler(event)
      return (div)
   }
   mods.module_delete = function (id) {
      delete_module(id)
   }
   mods.module_id = function (div) {
      return div.parentNode.id
   }
   mods.module_left = function (id) {
      var module = document.getElementById(id)
      return (parseInt(module.style.left))
   }
   mods.module_move = function (id, dx, dy) {
      var module = document.getElementById(id)
      var top = parseInt(module.style.top)
      module.style.top = top + dy
      module.dataset.top = top + dy
      var left = parseInt(module.style.left)
      module.style.left = left + dx
      module.dataset.left = left + dx
      draw_links(id, mods.ui.link_color)
   }
   mods.module_inputs = function (id, index) {
      var module = document.getElementById(id)
      var inputs = document.getElementById(
         JSON.stringify({ id: id, type: 'inputs' }))
      console.log(inputs.childNodes[index])
   }
   mods.module_outputs = function (id, index) {
      var module = document.getElementById(id)
      var outputs = document.getElementById(
         JSON.stringify({ id: id, type: 'outputs' }))
      console.log(outputs.childNodes[index])
   }
   mods.module_position = function (id, x, y) {
      var module = document.getElementById(id)
      var top = parseInt(module.style.top)
      module.style.top = y
      module.dataset.top = y
      var left = parseInt(module.style.left)
      module.style.left = x
      module.dataset.left = x
      draw_links(id, mods.ui.link_color)
   }
   mods.module_top = function (id) {
      var module = document.getElementById(id)
      return (parseInt(module.style.top))
   }
   mods.module_width = function (id) {
      var module = document.getElementById(id)
      return (parseInt(module.clientWidth))
   }
   //
   // input event handlers
   //
   function input_over(evt) {
      evt.target.style.fontWeight = 'bold'
      var links = JSON.parse(evt.target.dataset.links)
      for (var l in links)
         draw_link(links[l], mods.ui.link_highlight)
      if (mods.ui.source == null)
         set_prompt('click to link')
   }
   function input_out(evt) {
      evt.target.style.fontWeight = 'normal'
      var links = JSON.parse(evt.target.dataset.links)
      for (var l in links)
         draw_link(links[l], mods.ui.link_color)
      if (mods.ui.source == null)
         set_prompt('')
   }
   function input_mousedown(evt) {
      if (mods.ui.source == null) {
         mods.ui.source = evt.target
         set_prompt('variable to link/unlink to?')
      }
      else {
         add_link(mods.ui.source, evt.target)
         set_prompt('')
         mods.ui.source = null
      }
   }
   function input_touchdown(evt) {
      if (mods.ui.source == null) {
         mods.ui.source = evt.target
         set_prompt('variable to link/unlink to?')
      }
      else {
         add_link(mods.ui.source, evt.target)
         set_prompt('')
         mods.ui.source = null
      }
   }
   //
   // output event handlers
   //
   function output_over(evt) {
      evt.target.style.fontWeight = 'bold'
      var links = JSON.parse(evt.target.dataset.links)
      for (var l in links)
         draw_link(links[l], mods.ui.link_highlight)
      if (mods.ui.source == null)
         set_prompt('click to link')
   }
   function output_out(evt) {
      evt.target.style.fontWeight = 'normal'
      var links = JSON.parse(evt.target.dataset.links)
      for (var l in links)
         draw_link(links[l], mods.ui.link_color)
      if (mods.ui.source == null)
         set_prompt('')
   }
   function output_mousedown(evt) {
      if (mods.ui.source == null) {
         mods.ui.source = evt.target
         set_prompt('variable to link/unlink to?')
      }
      else {
         add_link(mods.ui.source, evt.target)
         set_prompt('')
         mods.ui.source = null
      }
   }
   function output_touchdown(evt) {
      if (mods.ui.source == null) {
         mods.ui.source = evt.target
         set_prompt('variable to link/unlink to?')
      }
      else {
         add_link(mods.ui.source, evt.target)
         set_prompt('')
         mods.ui.source = null
      }
   }
   //
   // name event handlers
   //
   function name_over(evt) {
      evt.target.style.fontWeight = 'bold'
      evt.target.style.backgroundColor = "rgb(255, 89, 191)"
      if (mods.ui.source == null)
         set_prompt('click and drag to move')
   }
   function name_out(evt) {
      evt.target.style.fontWeight = 'normal'
      evt.target.style.backgroundColor = "rgb(255, 89, 191)"
      if (mods.ui.source == null)
         set_prompt('')
   }
   function name_mousedown(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      var div = document.getElementById(evt.target.parentNode.id)
      div.style.zIndex = 1
      mods.ui.xstart = evt.clientX
      mods.ui.ystart = evt.clientY
      mods.ui.selected[evt.target.parentNode.id] = true
      window.addEventListener('mousemove', name_mousemove)
      window.addEventListener('mouseup', name_mouseup)
   }
   function name_mousemove(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      var t = mods_transform()
      for (var id in mods.ui.selected) {
         var div = document.getElementById(id)
         var dx = (evt.clientX - mods.ui.xstart) / t.s
         var dy = (evt.clientY - mods.ui.ystart) / t.s
         var newleft = parseFloat(div.dataset.left) + dx
         var newtop = parseFloat(div.dataset.top) + dy
         div.style.left = newleft + 'px'
         div.style.top = newtop + 'px'
         draw_links(id, mods.ui.link_color)
      }
   }
   function name_mouseup(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      var t = mods_transform()
      for (var id in mods.ui.selected) {
         var div = document.getElementById(id)
         div.style.zIndex = 0
         div.childNodes[0].style.fontWeight = 'normal'
         var dx = (evt.clientX - mods.ui.xstart) / t.s
         var dy = (evt.clientY - mods.ui.ystart) / t.s
         div.dataset.left = parseFloat(div.dataset.left) + dx
         div.dataset.top = parseFloat(div.dataset.top) + dy
         window.removeEventListener('mousemove', name_mousemove)
         window.removeEventListener('mouseup', name_mouseup)
      }
      mods.ui.selected = {}
   }
   function name_touchdown(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      var div = document.getElementById(evt.target.parentNode.id)
      div.style.zIndex = 1
      mods.ui.xstart = evt.changedTouches[0].pageX
      mods.ui.ystart = evt.changedTouches[0].pageY
      mods.ui.selected[evt.target.parentNode.id] = true
      window.addEventListener('touchmove', name_touchmove)
      window.addEventListener('touchend', name_touchup)
   }
   function name_touchmove(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      var t = mods_transform()
      for (var id in mods.ui.selected) {
         var div = document.getElementById(id)
         var dx = (evt.changedTouches[0].pageX - mods.ui.xstart) / t.s
         var dy = (evt.changedTouches[0].pageY - mods.ui.ystart) / t.s
         var newleft = parseFloat(div.dataset.left) + dx
         var newtop = parseFloat(div.dataset.top) + dy
         div.style.left = newleft + 'px'
         div.style.top = newtop + 'px'
         draw_links(id, mods.ui.link_color)
      }
   }
   function name_touchup(evt) {
      evt.preventDefault()
      evt.stopPropagation()
      var t = mods_transform()
      for (var id in mods.ui.selected) {
         var div = document.getElementById(id)
         div.style.zIndex = 0
         var dx = (evt.changedTouches[0].pageX - mods.ui.xstart) / t.s
         var dy = (evt.changedTouches[0].pageY - mods.ui.ystart) / t.s
         div.dataset.left = parseFloat(div.dataset.left) + dx
         div.dataset.top = parseFloat(div.dataset.top) + dy
         window.removeEventListener('touchmove', name_touchmove)
         window.removeEventListener('touchend', name_touchup)
      }
      mods.ui.selected = {}
   }
})()
