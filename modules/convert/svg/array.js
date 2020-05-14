//
// nest multiple SVGs into a single SVG
//
// Sam Calisch
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

var modParam = {
  'parameters':{
      'stock_width':50.,
      'stock_height':24.,
      'padding':.25}    //algorithm parameters, and default values
}
//
// name
//
var name = 'nest SVG Array'
//
// initialization
//
var init = function() {
    mod.stock_width.value = modParam.parameters.stock_width;
    mod.stock_height.value = modParam.parameters.stock_height;
    mod.padding.value = modParam.parameters.padding;

   }
//
// inputs
//
var inputs = {
   SVGArray:{type:'object',
      event:function(evt) {
         mod.svg_array = evt.detail;
         nest(mod.svg_array);
         }}}
//
// outputs
//
var outputs = {
   SVG:{type:'string',
      event:function(){
         var str = new XMLSerializer().serializeToString(mod.bigview);
         mods.output(mod,'SVG',str)}},
   // TODO: make another output for parts that don't fit
   //Leftovers:{type:'object',
   //   event:function(){
   //      mods.output(mod,'Leftovers',mod.leftovers)}}
   }
//
// interface
//
var interface = function(div){
   mod.div = div

   // on-screen drawing canvas
   var smallview = document.createElementNS("http://www.w3.org/2000/svg", "svg");//document.createElement('canvas');
      smallview.setAttribute('width',mods.ui.canvas);
      smallview.setAttribute('height',mods.ui.canvas);
      smallview.setAttribute('preserveAspectRatio','xMinYMin meet');
      div.appendChild(smallview);
      mod.smallview = smallview;
   div.appendChild(document.createElement('br'));

   // off-screen image canvas
   mod.bigview = document.createElementNS("http://www.w3.org/2000/svg", "svg"); 

   //add parameter inputs
   Object.keys(modParam.parameters).forEach(function (p) {
    var textnode = document.createElement('span');
    textnode.innerHTML = p+': ';
    textnode.style="display: inline-block; width: 80px; font-size: 12px;";
    div.appendChild(textnode);
    var input_text = document.createElement('input');
    var input_max = document.createElement('input');
    var input_range = document.createElement('input') //add slider

      //value text
      input_text.type='text';
      input_text.size=3;
      mod[p] = input_text; //set initial minimum slider value
      div.appendChild(input_text);
      input_text.addEventListener('blur',function(){
         input_range.value = (100 * input_text.value / input_max.value);
         nest(mod.svg_array);
      });

      //slider
      input_range.type = 'range'; 
      input_range.min = 0; input_range.max = 100;
      input_range.value = 50; 
      input_range.style = '-webkit-appearance: none; width: 80px; height: 0px; border: none; margin-top: -4px; margin-left:2px;';
      input_range.addEventListener('input',function(){
         input_text.value = input_max.value * input_range.value/100.0;
         nest(mod.svg_array);
      });
      div.appendChild(input_range);

      //max text
      input_max.type='text';
      input_max.size=2;
      input_max.value = 2 * modParam.parameters[p]; //set initial maximum to twice default value
      input_max.addEventListener('blur',function(){
         input_range.value = 100 * input_text.value / input_max.value;
         input_text.value = Math.min( input_text.value, input_max.value );  
         nest(mod.svg_array);
      });
      div.appendChild(input_max);

    div.appendChild(document.createElement('br'));
   });

   // view button
   var btn = document.createElement('button')
      btn.style.padding = mods.ui.padding
      btn.style.margin = 1
      btn.appendChild(document.createTextNode('view'))
      btn.addEventListener('click',function(){
         var win = window.open('')
         var btn = document.createElement('button')
            btn.appendChild(document.createTextNode('close'))
            btn.style.padding = mods.ui.padding
            btn.style.margin = 1
            btn.addEventListener('click',function(){
               win.close()
               })
            win.document.body.appendChild(btn)
         win.document.body.appendChild(document.createElement('br'))
            mod.bigview.setAttribute('width', mod.stock_width.value+"in");
            mod.bigview.setAttribute('height', mod.stock_height.value+"in" );
            mod.bigview.setAttribute('preserveAspectRatio','xMinYMin meet');
            win.document.body.appendChild(mod.bigview);
         })
      div.appendChild(btn)
      div.appendChild(document.createTextNode(' draw grid?'));
      var draw_grid = document.createElement('input')
      mod.draw_grid = draw_grid;
      draw_grid.type = 'checkbox'
      draw_grid.name = mod.div.id+'grid'
      draw_grid.id = mod.div.id+'grid'
      draw_grid.checked = false
      draw_grid.addEventListener('change',function(){nest(mod.svg_array);});
      div.appendChild(draw_grid)
   div.appendChild(document.createElement('br'))
   }
//
// local functions

function nest(sw_json){
   if (!sw_json) return
   //sw_json is text json exported from soliworks of the form [{partTitle:”Part-1”, thickness:20, count:2, svgArray:[svgf1, svgf2, …],{partTitle:”Part-2”, thickness:20, count:3, svgArray:[svgf3, svgf4, …]
   //stocksize is an array [width,height] of stock dimensions
   //we scale so the stock size takes up the %75 of screen
   //padding is an amount to leave between each piece
   var unitScale = sw_json[0].unit === "mm"?1000:1;
   var stocksize = [mod.stock_width.value/39.3*unitScale, mod.stock_height.value/39.3*unitScale]; //convert to meters
   //TODO: handle units more gracefully!
   var padding = mod.padding.value/39.3*unitScale;
   var draw_grid = false;

   //make sure first dimension is longer
   //if (stocksize[1] > stocksize[0]) stocksize = [stocksize[1],stocksize[0]];

   //fit stock width to page
   var scale = mod.smallview.width/stocksize[0]; 

   var partName = sw_json[0]['partName'];
   var thickness = sw_json[0]['thickness'];
   var count = sw_json[0]['count'];
   var svgs = [];
   //deal with multiple parts from SW
   for(var i=0; i<sw_json.length; ++i){
      svgs = svgs.concat(sw_json[i].svgArray);
   }

   //create SVG for output
   var svgNS = "http://www.w3.org/2000/svg";
   //var nested = document.createElementNS("http://www.w3.org/2000/svg", "svg");
   mod.smallview.innerHTML=''; //delete previous children
   
   //mod.smallview.setAttribute('width',(stocksize[0])*scale  );
   //mod.smallview.setAttribute('height',(stocksize[1])*scale  );
   mod.smallview.setAttribute('viewBox', "0 0 "+stocksize[0]+" "+stocksize[1]);

   //draw stock outline
   var stock = document.createElementNS(svgNS,'rect');
   stock.setAttribute('x', 0); stock.setAttribute('y', 0);
   stock.setAttribute('width', stocksize[0]); stock.setAttribute('height', stocksize[1]);
   stock.setAttribute('style', 'fill:rgb(0,0,0);')
   //stock.setAttribute('class','annotation'); //label for removal on output
   mod.smallview.appendChild(stock);

   var gs = [] //container for the g elements
   svgs.forEach(function(svg){
      var g = document.createElementNS(svgNS,'g');
      g.innerHTML = svg;
      var svg_tree = g.firstChild;
      var vb = svg_tree.getAttribute('viewBox').split(" ").map(parseFloat);
      svg_tree.setAttribute('viewBox',(vb[0]-.5*padding)+" "+(vb[1]-.5*padding)+" "+(vb[2]+.5*padding)+" "+(vb[3]+.5*padding));
      svg_tree.setAttribute('width', vb[2]+padding); svg_tree.setAttribute('height', vb[3]+padding);
      g.setAttribute('w',vb[2]+padding); //use a foreign tag to bring width and height info along as we tranform 
      g.setAttribute('h',vb[3]+padding); 
      mod.smallview.appendChild(g);
      gs.push(g);
   });

   //orient so long axis is horizontal. if this is not the case, rotate
   gs.forEach(function(g){
      w = g.getAttribute('w'); h = g.getAttribute('h');
      if (h>w){
         g.setAttribute('transform','translate(0,'+w+') rotate(-90)' );
         g.setAttribute('w',h); g.setAttribute('h',w);
      } else{
         g.setAttribute('transform','' );
      }
   });

   //then sort by long dimension in descending order
   gs = gs.sort( function(g1,g2){ return g2.getAttribute('w') -  g1.getAttribute('w')} );


   //then place first and calculate the left over rectangles
   function fill_rect(b1,b2,remaining_shapes){
      if (mod.draw_grid.checked){
         node = document.createElementNS("http://www.w3.org/2000/svg", "rect");
         node.setAttribute('x',b1[0]); node.setAttribute('y',b1[1]);
         node.setAttribute('width',b2[0]-b1[0]);
         node.setAttribute('height',b2[1]-b1[1]);
         node.setAttribute('class','annotation'); //label for removal on output
         node.setAttribute('style','fill:none;stroke-width:.001;stroke:rgb(0,0,255)');
         mod.smallview.appendChild(node);
      }


      //fill a rectangle defined by point b1 to point b2 with the first element from remaining_shapes that fits
      var dx = b2[0]-b1[0]; 
      var dy = b2[1]-b1[1];
      for(i=0; i<remaining_shapes.length; i++){
         var gi = remaining_shapes[i];
         var w = parseFloat(gi.getAttribute('w'));
         var h = parseFloat(gi.getAttribute('h'));
         if (w <= dx+.000001 && h <= dy+.00001){ //successfully placed shape i
            remaining_shapes.splice(i,1); //remove shape i from remaining shapes
            gi.setAttribute('transform', 'translate('+(b1[0])+','+(b1[1])+') '+gi.getAttribute('transform')); //use base point as transform
            fill_rect([b1[0],b1[1]+h],[b1[0]+w,b2[1]],remaining_shapes); //prioritize filling lower rectangle
            fill_rect([b1[0]+w,b1[1]],b2,remaining_shapes);           //then fill right rectangle
            break; //break out of for loop
         }
      }

   }
   fill_rect([.5*padding,.5*padding],[stocksize[0]-.5*padding,stocksize[1]-.5*padding],gs);
      
   //HACK: don't show parts that don't fit
   gs.forEach(function(g){
      g.innerHTML = ''; //delete!
   });   


   //create bigview svg from smallview svg
   mod.bigview.setAttribute( 'viewBox', mod.smallview.getAttribute('viewBox') );
   mod.bigview.innerHTML = mod.smallview.innerHTML;
   mod.bigview.setAttribute('width', mod.stock_width.value+"in");
   mod.bigview.setAttribute('height', mod.stock_height.value+"in" );

   //output events
   //mod.leftovers = [];
   outputs.SVG.event()


   /*

   //highlight parts that didn't fit
   gs.forEach(function(g){
      var svg = g.firstChild;
      var style = svg.firstChild.getAttribute('style');
      svg.firstChild.setAttribute('style',style+'stroke-width:'+.002*stocksize[0]+'; stroke:rgb(255,0,0)')
   });
   //nest parts that don't fit, note: this could just be done on another page.
   if (gs.length > 0){
      fill_rect([.5*padding,.5*padding],[stocksize[0]-.5*padding,stocksize[1]-.5*padding],gs);
   }
   */
}

//
// return values
//
return ({
   mod:mod,
   name:name,
   init:init,
   inputs:inputs,
   outputs:outputs,
   interface:interface
   })
}())
