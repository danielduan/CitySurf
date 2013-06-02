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
        if (!pause)
        {
            drawScene();
            animate();
        }
    }