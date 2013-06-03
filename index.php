<html>
<head>
<meta property="og:title" content="CitySurf"/>
<meta property="fb:app_id" content="515304461857778"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="http://citysurf.herokuapp.com/"/>
<meta property="og:image" content="http://citysurf.herokuapp.com/icon.png"/>
<link rel="shortcut icon" href="http://citysurf.herokuapp.com/icon.ico"/>
<meta name="description" property="og:description" content="An interactive way to visualize local traffic condition"/>
<title>CitySurf</title>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<link href='http://fonts.googleapis.com/css?family=Orbitron:700,400' rel='stylesheet' type='text/css'>
<link rel="stylesheet" type="text/css" href="css/styles.css">
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
<script type="text/javascript" src="js/glMatrix-0.9.5.min.js"></script>
<script type="text/javascript" src="js/webgl-utils.js"></script>
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
<script type="text/javascript" src="js/config.js"></script>
</head>

<body style="background-color:black" onload="webGLStart();initAudio();loadmusic();">

<!--facebook-->
<div id="fb-root">
</div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=515304461857778";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>
<!--end facebook-->

<div id="map">
    <img src="img/maps/00.png" id="mapimage">
</div>

<div id="menu">
    <h1>CitySurf</h1>
    <p>
         Movement: left and right arrows<br>
         Pause/Resume: space<br>
        <br>
         Made by Ben Lin, Daniel Duan, <br>
        and Elison Chen during <a href="http://boyleheightshack.eventbrite.com/">Hack for LA</a>.
    </p>
    <button id="play_button">Play</button>
    <div id="facebook">
        <div class="fb-like" data-href="http://citysurf.herokapp.com" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false" data-colorscheme="dark">
        </div>
    </div>
</div>

<div id="points">
    <span id="score"></span>
    <span id="condition">Traffic Condition: Light</span>
</div>

<canvas id="cube-runner"></canvas>

<canvas id="music"></canvas>

<!--google analytics-->
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
<noscript><div class="statcounter"><a title="click tracking"
href="http://statcounter.com/" target="_blank"><img
class="statcounter"
src="http://c.statcounter.com/8996405/0/86f655a9/1/"
alt="click tracking"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->


</body>
</html>