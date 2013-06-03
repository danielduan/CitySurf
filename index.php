<html>

<head>

<meta property="og:title" content="CitySurf" />
    <meta property="fb:app_id" content="515304461857778" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://citysurf.herokuapp.com/" />
    <meta property="og:image" content="http://citysurf.herokuapp.com/test/icon.png" />
    <link rel="shortcut icon" href="http://citysurf.herokuapp.com/icon.ico"/>
    <meta name="description" property="og:description" content="An interactive way to visualize local traffic condition" />


<title>CitySurf</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link href='http://fonts.googleapis.com/css?family=Orbitron:700,400' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="css/styles.css">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="glMatrix-0.9.5.min.js"></script>
<script type="text/javascript" src="webgl-utils.js"></script>

<script type="text/javascript" src="js/init.js"></script>
<script type="text/javascript" src="js/textures.js"></script>
<script type="text/javascript" src="js/matrices.js"></script>
<script type="text/javascript" src="js/initBuffers.js"></script>
<script type="text/javascript" src="js/helper.js"></script>
<script type="text/javascript" src="js/draw.js"></script>
<script type="text/javascript" src="js/animate.js"></script>
<script type="text/javascript" src="js/dsp.js"></script>
<script type="text/javascript" src="js/audio.js"></script>

<script id="shader-fs" type="x-shader/x-fragment">
    precision mediump float;
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    varying vec3 vLightWeighting;

    void main(void) {
        vec4 textureColor = texture2D(uSampler, vTextureCoord);
          if (textureColor.a < 0.05) 
            discard;
          else
            gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
            }
</script>

<script id="shader-vs" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNMatrix;

    uniform vec3 uAmbientColor;

    uniform vec3 uLightingDirection;
    uniform vec3 uDirectionalColor;

    uniform bool uUseLighting;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;

    void main(void) {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        vTextureCoord = aTextureCoord;

        if (!uUseLighting) {
            vLightWeighting = vec3(1.0, 1.0, 1.0);
        } else {
            vec3 transformedNormal = uNMatrix * aVertexNormal;
            float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
            vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
        }
    }
</script>


<script type="text/javascript">

    var gl;
    var shaderProgram;
    var texture = [];
    var mvMatrix = mat4.create();
    mat4.identity(mvMatrix);
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    var cubeVertexPositionBuffer;
    var cubeVertexTextureCoordBuffer;
    var cubeVertexIndexBuffer;
    var cubeVertexNormalBuffer;

    var difficulty = 50;

    var currentlyPressedKeys = {};

    //Positions
    var pitch = 0;
    var pitchRate = 0;
    var yaw = 0;
    var yawRate = .5;
    var xPos = 0;
    var yPos = 0.4;
    var zPos = 0;
    var speed = 0;
    var score = 0;

    var pause = true;
    var zGreatest = 0;
    var rPyramid = 0;
    var rCube = 0;
    var X = new Array();
    var Z = new Array();
    var locationX = new Array();
    var locationY = new Array();
    var wave = 0;
    var zcount = 0;

    var ambientR = 1.0;
    var ambientG = 1.0;
    var ambientB = 1.0;

    var lightDirectionX = 0.0;
    var lightDirectionY = 0.0;
    var lightDirectionZ = 0.0;

    var directionR = 0.8;
    var directionG = 0.8;
    var directionB = 0.8;

    var zcount = 0;
    var zbottom = 0;

    var mph = .1;
    var filter = 0;

    var draw = 1;
    var alive = true; 
    // Used to make us "jog" up and down as we move forward.
    var joggingAngle = 0;
    var lastTime = 0;
    var latitude = 34.072;
    var longitude = -118.445;
    var maps = new Array();
    var count = 0;
    var godmode = false;

    var total;




    //start webGL service
    function webGLStart() {
        for (var i = 0; i < 20; i++)
        {
            maps[i] = new Image();
            if (i < 10)
                maps[i].src = "0" + i + ".png";
            else
                maps[i].src = i + ".png";
        }
        var canvas = document.getElementById("cube-runner");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initGL(canvas);
        initShaders()
        initBuffers();
        initTexture();
        fillXZ();
        gl.clearColor(0.0, 0.0, 0.0, 0.4);
        gl.enable(gl.DEPTH_TEST);

        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        document.getElementById("mapimage").width=window.innerWidth/10;

        document.getElementById("play_button").addEventListener('click', function(event) {
        event.preventDefault();
        pushRestart();
        loadmusic();
        pause = false;
        });
        

        tick();
    }
    
    function isPaused()
    {};

    function isDead()
    {
        document.getElementById("menu").style.display = "block";
        document.getElementById("points").style.display = "none";
        document.getElementById("map").style.display = "none";
        document.getElementById("play_button").innerHTML = "Restart";
        document.getElementById("play_button").addEventListener('click', function(event) {
        event.preventDefault();
        pushRestart();
        if(alive)
            {
                pause = !pause;
                if (pause == true)
                    isPaused();
            }
            else
            {
                pitch = 0;
                pitchRate = 0;
                yaw = 0;
                yawRate = .5;
                xPos = 0;
                yPos = 0.4;
                zPos = 0;
                speed = 0;

                godmode = false;

                pause = false;
                zGreatest = 0;
                rPyramid = 0;
                rCube = 0;
                X = new Array();
                Z = new Array();
                wave = 0;
                zcount = 0;

                ambientR = 1.0;
                ambientG = 1.0;
                ambientB = 1.0;

                lightDirectionX = 0.0;
                lightDirectionY = 0.0;
                lightDirectionZ = 0.0;

                directionR = 0.8;
                directionG = 0.8;
                directionB = 0.8;

                zcount = 0;
                zbottom = 0;

                mph = .1;
                filter = 0;

                score = 0;

                draw = 1;
                alive = true; 
                // Used to make us "jog" up and down as we move forward.
                joggingAngle = 0;
                lastTime = 0;
                fillXZ();
                //pushRestart();
            }
        });

    };

    function inGodMode()
    {};

    function pushRestart()
    {
        document.getElementById("menu").style.display = "none";
        document.getElementById("points").style.display = "block";
        document.getElementById("map").style.display = "block";
        document.getElementById("mapimage").width=window.innerWidth/10;
    };

</script>


</head>


<body style="background-color:black" onload="webGLStart();initAudio();loadmusic();">

<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=515304461857778";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div id="map">
    <img src="00.png" id="mapimage" >
</div>

    <div id="menu">
        <h1>CitySurf</h1>
    <p>
      Movement: left and right arrows<br>
      Pause/Resume: space<br><br>
      Made by Ben Lin, Daniel Duan, <br>and Elison Chen
      during <a href="http://boyleheightshack.eventbrite.com/">Hack for LA</a>.
    </p>
        <button id="play_button">Play</button>
        <div id="facebook">
            <div class="fb-like" data-href="http://citysurf.herokapp.com" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false" data-colorscheme="dark"></div>
        </div>
    </div>
  
    <div id="points">
        <span id="score"></span>
        <span id="condition">Traffic Condition: Light</span>

    </div>

<!--<img id="map" src="http://maps.googleapis.com/maps/api/staticmap?center=-15.800513,-47.91378&zoom=11&size=200x200&sensor=false&key=AIzaSyAfC_GeRTdvQEtBBbuf-6ZX6z8OwDd4mig" style="position:absolute; z-index:-1">-->
    <canvas id="cube-runner"></canvas>

    <canvas id="music"></canvas>

    <script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-41395679-1', 'herokuapp.com');
  ga('send', 'pageview');

</script>

<!-- Start of StatCounter Code for Default Guide -->
<script type="text/javascript">
var sc_project=8996405; 
var sc_invisible=1; 
var sc_security="86f655a9"; 
var scJsHost = (("https:" == document.location.protocol) ?
"https://secure." : "http://www.");
document.write("<sc"+"ript type='text/javascript' src='" +
scJsHost+
"statcounter.com/counter/counter.js'></"+"script>");
</script>
<noscript><div class="statcounter"><a title="hit counter"
href="http://statcounter.com/" target="_blank"><img
class="statcounter"
src="http://c.statcounter.com/8996405/0/86f655a9/1/"
alt="hit counter"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->
</body>


</html>
