function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            if (speed != 0) {
                xPos -= /*Math.sin(degToRad(yaw))*/  speed * elapsed;
                zPos -= /*Math.cos(degToRad(yaw))*/  speed * elapsed;

                joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
                yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
            }

            yaw += yawRate * elapsed;
            pitch += pitchRate * elapsed;

        }
        lastTime = timeNow;
    }


    function tick() {
        requestAnimFrame(tick);
        handleKeys();
        count += 1;
        if (count % 50 == 0)
            map();
        //map();
        if (!pause)
        {
            //map();
            drawScene();
            animate();
        }
    }

function map() {
    var ind = Math.floor(zcount / 10);
    var source = "<img src=\"" + maps[ind].src + "\" style=\"margin-top:10px;margin-left:10px;border: 1px solid #ddd;\">";
    console.log(source);
    document.getElementById("map").innerHTML = source;
}