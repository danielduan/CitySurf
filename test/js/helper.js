	function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
        if (event.keyCode == 32)
            pause = !pause;
        if (event.keyCode == 67)
            initAudio();
    }


    function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    function handleKeys() {

        if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
            // left arrow
                //yawRate = 50;
            if (wave > 3)
                speed = 0.005;
            else   
                speed = 0.003 ;
        } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
            // right arrow
                //yawRate = -50;
            if (wave > 3)
                speed = -0.005 ;
            else
                speed = -0.003;
        } else {
            speed = 0;
        }

        if (currentlyPressedKeys[71] || currentlyPressedKeys[103])
        {
            //G and g to enter godmode
            if (godmode == false)
                godmode = true;
            else
                godmode = false;
        }

        if (currentlyPressedKeys[114] || currentlyPressedKeys[82])
        {
                //R and r to reset
                pitch = 0;
                pitchRate = 0;
                yaw = 0;
                yawRate = .5;
                xPos = 0;
                yPos = 0.4;
                zPos = 0;
                speed = 0;

                godmode = false;

                pause = true;
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
        }
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }