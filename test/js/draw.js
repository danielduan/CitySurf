    //Randomly generate coordinates (X and Z) for cubes

    function fillXZ() {
        for (var i = 0; i < difficulty; i++) {
            var num1 = Math.random() * 14 - 7;
            var num2 = -Math.random() * 60;
            while (num2 > -10)
                num2 = -Math.random() * 60;
            X.push(num1);
            Z.push(num2);
            cubeTrans.push(-0.4);
        }
    }

    function refillXZ() {
        //console.log("splicing 0-" + difficulty + " wave: " + wave);
        //console.log("Length " + X.length);
        if (X.length > 250) {
            X.splice(0, difficulty);
            Z.splice(0, difficulty);
            cubeTrans.splice(0, difficulty);
        }
        for (var i = 0; i < difficulty; i++) {
            X[X.length] = Math.random() * 14 - 7;
            Z[Z.length] = -Math.random() * 30 - 30;
            cubeTrans[cubeTrans.length] = 20;
        }
    }

    var planeScale=0;

    //draw cubes

    function drawCubes(mv) {
        for (var i = 0; i < Z.length; i++) {
            mat4.identity(mv);
            Z[i] += mph;
            var extra = mph;
            if (mph > .2)
                extra = .2;
            if (godmode == false) {
                if (Math.sqrt((X[i] - xPos) * (X[i] - xPos) + (Z[i] + 1) * (Z[i] + 1)) <= (.2 + extra) && zPos >= Z[i]) {
                    pause = !pause;
                    alive = false;
                    isDead();
                }
            }

            if (xPos < -6.9)
                xPos = -6.9;
            if (xPos > 6.9)
                xPos = 6.9;
            if (cubeTrans[i] < -0.2)
                cubeTrans[i] = -0.4;
            else if (cubeTrans[i] > -0.4)
                cubeTrans[i] -= mph * 4;
            
            mat4.translate(mv, [X[i] - xPos, (planeScale-9) * cubeTrans[i], Z[i]]);

            mvPushMatrix();
            mat4.scale(mv, [.3, .3, .3]);
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
            gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

            //gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture[0]);
            gl.uniform1i(shaderProgram.samplerUniform, 0);

            var lighting = true;
            gl.uniform1i(shaderProgram.useLightingUniform, lighting);
            if (lighting) {
                gl.uniform3f(
                    shaderProgram.ambientColorUniform,
                    ambientR,
                    ambientG,
                    ambientB);

                var lightingDirection = [
                    lightDirectionX,
                    lightDirectionY,
                    lightDirectionZ
                ];
                var adjustedLD = vec3.create();
                vec3.normalize(lightingDirection, adjustedLD);
                vec3.scale(adjustedLD, -1);
                gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

                gl.uniform3f(
                    shaderProgram.directionalColorUniform,
                    directionR,
                    directionG,
                    directionB);
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        }
        var avgSpectrum = 0;
         for (var i = 0; i < currentvalue.length; i++)
            avgSpectrum += currentvalue[i];
        avgSpectrum = avgSpectrum / currentvalue.length;
        mph = Math.ceil(avgSpectrum/10)/50;
        if (mph < 0.1)
            mph = 0.1;
        zcount += mph;
        if (zcount >= wave * 30 + 15) {
            wave += 1;
            refillXZ();
            zbottom += 100;
            //mph += .008;
        }
    }

    function drawPlane(mv) {
        mat4.identity(mv);

        mat4.translate(mv, [-xPos, -.7, -1]);

        if (planeScale < 9.98)
        {
               planeScale += 0.2;
               //console.log(planeScale);
        }

        mvPushMatrix();

        mat4.scale(mv, [.73*planeScale, 0.01, 6.0*planeScale]);
        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        //gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture[1]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

        var lighting = true;
        gl.uniform1i(shaderProgram.useLightingUniform, lighting);
        if (lighting) {
            gl.uniform3f(
                shaderProgram.ambientColorUniform,
                ambientR,
                ambientG,
                ambientB);

            var lightingDirection = [
                lightDirectionX,
                lightDirectionY,
                lightDirectionZ
            ];
            var adjustedLD = vec3.create();
            vec3.normalize(lightingDirection, adjustedLD);
            vec3.scale(adjustedLD, -1);
            gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

            gl.uniform3f(
                shaderProgram.directionalColorUniform,
                directionR,
                directionG,
                directionB);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        mvPopMatrix();
    }

    //draw the pyramid

    function drawPyramid(mv) {
        mat4.identity(mv);
        joggingAngle += 4 * (1 + wave * .005);
        mat4.translate(mv, [0.0, (Math.cos(degToRad(joggingAngle)) / 20 - 0.4), -1]);

        mvPushMatrix();
        mat4.scale(mv, [.1, .1, .1]);
        mat4.rotate(mvMatrix, degToRad(90), [1, 0, 0]);


        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

        //mvPopMatrix();
    }

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        //mat4.rotate(mvMatrix, degToRad(-10), [1, 0, 0]);
        //mat4.rotate(mvMatrix, degToRad(30), [0, 10, 0]);
        //mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

        if (alive) {
            drawCubes(mvMatrix);
            drawPyramid(mvMatrix);
        }

        drawPlane(mvMatrix);
    }