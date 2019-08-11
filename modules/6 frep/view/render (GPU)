//
// frep GPU volume renderer
//
// Neil Gershenfeld and Amira Abdel-Rahman
// (c) Massachusetts Institute of Technology 2016
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the mods
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//
//
// closure
//
(function(){
//
// module globals
//
var mod = {};
//
// name
//
var name = 'render GPU';
//
// initialization
//
var init = function() {
   mod.steps.value=256.0;
   mod.alphaCorrection=10.0;
   mod.rendType="0";
   mod.windowOpen=false;
   mod.xLimit1 =-1.0 ;
   mod.xLimit2 =1.0 ; 
   mod.yLimit1 =-1.0 ; 
   mod.yLimit2 =1.0 ; 
   mod.zLimit1 =-1.0 ; 
   mod.zLimit2 =1.0 ;
   mod.height=10.0;
   mod.width=10.0;
   mod.rendPerformance=0;
   };
//
// inputs
//
var inputs = {
   shape:{type:'frep',
   event:function(evt){

      mod.shape=evt.detail;

      // outputs.messageLog.event(mod.shape.limits);

      //get largerst range and rescale other ones to adjust limit mapping
      var tempIndex=0;
      var tempMax=-1.0;

      for(i=0;i<mod.shape.limits.length;i++)
      {
         if((mod.shape.limits[i][1]-mod.shape.limits[i][0]) >= tempMax )
         {
            tempIndex=i;
            tempMax=mod.shape.limits[i][1]-mod.shape.limits[i][0];
         }
      }
      for(i=0;i < mod.shape.limits.length;i++)
      {
         if(i!=tempIndex)
         {
            var tempDif = (mod.shape.limits[tempIndex][1]-mod.shape.limits[tempIndex][0])-(mod.shape.limits[i][1]-mod.shape.limits[i][0]);
            mod.shape.limits[i][0]-=tempDif/2.0;
            mod.shape.limits[i][1]+=tempDif/2.0;
            
         }
      }

      mod.xLimit1=mod.shape.limits[0][0] ;
      mod.xLimit2=mod.shape.limits[0][1] ; 
      mod.yLimit1=mod.shape.limits[1][0] ; 
      mod.yLimit2=mod.shape.limits[1][1] ; 
      mod.zLimit1=mod.shape.limits[2][0] ; 
      mod.zLimit2=mod.shape.limits[2][1] ;
      
      //
      //turn function string to glsl
	  //
	  
	  //remove all Math.
      var str1 = mod.shape.function;
	  str1=str1.replace(/Math./g, '');
	  
	  //change atan2 functions to atan
	  str1=str1.replace(/atan2/g, "atan");
         
      //change all % to mod(,)
      while(str1.indexOf("%")>-1) //While '%' is there
      {
         //get location
         var modLocation=str1.indexOf("%");
         //replace with ','
         str1=str1.replace(/%/, ",");
         outputs.messageLog.event("1:"+str1);

         //parse before
         var counterBefore=modLocation;
         var count=0;
         if(str1[--counterBefore]==')')
         {
            count++;
            while(count>0)
            {
               counterBefore--;
               if(str1[counterBefore]==')')
               {
                  count++;

               }else if (str1[counterBefore]=='(')
               {
                  count--;
               }
            }
         }else{
            while(!isNaN(str1[counterBefore]) ||(str1[counterBefore]=='.')||(str1[counterBefore]=='X') ||(str1[counterBefore]=='Y')||(str1[counterBefore]=='Z'))
            {
               counterBefore--;
            }

         }
         
         
         //parse after
         var counterAfter=modLocation;
         count=0;
         if(str1[++counterAfter]=='(')
         {
            count++;
            while(count>0)
            {
               counterAfter++;
               if(str1[counterAfter]=='(')
               {
                  count++;

               }else if (str1[counterAfter]==')')
               {
                  count--;
               }
            }
         }else
         {
            while(!isNaN(str1[counterAfter]) ||(str1[counterAfter]=='.')||(str1[counterAfter]=='X') ||(str1[counterAfter]=='Y')||(str1[counterAfter]=='Z'))
            {
               counterAfter++;
            }
         }
         
         str1 = str1.substr(0, counterAfter) + ")" + str1.substr(counterAfter);
         str1 = str1.substr(0, counterBefore) + "mod(" + str1.substr(counterBefore);
      }

      //turn all ints to floatS
      var str='';
      for(var i=0;i<str1.length;i++)
      {
         //if number
         if(!isNaN(str1[i]))
         {
            str+=str1[i];
            //check next value
            for(var j=i+1;j<str1.length;j++)
            {
            //if number add and continue
            if(!isNaN(str1[j])) 
            {
               str+=str1[j];
               i=j;
            }
            //else if dot add and add numbers till NaN
            else if(str1[j]=='.')
            {
               str+=str1[j];
               i=j;
               //add till not num
               for(var k=j+1;k<str1.length;k++)
               {
                  if( ( !isNaN(str1[k]) )||str1[k]=='e')
                  {
                     //fix for scientific notation
                     if(str1[k]=='e' && str1[k+1]=='-')
                     {
                        str+=str1[k];
                        i=k;

                        k++;

                        str+=str1[k];
                        i=k;

                     }else
                     {
                        str+=str1[k];
                        i=k;

                     }
                     
                  }
                  else
                  {
                     k=str1.length;
                  }
               }
               j=str1.length;
            }
            //else add .0 and go to next number
            else
            {
               str+='.';
               str+='0';
               j=str1.length;
            }
            }

         }
         else
         {
            str+=str1[i];
         }
      }
      
      mod.str=str;
      outputs.messageLog.event(str);

      //if window open update shader function
      if(mod.windowOpen)
      {
         mod.updateShaderFunction();
      }

      }}};
//
// outputs
//
var outputs = {
    messageLog:{type:'string',
      event:function(mess){
      //show processed function
        mods.output(mod,'messageLog',mess);
      }
    }
}
//
// interface
//
var interface = function(div){
   mod.div = div
   //
   // on-screen drawing canvas
   //
   var canvas = document.createElement('canvas');
      canvas.width = mods.ui.canvas;
      canvas.height = mods.ui.canvas;
      canvas.style.backgroundColor = 'rgb(0,0,0)';
      div.appendChild(canvas);
      mod.canvas = canvas;
   div.appendChild(document.createElement('br'));
   //
   // resolution
   //
   div.appendChild(document.createTextNode('resolution: '));
   var input = document.createElement('input');
      input.type = 'text';
      input.size = 3;
      input.addEventListener('input',function(){
         if(mod.windowOpen)
         {
            mod.redraw(true);
         }
         });
      div.appendChild(input);
      mod.steps = input;
   div.appendChild(document.createElement('br'));
   //
   // adaptive rendering
   //
   div.appendChild(document.createTextNode('rendering performance: '))
            var input = document.createElement('SELECT');
            
         input.setAttribute("id", "rend-adpselect");
         
         //select menu for functions
         var z = document.createElement("option");
         z.setAttribute("value", "0");
         var t = document.createTextNode('constant');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "1");
         var t = document.createTextNode('adaptive');
         z.appendChild(t);
         input.appendChild(z);
         input.addEventListener('change',function(evt){
            var temp= document.getElementById("rend-adpselect");
            mod.rendPerformance=parseInt(temp.value);
            mod.updateShaderFunction();
            });

         div.appendChild(input);
  
   div.appendChild(document.createElement('br'));
   //
   // rendering style
   //
   div.appendChild(document.createTextNode('rendering style: '))
            var input = document.createElement('SELECT');
            
         input.setAttribute("id", "rend-select");
         
         //select menu for functions
         var z = document.createElement("option");
         z.setAttribute("value", "0");
         var t = document.createTextNode('default');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "1");
         var t = document.createTextNode('xray');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "2");
         var t = document.createTextNode('height map (fixed)');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "3");
         var t = document.createTextNode('height map (variable)');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "4");
         var t = document.createTextNode('normals');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "5");
         var t = document.createTextNode('light');
         z.appendChild(t);
         input.appendChild(z);

         var z = document.createElement("option");
         z.setAttribute("value", "6");
         var t = document.createTextNode('specular');
         z.appendChild(t);
         input.appendChild(z);
       
         input.addEventListener('change',function(evt){
            var temp= document.getElementById("rend-select");
            mod.rendType=String(parseInt(temp.value));
            mod.updateShaderFunction();
            });

         div.appendChild(input);
   div.appendChild(document.createElement('br'));
  
   //
   // view
   //   
   div.appendChild(document.createElement('br'))  ; 
   var btn = document.createElement('button');
      btn.style.padding = mods.ui.padding;
      btn.style.margin = 1;
      var span = document.createElement('span');
         var text = document.createTextNode('view');
            span.appendChild(text);
         btn.appendChild(span);
      btn.addEventListener('click',function(){
      mod.windowOpen=true; 
         open_view_window();
         });
      div.appendChild(btn);
}

//
// local functions
//
 
//
// open_view_window
//
function open_view_window() {
    //
    // globals
    //
    var container;
    var camera, sceneFirstPass, sceneSecondPass, renderer;
    var containerAxes, cameraAxes , sceneAxes, rendererAxes,axes,sphereO;
    var rtTexture;
    var materialSecondPass;
    var center;
    var meshSecondPass;
    var boxGeometry;
    var gridHelper;
    var gridHelpersSize=5;
    var clock;
    var delta=0;
    var interval=10;
    var frameID;

    //
    // functions
    //
   
    addShaderScripts();
    open_window();
   
    //
    // open_window
    //
    function open_window() 
    {
      //
      // open window
      //
      win = window.open('');
      mod.win = win;

      //
      // load three.js
      //
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = init_window;
      script.src = 'js/three.js/three.min.js';
      mod.div.appendChild(script);
    }

      //
      // add shader scripts to html
      //
      function addShaderScripts() 
      {

            /////////////////////////fragmentShaderFirstPass////////////////////////////////////

            var div = document.createElement('script');

            div.id = 'fragmentShaderFirstPass';
            div.type = 'x-shader/x-fragment';

            div.innerHTML =
            `
                  varying vec3 worldSpaceCoords;

                  void main()
                  {
                  //The fragment's world space coordinates as fragment output.
                  gl_FragColor = vec4( worldSpaceCoords.x , worldSpaceCoords.y, worldSpaceCoords.z, 1 );
                  }
                  `;
            
            //
            mod.div.appendChild(div);
            
            /////////////////////////vertexShaderFirstPass////////////////////////////////////
            var div = document.createElement('script');

            div.id = 'vertexShaderFirstPass';
            div.type = 'x-shader/x-vertex';

            div.innerHTML =
            `
                  varying vec3 worldSpaceCoords;

                  void main()
                  {
                  //Set the world space coordinates of the back faces vertices as output.
                  worldSpaceCoords = position + vec3(0.5, 0.5, 0.5); //move it from [-0.5;0.5] to [0,1]
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                  }
                  `;
            
            //
            mod.div.appendChild(div);
            /////////////////////////fragmentShaderSecondPass////////////////////////////////////
            var div = document.createElement('script');

            div.id = 'fragmentShaderSecondPass';
            div.type = 'x-shader/x-fragment';

            
            div.innerHTML=fragmentShaderSecondPass();
            mod.div.appendChild(div);

            /////////////////////vertexShaderSecondPass///////////////////
            var div = document.createElement('script');

            div.id = 'vertexShaderSecondPass';
            div.type = 'x-shader/x-vertex';

            div.innerHTML =
            `
                  varying vec3 worldSpaceCoords;
                  varying vec4 projectedCoords;


                  void main()
                  {
                  
                  worldSpaceCoords = (modelMatrix * vec4(position + vec3(0.5, 0.5,0.5), 1.0 )).xyz;
                  gl_Position = projectionMatrix *  modelViewMatrix * vec4( position, 1.0 );
                  projectedCoords =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

                  }
                  `;
            //
            mod.div.appendChild(div);
      }
   
   //
   // fragment shader (the one that does all the work)
   //
   function fragmentShaderSecondPass()
   {
      var txt =
         `
            const float PI = 3.1415926535897932384626433832795;
            #define rendType `+mod.rendType+`
            varying vec3 worldSpaceCoords;
            varying vec4 projectedCoords;
            uniform sampler2D tex;
            uniform float steps;
            uniform float alphaCorrection;
            // uniform float rendType;
            uniform vec3 cameraPos;
            // The maximum distance through our rendering volume is sqrt(3).
            // The maximum number of steps we take to travel a distance of 1 is 512.
            // ceil( sqrt(3) * 512 ) = 887
            // This prevents the back of the image from getting cut off when steps=512 & viewing diagonally.
            const int MAX_STEPS = 887;
            uniform float xLimit1;
            uniform float xLimit2;
            uniform float yLimit1;
            uniform float yLimit2;
            uniform float zLimit1;
            uniform float zLimit2;
            float orgMin=0.0;
            float orgMax=1.0;
            vec3 viewDirection;
            

            float map(vec3 p)
            {
               float X= p.x;
               float Y= p.y;
               float Z= p.z;

               return `+mod.str+`;
            }
            vec3 simpleLambert (vec3 normal) {
               vec3 lightDir = vec3(0.2,-0.6,-0.4);   // Light direction
               vec3 lightDir1 = vec3(0.4, 0.6,-0.4);  // Light direction
               vec3 lightCol = vec3(0.5,0.5,0.5);     // Light color
               vec3 _Color=vec3(0.2,0.5,0.8);
               float lightIntensity = 3.0;
               float ambient = 0.2;
               
               float NdotL = max(dot(normalize(normal), normalize(lightDir)),0.0) * lightIntensity;
               float NdotL1 = max(dot(normalize(normal), normalize(lightDir1)),0.0) *lightIntensity;

               vec3 c=vec3(0.0,0.0,0.0);

               c.rgb = _Color * lightCol * (NdotL + NdotL1)+ ambient ;

               return c;
            }
            vec3 specular (vec3 normal) {
               vec3 lightDir = vec3(0.2,-0.6,-0.4);   // Light direction
               vec3 lightDir1 = vec3(0.4, 0.6,-0.4);  // Light direction
               vec3 lightCol = vec3(0.5,0.5,0.5);     // Light color
               vec3 _Color=vec3(0.2,0.5,0.8);
               float lightIntensity=3.0;
               float ambient = 0.2;

               float _SpecularPower=0.7;
               float _Gloss=0.7;
               
               float NdotL = max(dot(normalize(normal ), normalize(lightDir)),0.0)*lightIntensity;
               float NdotL1 = max(dot(normalize(normal), normalize(lightDir1)),0.0)*lightIntensity;
               vec3 c;
               vec3 camera= cameraPos-0.5;

               float t= dot(normalize(lightDir), normalize( -camera));
               float tt=(dot(normalize(normal), normalize(-camera)));
               float s= ( t*_Gloss + tt*_SpecularPower)/lightIntensity;

               float t1= dot(normalize(lightDir1), normalize( -camera));
               float tt1=(dot(normalize(normal), normalize(-camera)));
               float s1= ( t1*_Gloss * tt1*_SpecularPower)/2.0;

               // float s = pow( dot(normalize(normal),h), _SpecularPower) * _Gloss;
               // h.x= (h.x - orgMin) * ((1.0) - (-1.0)) / (orgMax - orgMin) + (-1.0);
               // h.y= (h.y - orgMin) * ((1.0) - (-1.0)) / (orgMax - orgMin) + (-1.0);
               // h.z= (h.z - orgMin) * ((1.0) - (-1.0)) / (orgMax - orgMin) + (-1.0);
               // vec3 h1 =  (lightDir1 + camera)/2.0;
               // float s1 = pow( dot(normalize(normal)/2.0,h1), _SpecularPower) * _Gloss;

               c.rgb = _Color * lightCol * (NdotL+NdotL1)+s + s1+ ambient;
               return c;
            }
            vec3 frontLight (vec3 normal) {
               
                  vec3 camera= cameraPos-0.5;
                  float t=dot(normalize(normal), normalize(-camera));
                  vec3 c;
                  c = vec3(t,t,t);
                  return c;
            }

            vec3 ClosestPointOnLine(vec3 start ,vec3 direction ,vec3 vPoint )
            {
               vec3 vVector1 = vPoint - start;
               vec3 vVector2 = normalize(direction);
            
               float t = dot(vVector2, vVector1);
               if (t <= 0.0)
               {
                  return start;
               }
                  
               vec3 vVector3 = vVector2 * t;
            
               vec3 vClosestPoint = start + vVector3;
               return vClosestPoint;
            }
            vec3 GetClosetPoint( vec3 A, vec3 B, vec3 P, bool segmentClamp)
            {
               vec3 AP = P - A;
               vec3 AB = B - A; 
               float ab2 = AB.x*AB.x + AB.y*AB.y;
               float apab = AP.x*AB.x + AP.y*AB.y;
               float t = apab / ab2;
               if (segmentClamp)
               {
                  if (t < 0.0) t = 0.0;
                  else if (t > 1.0) t = 1.0;
               }
               vec3 Closest = A + AB * t;
               return Closest;
            }
            vec3 calcNormal( in vec3 pos )
            {
                  // vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
                  // return normalize( e.xyy*map( pos + e.xyy ) + 
                  //                         e.yyx*map( pos + e.yyx ) + 
                  //                         e.yxy*map( pos + e.yxy ) + 
                  //                         e.xxx*map( pos + e.xxx ) );
                  
                  // vec3 eps = vec3( 0.0005, 0.0, 0.0 );
                  // vec3 nor = vec3(
                  //       map(pos+eps.xyy) - map(pos-eps.xyy),
                  //       map(pos+eps.yxy) - map(pos-eps.yxy),
                  //       map(pos+eps.yyx) - map(pos-eps.yyx) );
                  // return normalize(nor);

                  const float eps = 0.01;
                  vec3 n;
                  n.x=map(pos + vec3(eps, 0, 0)   ) - map(pos - vec3(eps, 0, 0));
                  n.y=map(pos + vec3(0, eps, 0)   ) - map(pos - vec3(0, eps, 0));
                  n.z=map(pos + vec3(0, 0, eps)   ) - map(pos - vec3(0, 0, eps));
                  //problem with 
                  // n.x=result - map(pos - vec3(eps, 0, 0));
                  // n.y=result - map(pos - vec3(0, eps, 0));
                  // n.z=result - map(pos - vec3(0, 0, eps));
                  return normalize(n);
                  
            }

            //Acts like a texture3D using Z slices and trilinear filtering.
            vec4 sampleAs3DTextureCustom( vec3 texCoord )
            { 
               float X= (texCoord.x - orgMin) * (xLimit2 - xLimit1) / (orgMax - orgMin) + xLimit1;
               float Y= (texCoord.y - orgMin) * (yLimit2 - yLimit1) / (orgMax - orgMin) + yLimit1;
               float Z= (texCoord.z - orgMin) * (zLimit2 - zLimit1) / (orgMax - orgMin) + zLimit1;

               //slice color red
               vec4 m;
               m=vec4(0.0,0.0,0.0,0.0);

               float result=`+mod.str+`;
               if(result>0.0)
               {
                  m.a=1.0;
                  vec3 p=vec3(X,Y,Z);
                  vec3 n=calcNormal( p );

                  #if rendType==0
                  //default
                     {
                        float tempConst=0.001;
                        m.rgb=frontLight(n)+tempConst;
                     }
                  #elif rendType==1
                  //xray
                     {
                        m=vec4(1.0,1.0,1.0,0.01);
                     }
                  #elif rendType==2
                  //height map
                     {
                        m.r=texCoord.z;
                        m.g=texCoord.z;
                        m.b=texCoord.z;
                     }
                  #elif rendType==3
                  //depth/height map variable
                     {
                        vec3 cp=ClosestPointOnLine(-cameraPos,cameraPos,texCoord);
                        float d= (distance(cp, normalize(cameraPos)*2.0));
                        m.r=d;
                        m.g=d;
                        m.b=d;
                     }
                  #elif rendType==4
                  //normals
                     {
                        m.r= (n.r - (-1.0)) * (1.0 - 0.0) / (1.0 - (-1.0)) + 0.0;
                        m.g= (n.g - (-1.0)) * (1.0 - 0.0) / (1.0 - (-1.0)) + 0.0;
                        m.b= (n.b - (-1.0)) * (1.0 - 0.0) / (1.0 - (-1.0)) + 0.0;
                     }
                  #elif rendType==5
                  //fixed lights
                     {
                        float tempConst=0.05;
                        m.rgb=simpleLambert (n)+tempConst;
                     }
                  #elif rendType==6
                  //fixed lights specular
                     {
                        float tempConst=0.00;
                        m.rgb=specular (n)+tempConst;
                     }
                  #endif
                  
               }
               return m ;
            }
            
            void main( void ) {

               //Transform the coordinates it from [-1;1] to [0;1]
               vec2 texc = vec2(((projectedCoords.x / projectedCoords.w) + 1.0 ) / 2.0,
                           ((projectedCoords.y / projectedCoords.w) + 1.0 ) / 2.0 );

               //The back position is the world space position stored in the texture.
               vec3 backPos = texture2D(tex, texc).xyz;

               //The front position is the world space position of the second render pass.
               vec3 frontPos = worldSpaceCoords;

               //The direction from the front position to back position.
               vec3 dir = backPos - frontPos;
               
               float rayLength = length(dir);

               //Calculate how long to increment in each step.
               float delta = 1.0 / steps;

               //The increment in each direction for each step.
               vec3 deltaDirection = normalize(dir) * delta;

               viewDirection=normalize(dir);//amira added

               float deltaDirectionLength = length(deltaDirection);

               //Start the ray casting from the front position.
               vec3 currentPosition = frontPos;

               //The color accumulator.
               vec4 accumulatedColor = vec4(0.0);

               //The alpha value accumulated so far.
               float accumulatedAlpha = 0.0;

               //How long has the ray travelled so far.
               float accumulatedLength = 0.0;

               //If we have twice as many samples, we only need ~1/2 the alpha per sample.
               //Scaling by 256/10 just happens to give a good value for the alphaCorrection slider.
               float alphaScaleFactor = 25.6 * delta;

               vec4 colorSample;
               float alphaSample;

               //Perform the ray marching iterations
               for(int i = 0; i < MAX_STEPS; i++)
               {
                  //Get the voxel intensity value from the 3D texture.
                  colorSample = sampleAs3DTextureCustom( currentPosition );

                  //Allow the alpha correction customization.
                  alphaSample = colorSample.a * alphaCorrection;

                  //Applying this effect to both the color and alpha accumulation results in more realistic transparency.
                  alphaSample *= (1.0 - accumulatedAlpha);

                  //Scaling alpha by the number of steps makes the final color invariant to the step size.
                  alphaSample *= alphaScaleFactor;

                  //Perform the composition.
                  accumulatedColor += colorSample * alphaSample;

                  //Store the alpha accumulated so far.
                  accumulatedAlpha += alphaSample;

                  //Advance the ray.
                  currentPosition += deltaDirection;
                  accumulatedLength += deltaDirectionLength;

                  //If the length traversed is more than the ray length, or if the alpha accumulated reaches 1.0 then exit.
                  if(accumulatedLength >= rayLength || accumulatedAlpha >= 1.0 )
                     break;
               }

               gl_FragColor  = accumulatedColor;

            }
            `;
      return txt;
   }

    //
    // init_window
    //
   function init_window() {
      //
      // close button
      //
      var btn = document.createElement('button');
         btn.appendChild(document.createTextNode('close'));
         btn.style.padding = mods.ui.padding;
         btn.style.margin = 1;
         btn.addEventListener('click',function(){
            win.close();
            mod.win = undefined;
         });
         win.document.body.appendChild(btn);
      //
      // label text
      //
      var text = win.document.createTextNode(' left: pan, right: rotate, scroll: zoom');
         win.document.body.appendChild(text);
      //
      // GL container
      //
      win.document.body.appendChild(document.createElement('br')) ;  
      container = win.document.createElement('div');
      container.style.overflow = 'hidden';
      win.document.body.appendChild(container);

      ///////////////////////////////////////////axes////////////////////////////
      //GL Axes Container
      // win.document.body.appendChild(document.createElement('br')) ;  
      containerAxes = win.document.createElement('div');
      containerAxes.style.overflow = 'hidden';
      containerAxes.style.position = 'absolute';
      containerAxes.style.zIndex = 100;
      containerAxes.style.left = 0;
      containerAxes.style.bottom = 0;
      containerAxes.style.margin = 20;
      win.document.body.appendChild(containerAxes);
      //
      //cameraAxes
      //
      cameraAxes = new THREE.PerspectiveCamera( 50, 100 / 100, 1, 1000 );
      cameraAxes.up = new THREE.Vector3(0, 0, 1);
      //
      //rendererAxes
      //
      rendererAxes = new THREE.WebGLRenderer({ alpha: true } );
      rendererAxes.setClearColor( 0x000000, 0 );
      rendererAxes.setSize( 100, 100 );
      containerAxes.appendChild( rendererAxes.domElement );
      //
      //sceneAxes
      //
      sceneAxes=new THREE.Scene();
      axes = new THREE.AxesHelper( 100 );
      sceneAxes.add( axes );   

      ///////////////////////////////////////////////////////////////////////////////////
      
      //
      //camera
      //
      camera = new THREE.PerspectiveCamera( 40, win.innerWidth / win.innerHeight, 0.01, 3000.0 );
      camera.position.z = 2.0;
      camera.aspect = win.innerWidth / win.innerHeight;
      camera.up = new THREE.Vector3(0, 0, 1);
      camera.position.x = 5;
      camera.lookAt(new THREE.Vector3(0,0,0));
      camera.updateProjectionMatrix();
      center= new THREE.Vector3(0,0,0);

      
      
      //
      //setup textures and scenes
      //
      var screenSize = new THREE.Vector2( win.innerWidth, win.innerHeight );
      rtTexture = new THREE.WebGLRenderTarget( screenSize.x, screenSize.y,
                                    {  minFilter: THREE.LinearFilter,
                                       magFilter: THREE.LinearFilter,
                                       wrapS:  THREE.ClampToEdgeWrapping,
                                       wrapT:  THREE.ClampToEdgeWrapping,
                                       format: THREE.RGBAFormat,
                                       type: THREE.FloatType,
                                       generateMipmaps: false} );


      var materialFirstPass = new THREE.ShaderMaterial( {
         vertexShader: document.getElementById( 'vertexShaderFirstPass' ).textContent,
         fragmentShader: document.getElementById( 'fragmentShaderFirstPass' ).textContent,
         side: THREE.BackSide
      } );

      var lookAtVector = new THREE.Vector3(0,0, -1);
      lookAtVector.applyQuaternion(camera.quaternion);

      sceneFirstPass = new THREE.Scene();
      sceneSecondPass = new THREE.Scene();

      var tempCam=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
      materialSecondPass = new THREE.ShaderMaterial( {
         vertexShader: document.getElementById( 'vertexShaderSecondPass' ).textContent,
         fragmentShader: document.getElementById( 'fragmentShaderSecondPass' ).textContent,
         side: THREE.FrontSide,
         uniforms: { tex:  { type: "t", value: rtTexture },
                  steps : {type: "1f" , value: mod.steps.value }, 
                  xLimit1 : {type: "1f" , value: mod.xLimit1 }, 
                  xLimit2 : {type: "1f" , value: mod.xLimit2 }, 
                  yLimit1 : {type: "1f" , value: mod.yLimit1 }, 
                  yLimit2 : {type: "1f" , value: mod.yLimit2 }, 
                  zLimit1 : {type: "1f" , value: mod.zLimit1 }, 
                  zLimit2 : {type: "1f" , value: mod.zLimit2 }, 
                  alphaCorrection : {type: "1f" , value: mod.alphaCorrection},
                  cameraPos :{value:  tempCam.normalize()} 
               }
      });

      //HELPER GRID
      gridHelper = new THREE.GridHelper( gridHelpersSize, 20 );//SIZE DIVISION
      var geometry = new THREE.SphereGeometry( 0.1,32,32);
      var material = new THREE.MeshNormalMaterial();
      sphereO = new THREE.Mesh( geometry, material );

      var materialX = new THREE.LineBasicMaterial({
            color: 0xFF0000
      });
      var materialY = new THREE.LineBasicMaterial({
            color: 0x00FF00
      });
      
      var geometryX = new THREE.Geometry();
      geometryX.vertices.push(
            new THREE.Vector3( -5, 0, 0 ),
            new THREE.Vector3(  5, 0, 0 )
      );
      var geometryY = new THREE.Geometry();
      geometryY.vertices.push(
            new THREE.Vector3( 0, -5, 0 ),
            new THREE.Vector3( 0,  5, 0 )
      );
      
      var lineX = new THREE.Line( geometryX, materialX );
      var lineY = new THREE.Line( geometryY, materialY );

      gridHelper.add(lineX);
      gridHelper.add(lineY);
      sceneSecondPass.add( gridHelper );
      // sceneSecondPass.add( sphereO );
      gridHelper.geometry.rotateX( Math.PI / 2 );
      
      updateGridHelper();
      
      
      //
      //cube renderer
      //
      boxGeometry = new THREE.BoxGeometry(1.0, 1.0, 1.0);
      boxGeometry.doubleSided = true;

      materialSecondPass.transparent =true;
      var meshFirstPass = new THREE.Mesh( boxGeometry, materialFirstPass );
      meshSecondPass = new THREE.Mesh( boxGeometry, materialSecondPass );

      sceneFirstPass.add( meshFirstPass );
      sceneSecondPass.add( meshSecondPass );

      renderer = new THREE.WebGLRenderer();
      container.appendChild( renderer.domElement );
      renderer.setSize( win.innerWidth, win.innerHeight );


      //
      // mod viewer
      //

      //grab the context from your destination canvas
      var destCtx = mod.canvas.getContext('2d');
      destCtx.clearRect(0,0,mod.canvas.width,mod.canvas.height);
      //call its drawImage() function passing it the source canvas directly
      destCtx.drawImage(container.childNodes[0], 0, 0);


      clock=new THREE.Clock();
      //
      //controls
      //
      var Controls = (function(Controls) {
         // "use strict";
      
         // Check for double inclusion
         if (Controls.addMouseHandler)
            return Controls;
      
         Controls.addMouseHandler = function (domObject, drag, zoomIn, zoomOut) {
            var startDragX = null,
               startDragY = null;
      
            function mouseWheelHandler(e) {
               e = window.event || e;
               var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      
               if (delta < 0 && zoomOut) {
                  zoomOut(delta);
               } else if (zoomIn) {
                  zoomIn(delta);
               }
      
               e.preventDefault();
            }
      
            function mouseDownHandler(e) {
               startDragX = e.clientX;
               startDragY = e.clientY;
      
               e.preventDefault();
            }
      
            function mouseMoveHandler(e) {
               if (startDragX === null || startDragY === null)
                  return;
      
               if (drag)
                  drag(e.clientX - startDragX, e.clientY - startDragY);
      
               startDragX = e.clientX;
               startDragY = e.clientY;
      
               e.preventDefault();
            }
      
            function mouseUpHandler(e) {
               mouseMoveHandler.call(this, e);
               startDragX = null;
               startDragY = null;
      
               e.preventDefault();
            }
      
            domObject.addEventListener("mousewheel", mouseWheelHandler);
            domObject.addEventListener("DOMMouseScroll", mouseWheelHandler);
            domObject.addEventListener("mousedown", mouseDownHandler);
            domObject.addEventListener("mousemove", mouseMoveHandler);
            domObject.addEventListener("mouseup", mouseUpHandler);
         };
         return Controls;
      }(Controls || {}));
      Controls.addMouseHandler(renderer.domElement, drag, zoomIn, zoomOut);
      

      //
      // event handlers
      //
      win.addEventListener( 'resize', onWindowResize, false );
      win.addEventListener('contextmenu',context_menu);
      
      render();
   }
  
   //
   //window resize
   //
   function onWindowResize( event ) {

      //TODO: Fix box white edge when window resize
      renderer.setSize( win.innerWidth, win.innerHeight );

      camera.aspect = win.innerWidth / win.innerHeight;
      camera.updateProjectionMatrix();

      redraw(false);
   }

   //
   //context menu
   //
   function context_menu(evt) 
   {
      evt.preventDefault();
      evt.stopPropagation();
      return (false);
   }

   //
   // mouse_down
   //
   function mouse_down(evt) 
   { 
      evt.preventDefault();
      evt.stopPropagation();
      mod.button = evt.button;
      mod.x = evt.clientX;
      mod.y = evt.clientY;
   }

   //
   // mouse_up
   //
   function mouse_up(evt) {
      mod.button = undefined;
      mod.x = evt.clientX;
      mod.y = evt.clientY;
   }

   //
   // mouse_move
   //
   function mouse_move(evt) 
   {
      evt.preventDefault();
      evt.stopPropagation();
      var dx = evt.clientX-mod.x;
      var dy = evt.clientY-mod.y;
      mod.x = evt.clientX;
      mod.y = evt.clientY;
      if (mod.button == 0) {
         mod.x0 += 
            Math.sin(mod.thetaz)*mod.height*dy/win.innerHeight
            -Math.cos(mod.thetaz)*mod.width*dx/win.innerWidth;
         mod.y0 += 
            Math.cos(mod.thetaz)*mod.height*dy/win.innerHeight
            +Math.sin(mod.thetaz)*mod.width*dx/win.innerWidth;
         camera.position.x = mod.x0+Math.sin(mod.thetaz)*mod.r*Math.sin(mod.thetaxy);
         camera.position.y = mod.y0+Math.cos(mod.thetaz)*mod.r*Math.sin(mod.thetaxy);
         camera.position.z = mod.r*Math.cos(mod.thetaxy);
         camera.position.z = mod.r*Math.cos(mod.thetaxy);
            camera.up = new THREE.Vector3(Math.sin(mod.thetaz),Math.cos(mod.thetaz),0);
            camera.lookAt(new THREE.Vector3(mod.x0,mod.y0,0));
         camera.updateProjectionMatrix();
         redraw(false);
      }
      else if (mod.button == 2) {
         mod.thetaxy += dy/win.innerHeight;
         mod.thetaz += dx/win.innerWidth;
         camera.position.x = mod.x0+Math.sin(mod.thetaz)*mod.r*Math.sin(mod.thetaxy);
         camera.position.y = mod.y0+Math.cos(mod.thetaz)*mod.r*Math.sin(mod.thetaxy);
         camera.position.z = mod.r*Math.cos(mod.thetaxy);
            camera.up = new THREE.Vector3(Math.sin(mod.thetaz),Math.cos(mod.thetaz),0);
            camera.lookAt(new THREE.Vector3(mod.x0,mod.y0,0));
         camera.updateProjectionMatrix();
            renderer.render(scene,camera);
      }
   }

   //
   // mouse_wheel
   //
   function mouse_wheel(evt) 
   {
      evt.preventDefault();
      evt.stopPropagation();
      var dy = evt.deltaY/win.innerHeight;
      mod.r += mod.height*dy;
      camera.position.x = mod.x0+Math.sin(mod.thetaz)*mod.r*Math.sin(mod.thetaxy);
      camera.position.y = mod.y0+Math.cos(mod.thetaz)*mod.r*Math.sin(mod.thetaxy);
      camera.position.z = mod.r*Math.cos(mod.thetaxy);
      camera.lookAt(new THREE.Vector3(mod.x0,mod.y0,0));
      camera.updateProjectionMatrix();
      redraw(false);
   }

   //
   //redraw
   //
   

   function frame() 
   {
      if (delta == 5) {
            delta=0;
            clearInterval(frameID);
      } else {
            delta++; 
            render(true,mod.steps.value*delta/5);
      }
   }  

   function redraw(updateUniforms)
   {
      if(mod.rendPerformance==1)
      {
            if(frameID!=null)
            {
                  clearInterval(frameID);
            }
            frameID=setInterval(frame, interval);   
      }else
      {
            if(frameID!=null)
            {
                  clearInterval(frameID);
            }
            render(updateUniforms,mod.steps.value);
      }
   }
   mod.redraw=redraw;

   function updateGridHelper()
   {
      //TODO: later move/rotate camera based on changes
      //update grid helper based on limits
      gridHelper.geometry.rotateX( - Math.PI / 2 );
      gridHelper.scale.x=gridHelpersSize/(Math.abs(mod.xLimit2  - mod.xLimit1)*gridHelpersSize/2.0);
      gridHelper.scale.y=gridHelpersSize/(Math.abs(mod.yLimit2  - mod.yLimit1)*gridHelpersSize/2.0);
      gridHelper.position.x=( (0.0 - (mod.xLimit1)) * (0.5  - (-0.5)) / (mod.xLimit2 - (mod.xLimit1)) + (-0.5));
      gridHelper.position.y=( (0.0 - (mod.yLimit1)) * (0.5  - (-0.5)) / (mod.yLimit2 - (mod.yLimit1)) + (-0.5));
      gridHelper.position.z=( (0.0 - (mod.zLimit1)) * (0.5  - (-0.5)) / (mod.zLimit2 - (mod.zLimit1)) + (-0.5));
      gridHelper.geometry.rotateX( Math.PI / 2 );
      
      sphereO.scale.x=gridHelpersSize/(Math.abs(mod.xLimit2  - mod.xLimit1)*gridHelpersSize/0.5);
      sphereO.scale.y=gridHelpersSize/(Math.abs(mod.yLimit2  - mod.yLimit1)*gridHelpersSize/0.5);
      sphereO.scale.z=gridHelpersSize/(Math.abs(mod.zLimit2  - mod.zLimit1)*gridHelpersSize/0.5);
     
      sphereO.position.x=( (0.0 - (mod.xLimit1)) * (0.5  - (-0.5)) / (mod.xLimit2 - (mod.xLimit1)) + (-0.5));
      sphereO.position.y=( (0.0 - (mod.yLimit1)) * (0.5  - (-0.5)) / (mod.yLimit2 - (mod.yLimit1)) + (-0.5));
      sphereO.position.z=( (0.0 - (mod.zLimit1)) * (0.5  - (-0.5)) / (mod.zLimit2 - (mod.zLimit1)) + (-0.5));
   }

   //
   //render
   //
   function render(updateUniforms ,resolutionStep) {
      if(updateUniforms)
      {
            
            materialSecondPass.uniforms.steps.value = resolutionStep;
            materialSecondPass.uniforms.alphaCorrection.value = mod.alphaCorrection;
            materialSecondPass.uniforms.xLimit1.value =mod.xLimit1 ;
            materialSecondPass.uniforms.xLimit2.value =mod.xLimit2 ; 
            materialSecondPass.uniforms.yLimit1.value =mod.yLimit1 ; 
            materialSecondPass.uniforms.yLimit2.value =mod.yLimit2 ; 
            materialSecondPass.uniforms.zLimit1.value =mod.zLimit1 ; 
            materialSecondPass.uniforms.zLimit2.value =mod.zLimit2 ;


            //TODO: Find the error with xray and fix it
            if(mod.rendType=='1')//xray
            {
                  materialSecondPass.transparent =false;
            }else
            {
                  materialSecondPass.transparent =true;
            }

            updateGridHelper();
      }

      var tempCam=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);

      materialSecondPass.uniforms.cameraPos.value=tempCam.normalize();
      tempCam.normalize();
      tempCam.addScalar(0.5);

      //Render first pass and store the world space coords of the back face fragments into the texture.
      //renderer.render( sceneFirstPass, camera, rtTexture, true );

      //Render the second pass and perform the volume rendering.
      //renderer.render( sceneSecondPass, camera );

      var previousRenderTarget = renderer.getRenderTarget();
	  renderer.setRenderTarget(rtTexture);
	  renderer.render( sceneFirstPass, camera );
	  renderer.setRenderTarget( previousRenderTarget );
	  renderer.render( sceneSecondPass, camera );

      //render axes camera
      cameraAxes.position.x=camera.position.x;
      cameraAxes.position.y=camera.position.y;
      cameraAxes.position.z=camera.position.z;
	cameraAxes.position.sub( center ); 
	cameraAxes.position.setLength( 300 );
      cameraAxes.lookAt( sceneAxes.position.clone() );  

      rendererAxes.render( sceneAxes, cameraAxes );

      updateModViewer();
      
   }

   //
   //render to small mod viewer
   //
   function updateModViewer()
   {
      var w=win.innerWidth;
      var h=win.innerHeight;
      if (w > h) {
         var x0 = 0;
         var y0 = mod.canvas.height*.5*(1-h/w);
         var wd = mod.canvas.width;
         var hd = mod.canvas.width*h/w;
         }
       else {
         var x0 = mod.canvas.width*.5*(1-w/h);
         var y0 = 0;
         var wd = mod.canvas.height*w/h;
         var hd = mod.canvas.height;
         }
      var destCtx = mod.canvas.getContext('2d');
      destCtx.drawImage(container.childNodes[0],x0,y0,wd,hd);

   }

   //
   //when fuction changes
   //
   function updateShaderFunction()
   {
      // outputs.messageLog.event('update shader');
      
      // outputs.messageLog.event(mod.xLimit1);

      var div = document.getElementById('fragmentShaderSecondPass');

      div.innerHTML="";
      div.innerHTML =fragmentShaderSecondPass();
      
      var tempCam=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
      // outputs.messageLog.event('update shader1');
      materialSecondPass = new THREE.ShaderMaterial( {
         vertexShader: document.getElementById( 'vertexShaderSecondPass' ).textContent,
         fragmentShader: document.getElementById( 'fragmentShaderSecondPass' ).textContent,
         side: THREE.FrontSide,
         uniforms: { tex:  { type: "t", value: rtTexture },
                  steps : {type: "1f" , value: mod.steps.value }, 
                  xLimit1 : {type: "1f" , value: mod.xLimit1 }, 
                  xLimit2 : {type: "1f" , value: mod.xLimit2 }, 
                  yLimit1 : {type: "1f" , value: mod.yLimit1 }, 
                  yLimit2 : {type: "1f" , value: mod.yLimit2 }, 
                  zLimit1 : {type: "1f" , value: mod.zLimit1 }, 
                  zLimit2 : {type: "1f" , value: mod.zLimit2 }, 
                  alphaCorrection : {type: "1f" , value: mod.alphaCorrection},
                  cameraPos :{value: tempCam.normalize()}
               }
         });

      //new THREE.Vector3(20.0,-60.0,-40.0)
      meshSecondPass.material=materialSecondPass;
      meshSecondPass.material.needsUpdate = true;
      meshSecondPass.material.transparent =true;

      redraw(true);

      //test performance
      // mod.tend = Date.now();
      // var dt = mod.tend-mod.tstart;
      // outputs.messageLog.event(dt/1000);

   }
   mod.updateShaderFunction=updateShaderFunction;
      
      //
      //controls
      //
      function drag(deltaX, deltaY) 
      {
            var radPerPixel = (Math.PI / 450),
            deltaPhi = radPerPixel * deltaX,
            deltaTheta = radPerPixel * deltaY,
            pos = camera.position.sub(center),
            radius = pos.length(),
            theta = Math.acos(pos.z / radius),
            phi = Math.atan2(pos.y, pos.x);

            // Subtract deltaTheta and deltaPhi
            theta = Math.min(Math.max(theta - deltaTheta, 0), Math.PI);
            phi -= deltaPhi;

            // Turn back into Cartesian coordinates
            pos.x = radius * Math.sin(theta) * Math.cos(phi);
            pos.y = radius * Math.sin(theta) * Math.sin(phi);
            pos.z = radius * Math.cos(theta);

            camera.position.add(center);
            camera.lookAt(center);
            redraw(false);
      }

      ///
      function zoomIn() 
      {
            camera.position.sub(center).multiplyScalar(0.9).add(center);
            redraw(false);
      }

      ///
      function zoomOut() 
      {
            camera.position.sub(center).multiplyScalar(1.1).add(center);
            redraw(false);
      }
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
   });
}());


