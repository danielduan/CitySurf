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
var difficulty = 30;
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
var total = 0;
//start webGL service

function webGLStart() {
    for (var i = 0; i < 20; i++) {
        maps[i] = new Image();
        if (i < 10)
            maps[i].src = "img/maps/" + "0"  + i + ".png";
        else
            maps[i].src = "img/maps/" + i + ".png";
    }
    var canvas = document.getElementById("cube-runner");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (BrowserDetect.browser != "Chrome") {
        document.getElementById("status").innerHTML = "Please use Google Chrome";
    }
    initGL(canvas);
    initShaders()
    initBuffers();
    initTexture();
    fillXZ();
    initAudio();
    gl.clearColor(0.0, 0.0, 0.0, 0.2);
    gl.enable(gl.DEPTH_TEST);
    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.getElementById("mapimage").width = window.innerWidth * 0.15;
    document.getElementById("play_button").addEventListener('click', function (event) {
            event.preventDefault();
            pushRestart();
            playMain();
            pause = false;
        });
    tick();
}

function isPaused() {};

function isDead() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("status").innerHTML = "Game Over";
    document.getElementById("points").style.display = "none";
    document.getElementById("mapimage").style.display = "none";
    document.getElementById("footer").style.display = "block";
    document.getElementById("play_button").innerHTML = "Restart";
    document.getElementById("play_button").addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById("status").innerHTML = "Analyzing music and generating blocks...";
            pushRestart();
            if (alive) {
                pause = !pause;
                if (pause == true)
                    isPaused();
            } else {
                pitch = 0;
                pitchRate = 0;
                yaw = 0;
                yawRate = .5;
                xPos = 0;
                yPos = 0.4;
                zPos = 0;
                speed = 0;
                godmode = false;
                planeScale = 0;
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

function inGodMode() {};

function pushRestart() {
    playMain();
    document.getElementById("points").style.display = "block";
    document.getElementById("mapimage").style.display = "block";
    document.getElementById("footer").style.display = "none";
    document.getElementById("menu").style.display = "none";
};



var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent)
            || this.searchVersion(navigator.appVersion)
            || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i=0;i<data.length;i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            }
            else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
    },
    dataBrowser: [
        {
            string: navigator.userAgent,
            subString: "Chrome",
            identity: "Chrome"
        },
        {   string: navigator.userAgent,
            subString: "OmniWeb",
            versionSearch: "OmniWeb/",
            identity: "OmniWeb"
        },
        {
            string: navigator.vendor,
            subString: "Apple",
            identity: "Safari",
            versionSearch: "Version"
        },
        {
            prop: window.opera,
            identity: "Opera",
            versionSearch: "Version"
        },
        {
            string: navigator.vendor,
            subString: "iCab",
            identity: "iCab"
        },
        {
            string: navigator.vendor,
            subString: "KDE",
            identity: "Konqueror"
        },
        {
            string: navigator.userAgent,
            subString: "Firefox",
            identity: "Firefox"
        },
        {
            string: navigator.vendor,
            subString: "Camino",
            identity: "Camino"
        },
        {       // for newer Netscapes (6+)
            string: navigator.userAgent,
            subString: "Netscape",
            identity: "Netscape"
        },
        {
            string: navigator.userAgent,
            subString: "MSIE",
            identity: "Explorer",
            versionSearch: "MSIE"
        },
        {
            string: navigator.userAgent,
            subString: "Gecko",
            identity: "Mozilla",
            versionSearch: "rv"
        },
        {       // for older Netscapes (4-)
            string: navigator.userAgent,
            subString: "Mozilla",
            identity: "Netscape",
            versionSearch: "Mozilla"
        }
    ],
    dataOS : [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
               string: navigator.userAgent,
               subString: "iPhone",
               identity: "iPhone/iPod"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ]

};
BrowserDetect.init();