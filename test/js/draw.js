    //Randomly generate coordinates (X and Z) for cubes
    function fillXZ(){
        for(var i = 1000 * wave; i < 1000 * wave + 1000; i++)
        {
            var num1 = Math.random() * 60 - 30;  
            var num2 = -Math.random() * 300 ;
            while(num2 > -10)
                num2 = -Math.random() * 300 ;
            X[i] = num1;
            Z[i] = num2;
        }
        for(var i = 1000; i < 2000; i++)
        {
            var num1 = Math.random() * 60 - 30;  
            var num2 = -Math.random() * 300 - 300;
            X[i] = num1;
            Z[i] = num2;
        }
        for(var i = 2000; i < 3000; i++)
        {
            var num1 = Math.random() * 60 - 30;  
            var num2 = -Math.random() * 300 - 600;
            X[i] = num1;
            Z[i] = num2;
        }
        for(var i = 3000; i < 4000; i++)
        {
            var num1 = Math.random() * 60 - 30;   
            var num2 = -Math.random() * 300 - 900;
            X[i] = num1;
            Z[i] = num2;
        }
        for(var i = 4000; i < 5000; i++)
        {
            var num1 = Math.random() * 60 - 30;   
            var num2 = -Math.random() * 300 - 1200;
            X[i] = num1;
            Z[i] = num2;
        }
    }

    //draw cubes
    function drawCubes(mv) {
        for (var i = zbottom; i < zbottom + 2000; i++)
        {
            mat4.identity(mv);
            Z[i] += mph;
            
            if (Math.sqrt((X[i] - xPos) * (X[i] - xPos) + (Z[i] - zPos) * (Z[i] - zPos)) <= .25 && zPos >= Z[i])
                pause = !pause;
            if(xPos < -29.5)
                xPos = -29.5;
            if(xPos > 29.5)
                xPos = 29.5;

            mat4.translate(mv, [X[i]-xPos, -.4, Z[i]]);
            mvPushMatrix();
            mat4.scale(mv,[.3,.3,.3]);
            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
        gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, crateTextures[filter]);
        gl.uniform1i(shaderProgram.samplerUniform, 0);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
            setMatrixUniforms();
            gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
        }
        zcount += mph;
        if(zcount % 1100 == 0)
        {
            zbottom += 1000;
            mph += .1;
        }
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
            drawPyramid(mvMatrix);
            drawCubes(mvMatrix);
        }
    }