var WIDTH = 800,
    HEIGHT = 600,
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR,
    $container,
    renderer,
    camera,
    scene,
    whole,
    method,
    stats,
    wire,
    plane3D,
    keyPressed,
    orient,
    pause = true,
    ini = false,
    cubeNum = 20,
    offsetX = 0,
    speed = 1,
    acc = 1,
    speed = speed * acc,
    latitude = 0,
    boostrotate = 0,
    boostY = 0,
    boostYpos = 1,
    scale = 1,
    cameraRotateAngle = 0,
    score = 0,
    gameBlocker = $("<table>"),
    adjusted = false;

if ((/MSIE/).test(navigator.userAgent)) {
    console = {}
    console.log = function () {}
}




//initialize

function init() {
    ini = true;

    // set the scene size
    //var WIDTH = document.body.offsetWidth-8 //400,
    //    HEIGHT = 500 //300;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;

    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    $container = $('#container');

    // create a WebGL or canvas renderer, camera
    // and a scene
    if (method == undefined) {
        if (Detector.webgl == true) {
            renderer = new THREE.WebGLRenderer();
            method = "webgl";
            console.log("Using WebGL.");
        } else if (Detector.canvas == true) {
            renderer = new THREE.CanvasRenderer();
            method = "canvas";
            console.log("Using canvas.");
        } else {
            alert("Sorry, your browser is too old that it does not support neither canvas nor WebGL.")
            console.log("Oh no.");
        }
    } else {
        if (method == "webgl") {
            if (Detector.webgl == true) {
                renderer = new THREE.WebGLRenderer();
                method = "webgl";
            } else {
                alert("Sorry but your browser does not support WebGL.\nTry canvas.");
                ini = false;
                toggleGame("pause");
                return false
            }
        } else if (method == "canvas") {
            if (Detector.canvas == true) {
                renderer = new THREE.CanvasRenderer();
                method = "canvas";
            } else {
                alert("Sorry but your browser does not support canvas.\nTry WebGL.");
                ini = false;
                toggleGame("pause");
                return false
            }
        } else {
            alert("Error");
            return false
        }
    }
    camera = new THREE.Camera(VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);

    // the camera starts at 0,0,0 so pull it back
    camera.position.y = 4;
    camera.position.z = 311;

    scene = new THREE.Scene();

    //Create a group
    whole = new THREE.Object3D();

    scene.add(whole);


    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    $container.append(renderer.domElement);

    $container[0].style.height = HEIGHT + "px"
    $container[0].style.width = WIDTH + "px"

    //plane

    geometry = new THREE.CylinderGeometry(3, 0.01, 0.7, 1.2);
    planeMaterial = [
        new THREE.MeshBasicMaterial({
                color: 0xFFA500,
                shading: THREE.FlatShading,
                wireframe: false
            }),
        new THREE.MeshBasicMaterial({
                color: 0x000000,
                shading: THREE.FlatShading,
                wireframe: true
            })
    ]
    plane3D = new THREE.Mesh(geometry, planeMaterial);
    scene.addObject(plane3D);
    plane3D.type = "plane"
    plane3D.position.set(0, 0, 300);
    plane3D.rotation.x = 0.14;
    plane3D.scale.y = 0.3;

    //make boxes
    for (i = 0; i < cubeNum; i++) {
        addBox();
    }

    var light = new THREE.PointLight(0xFFFFFF);
    light.position.x = 10;
    light.position.y = 10;
    light.position.z = 300;
    scene.addLight(light);

    var light2 = new THREE.PointLight(0xFFFFFF);
    light2.position.x = 0;
    light2.position.y = 10;
    light2.position.z = 289;

    scene.fog = new THREE.Fog(0xF0DE82, 100, 300)


    renderer.shadowMapSoft = true;

    // draw!
    renderer.render(scene, camera);

    //stats
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = 0;
    stats.domElement.style.left = 0;
    $container.append(stats.domElement);

    $("body").focus();
}


function drawAni() {
    if (pause == true) {
        return false
    }
    boostrotate += 0.017453293;
    boostY += 0.03 * boostYpos;
    if (boostY >= 1.5 || boostY <= -1.5) {
        boostYpos *= -1;
    }

    whole.position.y = latitude;
    cameraRotateAngle = Math.round(cameraRotateAngle * 100) / 100
    whole.rotation.z = cameraRotateAngle;
    plane3D.rotation.z = -cameraRotateAngle;

    switch (keyPressed) {
    case 39: //right
        offsetX -= 0.5;
        if (cameraRotateAngle < 0.1) {
            cameraRotateAngle += 0.01;
        }
        break;
    case 37: //left
        offsetX += 0.5;
        if (cameraRotateAngle > -0.1) {
            cameraRotateAngle -= 0.01;
        }
        break;
    case 68: //D
        offsetX -= 0.5;
        if (cameraRotateAngle < 0.1) {
            cameraRotateAngle += 0.01;
        }
        break;
    case 65: //A
        offsetX += 0.5;
        if (cameraRotateAngle > -0.1) {
            cameraRotateAngle -= 0.01;
        }
        break;
    case 0:
        if (cameraRotateAngle > 0) {
            cameraRotateAngle -= 0.01;
        } else if (cameraRotateAngle < 0) {
            cameraRotateAngle += 0.01;
        }
    }
    switch (orient.gamma > 0) {
    case true:
        offsetX -= 0.5;
        if (cameraRotateAngle < 0.1) {
            cameraRotateAngle += 0.01;
        }
        break;
    case false:
        if (Math.round(orient.gamma) == 0) break;
        offsetX += 0.5;
        if (cameraRotateAngle > -0.1) {
            cameraRotateAngle -= 0.01;
        }
        break;
    }
    for (var i = 0; i < whole.children.length; i++) {
        var box = whole.children[i];
        if (box.type != "box" && box.type != "function") {
            continue;
        }
        if (box.type == "box") {
            box.scale.set(scale, scale, scale);
        }
        box.position.z += speed;
        box.position.x = box.position.oriX + offsetX;
        box.materials[0].wireframe = wire;
        if (box.type == "function") {
            //if(box.function=="boost"){
            box.rotation.y = boostrotate;
            box.position.y = boostY;
            //}
        }
    }

    drawMoreBox();

    for (i = 0; i < whole.children.length; i++) {
        var box = whole.children[i];
        if (box.position.z < 301 && box.position.z > 295 && box.position.x > -5 * scale && box.position.x < 5 * scale && latitude > (-2.5 * scale)) {
            if (box.type == "box") {
                boom(box);
                return false;
                break
            } else if (box.type == "function" && box.position.x > -2.5 && box.position.x < 2.5) {
                whole.removeChild(box);
                addBox();

                switch (box.function) {
                case "boost":
                    createBlocker("Boost box");
                    shake();
                    setTimeout(function () {
                            setTimeout(removeBlocker, 200);
                            drawAni();
                            $({
                                    number: acc
                                }).stop().animate({
                                    number: 1.75
                                }, {
                                    duration: 200,
                                    step: function (result) {
                                        shake();
                                        acc = result;
                                    }
                                }).delay(2000).animate({
                                    number: 1
                                }, {
                                    duration: 700,
                                    step: function (result) {
                                        acc = result;
                                    }
                                });
                        }, 200);
                    break
                case "fly":
                    createBlocker("Fly box");
                    //shake();
                    setTimeout(function () {
                            setTimeout(removeBlocker, 200);
                            drawAni();
                            $({
                                    number: latitude
                                }).stop().animate({
                                    number: -10
                                }, {
                                    duration: 500,
                                    step: function (result) {
                                        //shake();
                                        latitude = result;
                                    }
                                }).delay(5000).animate({
                                    number: 0
                                }, {
                                    duration: 500,
                                    step: function (result) {
                                        latitude = result;
                                    }
                                });
                        }, 200);
                    break
                case "shrink":
                    createBlocker("Shrink box");
                    setTimeout(function () {
                            setTimeout(removeBlocker, 200);
                            drawAni();
                            $({
                                    number: scale
                                }).stop().animate({
                                    number: 0.5
                                }, {
                                    duration: 300,
                                    step: function (result) {
                                        scale = result;
                                    }
                                }).delay(5000).animate({
                                    number: 1
                                }, {
                                    duration: 300,
                                    step: function (result) {
                                        (scale == 1) ? 0 : (scale = result);
                                    }
                                });
                        }, 200);
                    break
                }
                return false
            }
        }
    }
    $("#output").html("Item on field: " + whole.children.length + ", Adjusted speed: <progress min='0' max='500' style='width:50px;vertical-align:middle;' value='" + Math.round(speed * 10000) / 100 + "'></progress> " + Math.round(speed * 10000) / 100 + "%");
    renderer.render(scene, camera);
    stats.update();
    if (getFPS(stats) && adjusted == false) {
        removeBlocker();
        speed = (120 - getFPS(stats)) * (1.9 / 60) * acc;
        adjusted = true;
    } else if (getFPS(stats)) {
        speed = (120 - getFPS(stats)) * (1.9 / 60) * acc;
    }
    requestAnimationFrame(drawAni);
}


function drawMoreBox() {
    for (i = 0; i < whole.children.length; i++) {
        var box = whole.children[i];
        if (box.position.z > 350) {
            //scene.removeObject(box);
            whole.removeChild(box);
            addBox();
            score++;
            $("#score").html(score);
        }
    }
}



function boom(target) {
    toggleGame("pause");
    ini = false;
    shake();
    setTimeout(function () {
            alert("Boom!\nYour final score is " + score + ".")
        }, 300);
    console.log("Boomed!", target);
    document.getElementById("init").disabled = false;
    $(".nav button").each(function () {
            this.disabled = true;
        })
    //renderer.render(scene, camera);
}


function addBox() {
    if (Math.floor(Math.random() * 50) == 1) {
        //Boost box
        var boostmaterial = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('data:image/jpg;base64,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')
            });

        var box = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), boostmaterial);
        box.position.set(Math.random() * 140 - 70 - offsetX, 0, Math.random() * 300 - 150)
        box.position.oriX = box.position.x;
        box.position.x += offsetX;
        box.type = "function"
        box.
        function = "boost"
        //scene.addObject(box);
        whole.addChild(box);
    } else if (Math.floor(Math.random() * 50) == 1) {
        //Fly box
        if (method == "webgl") {
            var boostmaterial = new THREE.MeshLambertMaterial({
                    color: 0xFF0000
                });
        } else if (method == "canvas") {
            var boostmaterial = new THREE.MeshBasicMaterial({
                    color: 0xFF0000
                });
        }
        var box = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), boostmaterial);
        box.position.set(Math.random() * 140 - 70 - offsetX, 0, Math.random() * 300 - 150)
        box.position.oriX = box.position.x;
        box.position.x += offsetX;
        box.type = "function"
        box.
        function = "fly"
        whole.addChild(box);

    } else if (Math.floor(Math.random() * 50) == 1) {
        //Shrink box
        if (method == "webgl") {
            var boostmaterial = new THREE.MeshLambertMaterial({
                    color: 0x00FF00
                });
        } else if (method == "canvas") {
            var boostmaterial = new THREE.MeshBasicMaterial({
                    color: 0x00FF00
                });
        }
        var box = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 5), boostmaterial);
        box.position.set(Math.random() * 140 - 70 - offsetX, 0, Math.random() * 300 - 150)
        box.position.oriX = box.position.x;
        box.position.x += offsetX;
        box.type = "function"
        box.
        function = "shrink"
        whole.addChild(box);

    } else {
        if (method == "webgl") {
            var material = new THREE.MeshLambertMaterial({
                    color: /*eval("0x"+Math.floor(Math.random()*16777215).toString(16))*/ Math.random() * 0xffffff
                });
        } else if (method == "canvas") {
            var material = new THREE.MeshBasicMaterial({
                    color: /*eval("0x"+Math.floor(Math.random()*16777215).toString(16))*/ Math.random() * 0xffffff
                });
        }
        var box = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 10), /*new THREE.MeshNormalMaterial()*/ material);
        box.position.set(Math.random() * 420 - 210 - offsetX, 0, Math.random() * 300 - 150)
        box.position.oriX = box.position.x;
        box.position.x += offsetX;
        box.scale.set(scale, scale, scale);
        box.type = "box"
        //scene.addObject(box);
        whole.addChild(box);
    }

}

function resetGame() {

    $("#container").html('<div id="score">0</div>');
    $("#output").html('');

    window.pause = true,
    window.ini = false,
    window.offsetX = 0,
    window.score = 0,
    window.speed = 1,
    window.scale = 1,
    window.latitude = 0,
    window.adjusted = false;

    init();
    toggleGame("pause")
}


function toggleGame(state) {
    if ((state == undefined && pause == true) || state == "start") {
        if (state == undefined) {
            removeBlocker();
        }
        pause = false;
        drawAni();
        $('span.nav button').each(function () {
                this.disabled = false
            });
        document.getElementById("go").disabled = 'disabled';
    } else if ((state == undefined && pause == false) || state == "pause") {
        if (state == undefined) {
            createBlocker("Pause");
        }
        pause = true;
        $('span.nav button').each(function () {
                this.disabled = false
            });
        document.getElementById("pause").disabled = 'disabled';
    } else if (state == undefined && state == "both") {
        pause = true;
        $('span.nav button').each(function () {
                this.disabled = true
            });
    }
}


function shake() {
    $("#container").css({
            top: "0px",
            left: "0px"
        }).animate({
            top: -3,
            left: 3
        }, {
            duration: 25
        }).animate({
            top: 3,
            left: -3
        }, {
            duration: 25
        }).animate({
            top: -3,
            left: -3
        }, {
            duration: 25
        }).animate({
            top: 3,
            left: 3
        }, {
            duration: 25
        }).animate({
            top: 0,
            left: 0
        }, {
            duration: 25
        })

}


function difficulty(e) {
    $('span.diff button').each(function () {
            this.disabled = false
        });
    e.target.disabled = "disabled";
}

function size(e, w, h) {
    $('span.size button').each(function () {
            this.disabled = false
        });
    e.target.disabled = "disabled";
    WIDTH = w;
    HEIGHT = h;
}


function loadin() {
    $("body").keydown(function (event) {
            keyPressed = event.keyCode
            switch (event.keyCode) {
            case 13: //Enter
                if (ini == false) {
                    resetGame();
                    toggleGame('start');
                    $("#init").each(function () {
                            this.disabled = true;
                        });
                    createBlocker("Adjusting FPS...");
                }
                break;
            case 80: //P
                if (ini == true) {
                    toggleGame();
                }
                break;
            case 32: //Space
                if (ini == true) {
                    toggleGame();
                    event.preventDefault();
                    return false
                }
                break;
            case 83: //S
                $(stats.domElement).toggleClass("hide");
                break;
            case 87: //W
                wire = !wire
                break;
            }
        });
    $("body").keyup(function (event) {
            keyPressed = 0;
        });

    $('body').focus();
    $("#go").click(function () {
            toggleGame()
        });
    $("#pause").click(function () {
            toggleGame()
        });
    $("#init,.blocker>span.enter").click(function () {
            resetGame();
            toggleGame('start');
            this.disabled = "disabled";
            createBlocker("Adjusting FPS...");
        });


    $(".enter,.loading").toggleClass("hide");

}
window.addEventListener('deviceorientation', function (event) {
        orient = event;
        $("h2").html("\"Gamma: " + orient.gamma + "\"");
    }, false);