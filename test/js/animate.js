function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            if (speed != 0) {
                xPos -= /*Math.sin(degToRad(yaw))*/  speed * elapsed;
                //zPos -= /*Math.cos(degToRad(yaw))*/  speed * elapsed;

                 // 0.6 "fiddle factor" - makes it feel more realistic :-)
                //yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
            }
            //yaw += yawRate * elapsed;
            //pitch += pitchRate * elapsed;

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

        document.getElementById("points").innerHTML=Math.ceil(zcount);
    }

function map() {
    var ind = Math.floor(zcount / 10);
    document.getElementById("mapimage").src = maps[ind].src;

    $.ajax({
    dataType: "json",
    url: "http://dev.virtualearth.net/REST/v1/Traffic/Incidents/37,-105,45,-94?",
    data: {
    key: "ApDsB3Y0HgxN1AJaupkRmQ0o8m-QNQWUrwDxX4hE9NjKM3JO1dd_-MgRDftB5ZmX"
    }
    });

}
