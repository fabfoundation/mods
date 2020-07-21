var fs = require('fs');
var root = '../../../../';

// load module table
var modules = {}
global.module_label = function () {}
global.module_menu = function (name, file) {
  var path = decodeURI(file);
  var without_num = path.replace(/[0-9]+ /g, '');
  modules[without_num] = path;
}
require(root + 'modules/index.js');

console.log(JSON.stringify({
  modules: {
    "0.47383876715576023": {
      "definition": find_module("image/distance transform"),
      "top": "1378.6725225179114",
      "left": "2971.3091038971106",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.07944144280928633": {
      "definition": find_module("image/edge detect"),
      "top": "821.3404091178356",
      "left": "3651.1950248818066",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.8903773266711255": {
      "definition": find_module("image/orient edges"),
      "top": "1295.647433071808",
      "left": "4146.182597823699",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.3135579179893032": {
      "definition": find_module("image/offset"),
      "top": "1319.8304896945303",
      "left": "3628.5407310657774",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.6488303557466412": {
      "definition": find_module("image/threshold"),
      "top": "1251.3915895175708",
      "left": "2523.8841781665624",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.2892270043957246": {
      "definition": find_module("toolpath/view/view toolpath"),
      "top": "960.1181538983565",
      "left": "2513.8605987816272",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.9557599338778935": {
      "definition": find_module("processes/mill raster/2D"),
      "top": "620.049185160661",
      "left": "2054.7722246266726",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.6542976287965465": {
      "definition": find_module("image/vectorize"),
      "top": "714.1171716543545",
      "left": "4213.924000935653",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.734583870574828": {
      "definition": find_module("read/svg"),
      "top": "776.060369561952",
      "left": "980.1655509442642",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.6332702301420967": {
      "definition": find_module("convert/svg/image"),
      "top": "769.341087208612",
      "left": "2951.9066577390404",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.4108919927664305": {
      "definition": "//\n// note\n//\n// Neil Gershenfeld \n// (c) Massachusetts Institute of Technology 2017\n// Modified by Francisco Sanchez 2019\n// \n// This work may be reproduced, modified, distributed, performed, and \n// displayed for any purpose, but must acknowledge the mods\n// project. Copyright is retained and must be preserved. The work is \n// provided as is; no warranty is provided, and users accept all \n// liability.\n//\n// closure\n//\n(function(){\n//\n// module globals\n//\nvar mod = {}\n//\n// name\n//\nvar name = 'note'\n//\n// initialization\n//\nvar init = function() {\n   mod.text.value = 'Step 1: Load either a PNG or SVG image'\n   }\n//\n// inputs\n//\nvar inputs = {}\n//\n// outputs\n//\nvar outputs = {}\n//\n// interface\n//\nvar interface = function(div){\n   mod.div = div\n   //\n   // text\n   //\n   var text = document.createElement('textarea')\n      text.style.backgroundColor='#D4E157';\n      text.setAttribute('rows',mods.ui.rows)\n      text.setAttribute('cols',mods.ui.cols)\n      div.appendChild(text)\n      mod.text = text\n   div.appendChild(document.createElement('br'))\n}\n//\n// local functions\n//\n;\n//\n// return values\n//\nreturn ({\n   mod:mod,\n   name:name,\n   init:init,\n   inputs:inputs,\n   outputs:outputs,\n   interface:interface\n   })\n}())\n",
      "top": "1124.3176634001654",
      "left": "739.9832061421682",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.3567086835996871": {
      "definition": find_module("read/png"),
      "top": "1253.5299795420854",
      "left": "958.9590949748581",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.6110857811111099": {
      "definition": "//\n// note\n//\n// Neil Gershenfeld \n// (c) Massachusetts Institute of Technology 2017\n// Modified by Francisco Sanchez 2019\n// \n// This work may be reproduced, modified, distributed, performed, and \n// displayed for any purpose, but must acknowledge the mods\n// project. Copyright is retained and must be preserved. The work is \n// provided as is; no warranty is provided, and users accept all \n// liability.\n//\n// closure\n//\n(function(){\n//\n// module globals\n//\nvar mod = {}\n//\n// name\n//\nvar name = 'note'\n//\n// initialization\n//\nvar init = function() {\n   mod.text.value = 'Option 1: If you are using the Startech or similar Serial to USB cable use the module below. Remember to start the servers in the mods folder\\n\\nbash mods\\n\\nAnd select 9600 baud RTSCTS flow control'\n   }\n//\n// inputs\n//\nvar inputs = {}\n//\n// outputs\n//\nvar outputs = {}\n//\n// interface\n//\nvar interface = function(div){\n   mod.div = div\n   //\n   // text\n   //\n   var text = document.createElement('textarea')\n      text.style.backgroundColor='#D4E157';\n      text.setAttribute('rows',7)\n      text.setAttribute('cols',50)\n      //\n      // watch textarea for resize\n      //\n      new MutationObserver(update_module).observe(text, {\n      attributes: true, attributeFilter: [ \"style\" ]\n      })\n      div.appendChild(text)\n      mod.text = text\n   div.appendChild(document.createElement('br'))\n}\n//\n// local functions\n//\n//\n// update module\n//\nfunction update_module() {\n   mods.fit(mod.div)\n   }\n//\n// return values\n//\nreturn ({\n   mod:mod,\n   name:name,\n   init:init,\n   inputs:inputs,\n   outputs:outputs,\n   interface:interface\n   })\n}())\n",
      "top": "1594.1790135911654",
      "left": "1448.0733636300781",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.46239892532131677": {
      "definition": "//\n// note\n//\n// Neil Gershenfeld \n// (c) Massachusetts Institute of Technology 2017\n// Modified by Francisco Sanchez 2019\n// \n// This work may be reproduced, modified, distributed, performed, and \n// displayed for any purpose, but must acknowledge the mods\n// project. Copyright is retained and must be preserved. The work is \n// provided as is; no warranty is provided, and users accept all \n// liability.\n//\n// closure\n//\n(function(){\n//\n// module globals\n//\nvar mod = {}\n//\n// name\n//\nvar name = 'note'\n//\n// initialization\n//\nvar init = function() {\n   mod.text.value = 'Option 2: If you are using the original black DB25 to USB cable from Roland use the module below. Remember to start the servers in the mods folder\\n\\nbash mods\\n\\nAnd select 9600 baud DSRDTR flow control'\n   }\n//\n// inputs\n//\nvar inputs = {}\n//\n// outputs\n//\nvar outputs = {}\n//\n// interface\n//\nvar interface = function(div){\n   mod.div = div\n   //\n   // text\n   //\n   var text = document.createElement('textarea')\n      text.style.backgroundColor='#D4E157';\n      text.setAttribute('rows',7)\n      text.setAttribute('cols',50)\n      //\n      // watch textarea for resize\n      //\n      new MutationObserver(update_module).observe(text, {\n      attributes: true, attributeFilter: [ \"style\" ]\n      })\n      div.appendChild(text)\n      mod.text = text\n   div.appendChild(document.createElement('br'))\n}\n//\n// local functions\n//\n//\n// update module\n//\nfunction update_module() {\n   mods.fit(mod.div)\n   }\n//\n// return values\n//\nreturn ({\n   mod:mod,\n   name:name,\n   init:init,\n   inputs:inputs,\n   outputs:outputs,\n   interface:interface\n   })\n}())\n",
      "top": "1568.0434174855448",
      "left": "2057.405033980427",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.2954395611750211": {
      "definition": find_module("defaults/PCB defaults"),
      "top": "83.61656047468743",
      "left": "1399.7453327118637",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.5014250484043365": {
      "definition": "//\n// label\n//\n// Neil Gershenfeld\n// (c) Massachusetts Institute of Technology 2018\n// Modified by Francisco Sanchez Arroyo 02-Feb-2020\n//\n// This work may be reproduced, modified, distributed, performed, and\n// displayed for any purpose, but must acknowledge the mods\n// project. Copyright is retained and must be preserved. The work is\n// provided as is; no warranty is provided, and users accept all\n// liability.\n//\n// closure\n//\n(function(){\n//\n// module globals\n//\nvar mod = {}\n//\n// name\n//\nvar name = 'label'\n//\n// initialization\n//\nvar init = function() {\n   mod.size.value = '400'\n   mod.text.value = 'Roland MDX PCB'\n   update_text()\n   }\n//\n// inputs\n//\nvar inputs = {\n}\n//\n// outputs\n//\nvar outputs = {\n}\n//\n//\n// interface\n//\nvar interface = function(div){\n   mod.div = div\n   //div.appendChild(document.createTextNode('font size: '))\n   input = document.createElement('input')\n      input.type = 'text'\n      input.size = 3\n      input.addEventListener('input',function(evt){\n         update_text()\n         })\n      //div.appendChild(input)\n      mod.size = input\n   //div.appendChild(document.createTextNode(' (%)'))\n   //div.appendChild(document.createElement('br'))\n   //div.appendChild(document.createTextNode('text: '))\n   input = document.createElement('input')\n      input.type = 'text'\n      input.size = 6\n      input.addEventListener('input',function(evt){\n         update_text()\n         })\n      //div.appendChild(input)\n      mod.text = input\n   //div.appendChild(document.createElement('br'))\n   var span = document.createElement('span')\n      var text = document.createTextNode('')\n         span.appendChild(text)\n         mod.label = text\n      div.appendChild(span)\n      mod.span = span\n   }\n//\n// local functions\n//\nfunction update_text() {\n   mod.label.nodeValue = mod.text.value\n   mod.span.style.fontSize = mod.size.value+'%'\n   mods.fit(mod.div)\n   }\n//\n// return values\n//\nreturn ({\n   mod:mod,\n   name:name,\n   init:init,\n   inputs:inputs,\n   outputs:outputs,\n   interface:interface\n   })\n}())\n",
      "top": "526.0101769077119",
      "left": "981.1588419082591",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.09608948225645808": {
      "definition": find_module("toolpath/machines/precision mill/Roland MDX-iModela"),
      "top": "1046.871490918737",
      "left": "1662",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.37344238243041894": {
      "definition": find_module("websockets/serial"),
      "top": "1834.2044550937114",
      "left": "1390.965037464211",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    },
    "0.13530687628255078": {
      "definition": find_module("websockets/pyserial"),
      "top": "1807.5892298008002",
      "left": "2009.5028732714684",
      "filename": "undefined",
      "inputs": {},
      "outputs": {}
    }
  },
  "links": [
    JSON.stringify({"source":JSON.stringify({"id":"0.07944144280928633","type":"outputs","name":"image"}),"dest":JSON.stringify({"id":"0.8903773266711255","type":"inputs","name":"image"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.47383876715576023","type":"outputs","name":"distances"}),"dest":JSON.stringify({"id":"0.3135579179893032","type":"inputs","name":"distances"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.3135579179893032","type":"outputs","name":"image"}),"dest":JSON.stringify({"id":"0.07944144280928633","type":"inputs","name":"image"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.6488303557466412","type":"outputs","name":"image"}),"dest":JSON.stringify({"id":"0.47383876715576023","type":"inputs","name":"image"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.9557599338778935","type":"outputs","name":"offset"}),"dest":JSON.stringify({"id":"0.3135579179893032","type":"inputs","name":"offset"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.9557599338778935","type":"outputs","name":"toolpath"}),"dest":JSON.stringify({"id":"0.2892270043957246","type":"inputs","name":"toolpath"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.8903773266711255","type":"outputs","name":"image"}),"dest":JSON.stringify({"id":"0.6542976287965465","type":"inputs","name":"image"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.6542976287965465","type":"outputs","name":"path"}),"dest":JSON.stringify({"id":"0.9557599338778935","type":"inputs","name":"path"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.734583870574828","type":"outputs","name":"SVG"}),"dest":JSON.stringify({"id":"0.6332702301420967","type":"inputs","name":"SVG"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.6332702301420967","type":"outputs","name":"imageInfo"}),"dest":JSON.stringify({"id":"0.9557599338778935","type":"inputs","name":"imageInfo"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.6332702301420967","type":"outputs","name":"image"}),"dest":JSON.stringify({"id":"0.6488303557466412","type":"inputs","name":"image"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.3567086835996871","type":"outputs","name":"image"}),"dest":JSON.stringify({"id":"0.6488303557466412","type":"inputs","name":"image"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.3567086835996871","type":"outputs","name":"imageInfo"}),"dest":JSON.stringify({"id":"0.9557599338778935","type":"inputs","name":"imageInfo"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.2954395611750211","type":"outputs","name":"settings"}),"dest":JSON.stringify({"id":"0.9557599338778935","type":"inputs","name":"settings"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.9557599338778935","type":"outputs","name":"toolpath"}),"dest":JSON.stringify({"id":"0.09608948225645808","type":"inputs","name":"path"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.09608948225645808","type":"outputs","name":"file"}),"dest":JSON.stringify({"id":"0.37344238243041894","type":"inputs","name":"file"})}),
    JSON.stringify({"source":JSON.stringify({"id":"0.09608948225645808","type":"outputs","name":"file"}),"dest":JSON.stringify({"id":"0.13530687628255078","type":"inputs","name":"file"})}),
  ]
}))

function find_module(name) {
  var file = modules['modules/' + name + '.js'];
  if (!file)
    throw "couldn't find module '" + name + "'";

  return fs.readFileSync(root + file).toString();
}
