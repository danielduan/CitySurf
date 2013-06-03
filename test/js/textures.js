    function initTexture() {

        texture[0] = gl.createTexture();
        texture[0].image = new Image();

        texture[0].image.onload = function () {
            handleLoadedTexture(texture[0]);
        }
        texture[0].image.src = "img/tron.png";

        texture[1] = gl.createTexture();
        texture[1].image = new Image();

        texture[1].image.onload = function () {
            handleLoadedTexture(texture[1]);
        }
        texture[1].image.src = "img/path.png";
    }

    function handleLoadedTexture(textures) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.bindTexture(gl.TEXTURE_2D, textures);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);


        gl.bindTexture(gl.TEXTURE_2D, null);
    }



    