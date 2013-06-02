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
    latitude -= 0.0005;
    longitude += 0.00158;

    //SouthLatitude, WestLongitude, NorthLatitude, and EastLongitude values
    var SL = latitude - .1;
    var NL = latitude + .1;
    var WL = longitude - .1;
    var EL = longitude + .1;
    var boundingBox = SL + "," + WL + "," + NL + "," + EL;
    var msdnAPI = "http://dev.virtualearth.net/REST/v1/Traffic/Incidents/" + boundingBox + "?";
    console.log(msdnAPI);
    console.log(difficulty);
    $.ajax({
    type: 'GET',
    url: msdnAPI, 
    data: {
        key: "ApDsB3Y0HgxN1AJaupkRmQ0o8m-QNQWUrwDxX4hE9NjKM3JO1dd_-MgRDftB5ZmX"
    },
    jsonp: "jsonp",
    dataType: 'jsonp', // Pay attention to the dataType/contentType
    success: function (data ) {
            var total = data.resourceSets[0].estimatedTotal;
                difficulty = total * 30;
    }
    });
    document.getElementById("mapimage").src = maps[ind].src;

  
}
