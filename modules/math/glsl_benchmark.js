//
// benchmark
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2016
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
// closure
//
(function(){
//
// module globals
//
var mod = {}
//
// name
//
var name = 'glsl_benchmark'
//
// initialization
//
var init = function() {
   mod.terms.value = '1e8'
   }
//
// inputs
//
var inputs = {
   start:{type:'event',
      event:function(evt){
         benchmark()}}}
//
// outputs
//
var outputs = {
   }
//
// interface
//
var interface = function(div){
   mod.div = div
   var canvas = document.createElement('canvas');
   canvas.style.display = "none";
    div.appendChild(canvas)
   div.appendChild(document.createTextNode('terms to sum: '))
   var input = document.createElement('input')
      input.type = 'text'
      input.size = 6
      div.appendChild(input)
      mod.terms = input
   div.appendChild(document.createElement('br'))
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      var text = document.createTextNode('calculate pi')
         mod.label = text
         btn.appendChild(text)
      btn.addEventListener('click',function() {
         benchmark()
         })
      mod.button = btn
      div.appendChild(btn)
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('value: ')
      div.appendChild(text)
      mod.value = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('time (s): ')
      div.appendChild(text)
      mod.time = text
   div.appendChild(document.createElement('br'))
   var text = document.createTextNode('Mflops: ')
      div.appendChild(text)
      mod.mflops = text
   }
//
// local functions
//
function benchmark() {
   mod.label.nodeValue = 'calculating';
   var numTerms = parseFloat(mod.terms.value);


    var output = calcPI(numTerms);

      mod.value.nodeValue = 'value: '+output.pi.toFixed(6);
      var sec = output.dt/1000
      mod.time.nodeValue = 'time (s): '+sec
      var mflops = 5*numTerms/(sec*1e6)
      mod.mflops.nodeValue = 'Mflops: '+mflops.toFixed(0)
      mod.label.nodeValue = 'calculate pi'
   }

    var vertexShaderSource = "" +
        "attribute vec2 a_position;"+
        "void main() { "+
           "gl_Position = vec4(a_position, 0, 1);"+
        "}"

    var fragmentShaderSource = "" +
        "precision mediump float;"+
        "uniform float u_matrixDim;"+
        "uniform float u_offset;"+
        "" +
        "float shift_right (float v, float amt) {" +
            "v = floor(v) + 0.5;" +
            "return floor(v / exp2(amt));" +
        "}"+
        "float shift_left (float v, float amt) {" +
            "return floor(v * exp2(amt) + 0.5);" +
        "}"+
        "float mask_last (float v, float bits) {"+
            "return mod(v, shift_left(1.0, bits));"+
        "}"+
        "float extract_bits (float num, float from, float to) {"+
            "from = floor(from + 0.5); to = floor(to + 0.5);"+
            "return mask_last(shift_right(num, from), to - from);"+
        "}"+
        "vec4 encode_float (float val) {"+
            "if (val == 0.0) return vec4(0, 0, 0, 0);"+
            "float sign = val > 0.0 ? 0.0 : 1.0;"+
            "val = abs(val);"+
            "float exponent = floor(log2(val));"+
            "float biased_exponent = exponent + 127.0;" +
            "float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0;"+
            "float t = biased_exponent / 2.0;"+
            "float last_bit_of_biased_exponent = fract(t) * 2.0;"+
            "float remaining_bits_of_biased_exponent = floor(t);"+
            "float byte4 = extract_bits(fraction, 0.0, 8.0) / 255.0;" +
            "float byte3 = extract_bits(fraction, 8.0, 16.0) / 255.0;" +
            "float byte2 = (last_bit_of_biased_exponent * 128.0 + extract_bits(fraction, 16.0, 23.0)) / 255.0;" +
            "float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;" +
            "return vec4(byte4, byte3, byte2, byte1);" +
        "}"+
        "" +
        "void main(){" +
            "vec2 fragCoord = gl_FragCoord.xy;"+
            "float index = fragCoord.x + 0.5 + (fragCoord.y-0.5)*u_matrixDim + u_offset;"+
            "gl_FragColor = encode_float(0.5/((index-0.75)*(index-0.25)));"+
        "}";

/**
 * Created by ghassaei on 2/20/16.
 */

function calcPI(numTerms) {

    // Get A WebGL context
    var canvas = document.getElementsByTagName("canvas")[0];
    var gl = canvas.getContext("webgl", {antialias:false}) || canvas.getContext("experimental-webgl", {antialias:false});
    if (!gl) {
        alert('Could not initialize WebGL, try another browser');
        return;
    }

    gl.disable(gl.DEPTH_TEST);
    gl.getExtension('OES_texture_float');

    var matrixDim = 1024;
    var matrixSize = matrixDim*matrixDim;
    gl.viewport(0, 0, matrixDim, matrixDim);
    canvas.clientWidth = matrixDim;
    canvas.clientHeight = matrixDim;

    var numMatrices = Math.ceil(numTerms/matrixSize);


    var offsets = [];
    for (var i=0;i<numMatrices;i++){
        offsets.push(matrixSize*i);
    }

    //setup a GLSL program
    var piProgram = createProgramFromScripts(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(piProgram);
    loadVertexData(gl, piProgram);

    var piTextures = [];
    var piFrameBuffers = [];
    for (var i=0;i<numMatrices;i++){
        var piTexture = makeTexture(gl, matrixDim, matrixDim, gl.UNSIGNED_BYTE, null);
        var piFrameBuffer = makeFrameBuffer(gl, piTexture);
        piTextures.push(piTexture);
        piFrameBuffers.push(piFrameBuffer);
    }
    gl.uniform1f(gl.getUniformLocation(piProgram, "u_matrixDim"), matrixDim);
    var offsetLocation = gl.getUniformLocation(piProgram, "u_offset");

    var pixels = new Uint8Array(matrixSize*4);

    var tstart = Date.now();

    gl.useProgram(piProgram);
    for (var i=0;i<numMatrices;i++){
        gl.uniform1f(offsetLocation, offsets[i]);
        gl.bindFramebuffer(gl.FRAMEBUFFER, piFrameBuffers[i]);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);//draw to framebuffer
    }

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {

        var pi = 0;
        for (var i=0;i<numMatrices;i++){
            gl.bindFramebuffer(gl.FRAMEBUFFER, piFrameBuffers[i]);
            gl.readPixels(0, 0, matrixDim, matrixDim, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            var parsedPixels = new Float32Array(pixels.buffer);
            for (var j=0;j<parsedPixels.length;j++){
                pi += parsedPixels[j];
            }
        }
        var tend = Date.now();

        return {dt:tend-tstart, pi:pi, terms:pixels.length};
    }
}



function loadVertexData(gl, program) {
   gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ -1,-1, 1,-1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    // look up where the vertex data needs to go.
   var positionLocation = gl.getAttribLocation(program, "a_position");
   gl.enableVertexAttribArray(positionLocation);
   gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
}

function makeFrameBuffer(gl, texture){
    var framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    return framebuffer;
}

function makeTexture(gl, width, height, type, data){

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, type, data);

    //gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
}


//from http://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

/**
 * Creates and compiles a shader.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} shaderSource The GLSL source code for the shader.
 * @param {number} shaderType The type of shader, VERTEX_SHADER or
 *     FRAGMENT_SHADER.
 * @return {!WebGLShader} The shader.
 */
function compileShader(gl, shaderSource, shaderType) {
  // Create the shader object
  var shader = gl.createShader(shaderType);

  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check if it compiled
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }

  return shader;
}

/**
 * Creates a program from 2 shaders.
 *
 * @param {!WebGLRenderingContext) gl The WebGL context.
 * @param {!WebGLShader} vertexShader A vertex shader.
 * @param {!WebGLShader} fragmentShader A fragment shader.
 * @return {!WebGLProgram} A program.
 */
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  var program = gl.createProgram();

  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link the program.
  gl.linkProgram(program);

  // Check if it linked.
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }

  return program;
}

/**
 * Creates a shader from the content of a script tag.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} scriptId The id of the script tag.
 * @param {string} opt_shaderType. The type of shader to create.
 *     If not passed in will use the type attribute from the
 *     script tag.
 * @return {!WebGLShader} A shader.
 */
function createShaderFromScript(gl, shaderSource, shaderType) {
  // look up the script tag by id.
  //var shaderScript = document.getElementById(scriptId);
  //if (!shaderScript) {
  //  throw("*** Error: unknown script element" + scriptId);
  //}
  //
  //// extract the contents of the script tag.
  //var shaderSource = shaderScript.text;

  return compileShader(gl, shaderSource, shaderType);
}

/**
 * Creates a program from 2 script tags.
 *
 * @param {!WebGLRenderingContext} gl The WebGL Context.
 * @param {string} vertexShaderId The id of the vertex shader script tag.
 * @param {string} fragmentShaderId The id of the fragment shader script tag.
 * @return {!WebGLProgram} A program
 */
function createProgramFromScripts(
    gl, vertexSource, fragmentSource) {
  var vertexShader = createShaderFromScript(gl, vertexSource, gl.VERTEX_SHADER);
  var fragmentShader = createShaderFromScript(gl, fragmentSource, gl.FRAGMENT_SHADER);
  return createProgram(gl, vertexShader, fragmentShader);
}




return ({
   mod:mod,
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())
