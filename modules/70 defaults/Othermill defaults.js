//
// set object
//
// Neil Gershenfeld
// (c) Massachusetts Institute of Technology 2018
// Modified by Francisco Sanchez Arroyo 29/01/2020
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
    var name = 'set Othermill defaults'
    //
    // initialization
    //
    var init = function() {
        //
        add_output('PCB traces (1/64)')
        add_variable('tool diameter (mm)', 'var00')
        mod.var00.value = '0.4'
        add_variable('cut depth (mm)', 'var01')
        mod.var01.value = '0.15'
        add_variable('max depth (mm)', 'var02')
        mod.var02.value = '0.15'
        add_variable('offset number', 'var03')
        mod.var03.value = '4'
        add_variable('cut speed (mm/s)', 'var04')
        mod.var04.value = '6.35'
        add_variable('plunge speed (mm/s)', 'var05')
        mod.var05.value = '6.35'
        add_variable('spindle speed (rpm)', 'var06')
        mod.var06.value = '16400'
        add_variable('overlap', 'var07')
        mod.var07.value = '50'
        add_variable('error', 'var08')
        mod.var08.value = '1.1'
        add_variable('merge', 'var09')
        mod.var09.value = '1.5'
        //
        add_output('PCB outline (1/32)')
        add_variable('tool diameter (mm)', 'var10')
        mod.var10.value = '0.79'
        add_variable('cut depth (mm)', 'var11')
        mod.var11.value = '0.6'
        add_variable('max depth (mm)', 'var12')
        mod.var12.value = '1.70'
        add_variable('offset number', 'var13')
        mod.var13.value = '1'
        add_variable('cut speed (mm/s)', 'var14')
        mod.var14.value = '25'
        add_variable('plunge speed (mm/s)', 'var15')
        mod.var15.value = '6.36'
        add_variable('spindle speed (rpm)', 'var16')
        mod.var16.value = '16400'
        add_variable('overlap', 'var17')
        mod.var17.value = '50'
        add_variable('error', 'var18')
        mod.var18.value = '1.1'
        add_variable('merge', 'var19')
        mod.var19.value = '1.5'
        //
        //
    }

    /*




          //
          // raster input processes
          //
          mod_add_process([
             ["name", "7/16 plywood (1/8 mill)"],
             ["module", "othermill"],
             ["controls", "mod_path_image_22D_controls"],
             ["routine", "mod_othermill_path"],
             ["command", "gedit"],
             ["diameter", "3.175"],
             ["cut_speed", "25"],
             ["plunge_speed", "6.35"],
             ["spindle_speed", "16400"],
             ["offsets", "1"],
             ["overlap", "0"],
             ["error", "1.1"],
             ["merge", "1.5"],
             ["depth", "3.175"],
             ["thickness", "11.11"],
          ])
          mod_add_process([
             ["name", "1/2 HDPE (1/8 mill)"],
             ["module", "othermill"],
             ["controls", "mod_path_image_22D_controls"],
             ["routine", "mod_othermill_path"],
             ["command", "gedit"],
             ["diameter", "3.175"],
             ["cut_speed", "10"],
             ["plunge_speed", ".6"],
             ["spindle_speed", "16400"],
             ["offsets", "1"],
             ["overlap", "0"],
             ["error", "1.1"],
             ["merge", "1.5"],
             ["depth", "3.175"],
             ["thickness", "12.7"],
          ])
          mod_add_process([
             ["name", "foam rough cut (1/8)"],
             ["module", "othermill"],
             ["controls", "mod_path_image_25D_controls"],
             ["routine", "mod_othermill_path"],
             ["command", "gedit"],
             ["cut_speed", "25"],
             ["plunge_speed", "8.3"],
             ["spindle_speed", "16400"],
             ["depth", "3.175"],
             ["diameter", "3.175"],
             ["overlap", "50"],
             ["offsets", "-1"],
             ["error", "1.1"],
             ["merge", "1.5"],
          ])
          mod_add_process([
             ["name", "foam finish cut (1/8)"],
             ["module", "othermill"],
             ["controls", "mod_path_image_3D_controls"],
             ["routine", "mod_othermill_path"],
             ["command", "gedit"],
             ["cut_speed", "25"],
             ["plunge_speed", "8.3"],
             ["spindle_speed", "16400"],
             ["diameter", "3.175"],
             ["length", "25.4"],
             ["overlap", "90"],
             ["error", "1.1"],
          ])
     
          ])
      
          ])
          mod_add_process([
             ["name", "PCB traces (0.010)"],
             ["module", "othermill"],
             ["controls", "mod_path_image_21D_controls"],
             ["routine", "mod_othermill_path"],
             ["command", "gedit"],
             ["cut_speed", "2"],
             ["plunge_speed", "1"],
             ["spindle_speed", "16400"],
             ["depth", "0.1"],
             ["diameter", "0.254"],
             ["offsets", "1"],
             ["overlap", "50"],
             ["error", "1.1"],
             ["merge", "1.5"],
          ])
       }
    */






    //
    // inputs
    //
    var inputs = {}
    //
    // outputs
    //
    var outputs = {
        settings: {
            type: '',
            event: function(vars) {
                mods.output(mod, 'settings', vars)
            }
        }
    }
    //
    // interface
    //
    var interface = function(div) {
        mod.div = div
    }
    //
    // local functions
    //
    function add_output(label) {
        if (mod.settings == undefined) {
            mod.settings = {}
        }
        var btn = document.createElement('button')
        btn.style.padding = mods.ui.padding
        btn.style.margin = 1
        var span = document.createElement('span')
        var text = document.createTextNode(label)
        span.appendChild(text)
        btn.appendChild(span)
        var f = function(label) {
            btn.addEventListener('click', function() {
                for (var s in mod.settings)
                    mod.settings[s].span.style.fontWeight = 'normal'
                mod.settings[label].span.style.fontWeight = 'bold'
                var vars = {}
                for (var v in mod.settings[label].variables)
                    vars[v] = mod.settings[label].variables[v].value
                outputs.settings.event(vars)
            })
        }(label)
        mod.settings[label] = {
            span: span,
            variables: {}
        }
        mod.div.appendChild(btn)
        mod.setting = label
        mod.div.appendChild(document.createElement('br'))
    }

    function add_variable(label, variable) {
        var text = document.createTextNode(label)
        mod.div.appendChild(text)
        mod.div.appendChild(document.createTextNode(': '))
        input = document.createElement('input')
        input.type = 'text'
        input.size = 10
        mod[variable] = input
        mod.div.appendChild(input)
        mod.settings[mod.setting].variables[label] = input
        mod.div.appendChild(document.createElement('br'))
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
