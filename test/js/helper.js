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

        if (currentlyPressedKeys[33]) {
            // Page Up
            pitchRate = 0.1;
        } else if (currentlyPressedKeys[34]) {
            // Page Down
            pitchRate = -0.1;
        } else {
            pitchRate = 0;
        }

        if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
            // up arrow
            yawRate = 0.1;
        } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
            // down arrow
            yawRate = -0.1;
        } else {
            yawRate = 0;
        }

        if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
            // left arrow
                yawRate = 50;
                speed = 0.003;
        } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
            // right arrow
                yawRate = -50;
                speed = -0.003;
        } else {
            speed = 0;
        }
    }

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }