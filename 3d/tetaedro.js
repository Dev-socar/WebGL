window.onload = function () {
  var canvas = document.getElementById("canvas-3d");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.error(
      "Unable to initialize WebGL. Your browser may not support it."
    );
    return;
  }

  var vertices = [
    // Cara 1 (azul)
    0.0,
    1.0,
    0.0, // Top vertex
    -1.0,
    -1.0,
    1.0, // Front-left vertex
    1.0,
    -1.0,
    1.0, // Front-right vertex

    // Cara 2 (amarilla)
    0.0,
    1.0,
    0.0, // Top vertex
    1.0,
    -1.0,
    1.0, // Front-right vertex
    0.0,
    -1.0,
    -1.0, // Back vertex

    // Cara 3 (roja)
    0.0,
    1.0,
    0.0, // Top vertex
    0.0,
    -1.0,
    -1.0, // Back vertex
    -1.0,
    -1.0,
    1.0, // Front-left vertex

    // Cara 4 (negra)
    -1.0,
    -1.0,
    1.0, // Front-left vertex
    1.0,
    -1.0,
    1.0, // Front-right vertex
    0.0,
    -1.0,
    -1.0, // Back vertex
  ];

  var colors = [
    // Cara 1 (azul)
    0.0,
    0.0,
    1.0, // Top vertex
    0.0,
    0.0,
    1.0, // Front-left vertex
    0.0,
    0.0,
    1.0, // Front-right vertex

    // Cara 2 (amarilla)
    1.0,
    1.0,
    0.0, // Top vertex
    1.0,
    1.0,
    0.0, // Front-right vertex
    1.0,
    1.0,
    0.0, // Back vertex

    // Cara 3 (roja)
    1.0,
    0.0,
    0.0, // Top vertex
    1.0,
    0.0,
    0.0, // Back vertex
    1.0,
    0.0,
    0.0, // Front-left vertex

    // Cara 4 (negra)
    0.0,
    0.0,
    0.0, // Front-left vertex
    0.0,
    0.0,
    0.0, // Front-right vertex
    0.0,
    0.0,
    0.0, // Back vertex
  ];

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  var vertexShaderSource = `
            attribute vec3 position;
            attribute vec3 color;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            varying vec3 vColor;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vColor = color;
            }
        `;
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  var fragmentShaderSource = `
            precision mediump float;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  var positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "position"
  );
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "color");
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

  var modelViewMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "modelViewMatrix"
  );
  var projectionMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "projectionMatrix"
  );

  var projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    Math.PI / 4,
    canvas.width / canvas.height,
    0.1,
    100.0
  );
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);

  var modelViewMatrix = mat4.create();

  var angle = 0;

  function render() {
    angle += 0.01; // Incremento de ángulo para la rotación automática

    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
    mat4.rotateY(modelViewMatrix, modelViewMatrix, angle); // Rotación sobre el eje Y

    gl.uniformMatrix4fv(modelViewMatrixLocation, false, modelViewMatrix);
    gl.clearColor(76 / 255, 37 / 255, 124 / 255, 1.0); // Establece el color de fondo del lienzo (morado)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    requestAnimationFrame(render);
  }

  render();
};
