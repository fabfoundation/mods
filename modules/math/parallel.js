//
// parallel
//
// Thrasyvoulos Karydis
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
(function () {
//
// module globals
//
var mod = {};
//
// name
//
var name = 'parallel';
//
// initialization
//
var init = function () {
    mod.terms.value = '1e8';
    mod.threads.value = '4'
};
//
// inputs
//
var inputs = {
    start: {
        type: 'event',
        event: function (evt) {
            benchmark()
        }
    }
};
//
// outputs
//
var outputs = {};
//
// interface
//
var interface = function (div) {
    mod.div = div;
    div.appendChild(document.createTextNode('parallel threads: '));
    var input = document.createElement('input');
    input.type = 'text';
    input.size = 6;
    div.appendChild(input);
    mod.threads = input;

    div.appendChild(document.createElement('br'));
    div.appendChild(document.createTextNode('terms to sum: '));
    var input = document.createElement('input');
    input.type = 'text';
    input.size = 6;
    div.appendChild(input);
    mod.terms = input;

    div.appendChild(document.createElement('br'));
    var btn = document.createElement('button');
    btn.style.padding = mods.ui.padding;
    btn.style.margin = 1;
    var text = document.createTextNode('calculate pi');
    mod.label = text;
    btn.appendChild(text);
    btn.addEventListener('click', function () {
        benchmark()
    });
    mod.button = btn;
    div.appendChild(btn);
    div.appendChild(document.createElement('br'));
    var text = document.createTextNode('value: ');
    div.appendChild(text);
    mod.value = text;
    div.appendChild(document.createElement('br'));
    var text = document.createTextNode('time (s): ');
    div.appendChild(text);
    mod.time = text;
    div.appendChild(document.createElement('br'));
    var text = document.createTextNode('Mflops: ');
    div.appendChild(text);
    mod.mflops = text;


};
//
// local functions
//
//
function benchmark() {
    mod.label.nodeValue = 'calculating';
    //
    // Split pi computation by number of workers
    //
    var terms = parseFloat(mod.terms.value);
    var threads = parseFloat(mod.threads.value);
    var inds = [];
    for (var k = 1; k < terms; k += (terms/threads)){
        inds.push(k);}
    inds.push(terms);
    //
    // Spawn workers
    //
    var finished = [];
    var sum_pi = 0;

    var st_tm = Date.now();
    for (var i = 0; i < threads; i++) {
        var blob = new Blob(['(' + worker.toString() + '())']);
        var url = window.URL.createObjectURL(blob);
        var webworker = new Worker(url);
        webworker.addEventListener('message', function (evt) {
            var pi = evt.data.pi;
            finished.push('done');
            sum_pi += pi;
            if (finished.length == threads){
                mod.value.nodeValue = 'value: ' + sum_pi.toFixed(6);
                var sec = (Date.now()-st_tm)/1000;
                mod.time.nodeValue = 'time (s): ' + sec;
                var mflops = 5 * terms / (sec * 1e6);
                mod.mflops.nodeValue = 'Mflops: ' + mflops.toFixed(0);
                mod.label.nodeValue = 'calculate pi';
                sum_pi = 0;
                finished = [];
            }
            this.terminate()
        });
        webworker.postMessage({start: inds[i],end: inds[i+1]})
    }
    window.URL.revokeObjectURL(url);
}

//

function worker() {
    self.addEventListener('message', function (evt) {
        var start = evt.data.start;
        var end = evt.data.end;
        var pi = 0;
        var tstart = Date.now();
        for (var term = start; term < end; ++term)
            pi += 0.5 / ((term - 0.75) * (term - 0.25))
        var tend = Date.now();
        var dt = tend - tstart;
        self.postMessage({pi: pi, dt: dt})
    })
}

//
// return values
//
return ({
   mod:mod,
    name: name,
    init: init,
    inputs: inputs,
    outputs: outputs,
    interface: interface
    })

}());
