<!DOCTYPE HTML>
<html lang="en" manifest="cache.manifest">
    <head>
	<title>CitySurf</title>
	<meta charset="utf-8"> 

	<script type="text/javascript" src="js/Three.min.js"></script>
        <script type="text/javascript" src="js/RequestAnimationFrame.js"></script>
        <script type="text/javascript" src="js/Stats.min.js"></script>
        <script type="text/javascript" src="js/jquery-2.0.0.min.js"></script>
        <script type="text/javascript" src="js/utils.js"></script>
	       <script type="text/javascript" src="js/cube.js"></script>
    </head>
    <body onload="loadin()" tabindex="0">
<div id="container">
        <div id="score">0</div>
        <div class="blocker">
		<br>
		Blocks the Game!<br>
		<span class="loading">Loading... Please wait...</span>
                <span class="enter hide" tabindex="0">Press "Enter" to Start</span>
	</div>
        </div>
<button onclick="" id="init">Start Game</button>
<span class="nav">
	<button id="go" disabled>Resume</button>
	<button id="pause" disabled>Pause</button>
</span>
<span id="output"></span><br>
<br>
<b>Note: Settings won't be able to change during the game.</b><br>
<b>Note 2: Do use fast browser like Google Chrome.</b><br>
Difficuly: 
<span class="diff">
<button onclick="cubeNum=10;difficulty(event)">Easy</button>
<button onclick="cubeNum=20;difficulty(event)" disabled>Normal</button>
<button onclick="cubeNum=50;difficulty(event)">Hard</button>
<button onclick="cubeNum=75;difficulty(event)">Insane</button>
<button onclick="cubeNum=100;difficulty(event)">Impossible</button>
</span><br>
Size: 
<span class="size">
<button onclick="size(event,400,300)">400 x 300</button>
<button onclick="size(event,800,600)" disabled>800 x 600</button>
<button onclick="size(event,document.body.offsetWidth-16,window.innerHeight-100)">Full screen (it'll be slow on slow browsers)</button>
</span><br>
Renderer:
<span class="method">
<button onclick="window.method='webgl';">WebGL</button>
<button onclick="window.method='canvas';">canvas</button><br>
(This game will adjust its speed by automatically by calculating the FPS.)
</span>
    </body>
</html>

