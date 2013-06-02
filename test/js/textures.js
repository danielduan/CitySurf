    function initTexture() {

        texture = gl.createTexture();
        texture.image = new Image();

        texture.image.onload = function () {
            handleLoadedTexture(texture);
        }
        texture.image.src = "tron.png";
    }

    function handleLoadedTexture(textures) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.bindTexture(gl.TEXTURE_2D, textures);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);


        gl.bindTexture(gl.TEXTURE_2D, null);
    }



    