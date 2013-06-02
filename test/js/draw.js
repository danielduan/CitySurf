    //Randomly generate coordinates (X and Z) for cubes
    function fillXZ(){
        for(var i = 30; i < 60; i++)
        {
            var num1 = Math.random() * 14 - 7;  
            var num2 = -Math.random() * 30;
            while(num2 > -10)
              num2 = -Math.random() * 30;
            X[i] = num1;
            Z[i] = num2;
        }
    }

    function refillXZ(){
        X.splice(0, 30);
        Z.splice(0, 30);
        for(var i = 30; i < 60; i++)
        {
            var num1 = Math.random() * 14 - 7;  
            var num2 = -Math.random() * 30 - 30;
            X[i] = num1;
            Z[i] = num2;
        }
    }

    //draw cubes
    function drawCubes(mv) {
        for (var i = 0; i < 60; i++)
        {
            mat4.identity(mv);
            Z[i] += mph;
            
            if (Math.sqrt((X[i] - xPos) * (X[i] - xPos) + (Z[i] - zPos) * (Z[i] - zPos)) <= .25 && zPos >= Z[i])
                pause = !pause;
            if(xPos < -7)
                xPos = -6.8;
            if(xPos > 7)
                xPos = 6.8;

            mat4.translate(mv, [X[i]-xPos, -.4, Z[i]]);
            mvPushMatrix();
            mat4.scale(mv,[.3,.3,.3]);
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
                ambientB
            );

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
                directionB
                );
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

        }
        zcount += mph;
        if(zcount >= wave * 30 + 15)
        {
            wave+= 1;
            refillXZ();
            zbottom += 100;
            mph += .01;
        }
    }   

    function drawPlane(mv) {
        mat4.identity(mv);
 

        mat4.translate(mv, [-xPos, -.4, 0]);
     
            mvPushMatrix();
            mat4.scale(mv,[14,0.01,10]);
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
                ambientB
            );

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
                directionB
                );
            }

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        
        mvPopMatrix();
    }

    //draw the pyramid
    function drawPyramid(mv) {
        mat4.identity(mv);
 

        mat4.translate(mv, [0.0, -0.4, -1]);
     
        mvPushMatrix();
        mat4.scale(mv,[.1,.1,.1]);
        mat4.rotate(mvMatrix, degToRad(90), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(Math.sin(yawRate)), [1,0,0]);
     
        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
     
        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
     
        setMatrixUniforms();
        gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);
     
        mvPopMatrix();
    }

    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(60, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.rotate(mvMatrix, degToRad(-10), [1, 0, 0]);
        mat4.rotate(mvMatrix, degToRad(30), [0, 10, 0]);
        mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);

        if (alive) {
            drawCubes(mvMatrix);
            drawPyramid(mvMatrix);
        }

        drawPlane(mvMatrix);
    }