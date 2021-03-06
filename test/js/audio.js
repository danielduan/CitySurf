var context;
var source = 0;
var jsProcessor = 0;


function loadSample(url) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
            source.buffer = context.createBuffer(request.response, false);
            source.loop = true;
            source.noteOn(0);
            visualizer();
            loadMain();
         // run jsfft visualizer
        //document.getElementById("status").innerHTML = "Loading Complete";
    }

    request.send();
}

var mainsong;

function loadMain() {
    // Load asynchronously
    var url = "audio/thisiswhatitfeelslike.mp3";

    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        mainsong = request.response;
        document.getElementById("status").innerHTML = "Loading Complete";
        document.getElementById("play_button").style.visibility = "visible";
    }

    request.send();
}

function playMain() {
    source.buffer = context.createBuffer(mainsong, false);
    source.loop = true;
    for (var i = 0; i < maxvalue.length; i++) {
        maxvalue[i] = 0;
    }
    source.noteOn(0);
    visualizer(); // run jsfft visualizer
}

function pauseMusic() {
    //source.noteOff(0);
}

var canvas, ctx;

function initAudio() {
    canvas = document.getElementById("music");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    context = new webkitAudioContext();
    source = context.createBufferSource();

    // This AudioNode will do the amplitude modulation effect directly in JavaScript
    jsProcessor = context.createJavaScriptNode(2048);
    jsProcessor.onaudioprocess = audioAvailable; // run jsfft audio frame event

    // Connect the processing graph: source -> jsProcessor -> analyser -> destination
    source.connect(jsProcessor);
    jsProcessor.connect(context.destination);

    loadmusic();

    // Load the sample buffer for the audio source
    //loadSample("greyhound.m4a");
}

function loadmusic() {
    // Load the sample buffer for the audio source
    loadSample("audio/atmosphere.mp3");
}

// #####################
// end of Google Web Audio code fragment
// #####################

// #####################
// the following is a modified version of my original Audio Data API Visualizer here:
// http://www.storiesinflight.com/jsfft/visualizer/index.html
// #####################


var theme = ["rgba(255, 255, 255,", "rgba(240, 240, 240,", "rgba(210, 210, 210,", "rgba(180, 180, 180,", "rgba(150, 150, 150,", "rgba(120, 120, 150,", "rgba(90, 90, 150,", "rgba(60, 60, 180,", "rgba(30, 30, 180,", "rgba(0, 0, 200,", "rgba(0, 0, 210,", "rgba(0, 0, 220,", "rgba(0, 0, 230,", "rgba(0, 0, 240,", "rgba(0, 0, 255,", "rgba(0, 30, 255,", "rgba(0, 60, 255,", "rgba(0, 90, 255,", "rgba(0, 120, 255,", "rgba(0, 150, 255,"];

var histoindex = 0;
var histomax = 500;

histobuffer_x = new Array();
histobuffer_y = new Array();
histobuffer_t = new Array();
for (a = 0; a < histomax; a++) {
    histobuffer_t[a] = 0;
}

maxvalue = new Array();
for (a = 0; a < 1024; a++) {
    maxvalue[a] = 0;
}

currentvalue = new Array();

var frameBufferSize = 4096;
var bufferSize = frameBufferSize / 4;

var signal = new Float32Array(bufferSize);
var peak = new Float32Array(bufferSize);

var fft = new FFT(bufferSize, 44100);




function audioAvailable(event) {

    // Copy input arrays to output arrays to play sound
    var inputArrayL = event.inputBuffer.getChannelData(0);
    var inputArrayR = event.inputBuffer.getChannelData(1);
    var outputArrayL = event.outputBuffer.getChannelData(0);
    var outputArrayR = event.outputBuffer.getChannelData(1);

    var n = inputArrayL.length;
    for (var i = 0; i < n; ++i) {
        outputArrayL[i] = inputArrayL[i];
        outputArrayR[i] = inputArrayR[i];
        signal[i] = (inputArrayL[i] + inputArrayR[i]) / 2; // create data frame for fft - deinterleave and mix down to mono
    }

    // perform forward transform
    fft.forward(signal);

    for (var i = 0; i < bufferSize / 8; i++) {
        magnitude = fft.spectrum[i] * 8000; // multiply spectrum by a zoom value

        currentvalue[i] = magnitude;

        if (magnitude > maxvalue[i]) {
            maxvalue[i] = magnitude;
            new_pos(canvas.width / 2 + i * 4 + 4, (canvas.height / 2) - magnitude - 20);
            new_pos(canvas.width / 2 + i * 4 + 4, (canvas.height / 2) + magnitude + 20);
            new_pos(canvas.width / 2 - i * 4 + 4, (canvas.height / 2) - magnitude - 20);
            new_pos(canvas.width / 2 - i * 4 + 4, (canvas.height / 2) + magnitude + 20);
        } else {
            if (maxvalue[i] > 10) {
                maxvalue[i]-=1.5;
            }
        }

    }

}


function new_pos(x, y) {
    x = Math.floor(x);
    y = Math.floor(y);

    histobuffer_t[histoindex] = 19;
    histobuffer_x[histoindex] = x;
    histobuffer_y[histoindex++] = y;

    if (histoindex > histomax) {
        histoindex = 0;
    }
}

var spectrum_on = false;

function visualizer() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (spectrum_on) {
        ctx.fillStyle = '#444444';
        var canvasWidth = canvas.width/128;
        for (var i = 0; i < currentvalue.length; i++) {
            // Draw rectangle bars for each frequency bin
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(i * canvasWidth, canvas.height-maxvalue[i]*2, canvasWidth, -5);
            ctx.fillStyle = '#444444';
            ctx.fillRect(i * canvasWidth, canvas.height, canvasWidth, -currentvalue[i]*2);
        }
    }

    for (h = 0; h < histomax; h++) {
        if (histobuffer_t[h] > 0) {
            var size = histobuffer_t[h] * 4;
            ctx.fillStyle = theme[(histobuffer_t[h])] + (0.5 - (0.5 - histobuffer_t[h] / 40)) + ')';
            ctx.beginPath();
            ctx.arc(histobuffer_x[h], histobuffer_y[h], size * .5, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();

            histobuffer_t[h] = histobuffer_t[h] - 1;
            histobuffer_y[h] = histobuffer_y[h] - 3 + Math.random() * 6;
            histobuffer_x[h] = histobuffer_x[h] - 3 + Math.random() * 6;
        }
    }
    t = setTimeout('visualizer()', 50);
}


function toggle_spectrum() {
    if (spectrum_on) {
        spectrum_on = false;
    } else {
        spectrum_on = true;
    }
}