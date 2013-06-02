    function initTexture() {
        var crateImage = new Image();

        var texture = gl.createTexture();
        texture.image = crateImage;
        crateTextures.push(texture);

        crateImage.onload = function () {
            handleLoadedTexture(crateTextures);
        }
        crateImage.src = "crate.gif";
    }

    function handleLoadedTexture(textures) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textures[0].image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);


        gl.bindTexture(gl.TEXTURE_2D, null);
    }



    