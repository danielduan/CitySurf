var gmap;
google.maps.visualRefresh = true;
var MY_MAPTYPE_ID = 'custom_style';

var featureOpts = [
    {
      stylers: [
        { hue: '#18CAE6' },
        { visibility: 'simplified' },
        { gamma: 0.5 },
        { weight: 0.5 }
      ]
    },
    {
      elementType: 'labels',
      stylers: [
        { visibility: 'on' }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        { color: '#000044' }
      ]
    }
  ];

function initialize() {
  var mapOptions = {
    zoom: 12,
    scrollwheel: false,
    navigationControl: false,
    mapTypeControl: false,
    scaleControl: false,
    draggable: false,
    center: new google.maps.LatLng(latitude, longitude),
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
    },
    mapTypeId: MY_MAPTYPE_ID
  };
  gmap = new google.maps.Map(document.getElementById('mapimage'),
      mapOptions);

  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(gmap);

  var styledMapOptions = {
    name: 'CitySurf'
  };

  var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

  gmap.mapTypes.set(MY_MAPTYPE_ID, customMapType);

  //console.log("map load");
}

google.maps.event.addDomListener(window, 'load', initialize);


function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        if (speed != 0) {
            xPos -= /*Math.sin(degToRad(yaw))*/ speed * elapsed;
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
    if (count % 300 == 0)
        map();
    //map();
    if (!pause) {
        //map();
        drawScene();
        animate();
    }

    var message;

    if (total < 6) {
        message = "light";
    } else if (total < 12) {
        message = "moderate";
    } else {
        message = "severe";
    }

    document.getElementById("score").innerHTML = "Score: " + Math.ceil(zcount);
    //document.getElementById("score").innerHTML = "Score: " + total;
    document.getElementById("condition").innerHTML = "Traffic condition: " + message;
}

function map() {
    
    var ind = Math.floor(zcount / 100);
    if (pause != true) {
        latitude += latincrement;
        longitude += longincrement;
    }

    gmap.panTo(new google.maps.LatLng(latitude, longitude));

    //SouthLatitude, WestLongitude, NorthLatitude, and EastLongitude values
    var SL = latitude - .1;
    var NL = latitude + .1;
    var WL = longitude - .1;
    var EL = longitude + .1;
    var boundingBox = SL + "," + WL + "," + NL + "," + EL;
    var msdnAPI = "http://dev.virtualearth.net/REST/v1/Traffic/Incidents/" + boundingBox + "?";
    //console.log(msdnAPI);
    //console.log(difficulty);
    $.ajax({
            type: 'GET',
            url: msdnAPI,
            data: {
                key: "ApDsB3Y0HgxN1AJaupkRmQ0o8m-QNQWUrwDxX4hE9NjKM3JO1dd_-MgRDftB5ZmX"
            },
            jsonp: "jsonp",
            dataType: 'jsonp', // Pay attention to the dataType/contentType
            success: function (data) {
                total = data.resourceSets[0].estimatedTotal;

                if (total < 6)
                    difficulty = 30;
                else
                    difficulty = total * 5;

                if (difficulty > 70) {
                    difficulty = 70;
                }

                //console.log("total: "+total + " difficulty: " + difficulty);
            }
        });
    if (ind < 20){
        document.getElementById("mapimage").src = maps[ind].src;
    }
    


}
