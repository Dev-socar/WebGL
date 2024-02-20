window.onload = function () {
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");

  if (!gl) {
    console.error(
      "Unable to initialize WebGL. Your browser may not support it."
    );
    return;
  }

  var vertices = [
    // Cara frontal
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Cara trasera
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Cara superior
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Cara inferior
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Cara derecha
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Cara izquierda
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  var colors = [
    [1.0, 0.0, 0.0, 1.0], // Cara frontal
    [0.0, 1.0, 0.0, 1.0], // Cara trasera
    [0.0, 0.0, 1.0, 1.0], // Cara superior
    [1.0, 1.0, 0.0, 1.0], // Cara inferior
    [1.0, 0.0, 1.0, 1.0], // Cara derecha
    [0.0, 1.0, 1.0, 1.0], // Cara izquierda
  ];

  var indices = [
    0,
    1,
    2,
    0,
    2,
    3, // Cara frontal
    4,
    5,
    6,
    4,
    6,
    7, // Cara trasera
    8,
    9,
    10,
    8,
    10,
    11, // Cara superior
    12,
    13,
    14,
    12,
    14,
    15, // Cara inferior
    16,
    17,
    18,
    16,
    18,
    19, // Cara derecha
    20,
    21,
    22,
    20,
    22,
    23, // Cara izquierda
  ];

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  var flatColors = [];
  colors.forEach((color) => {
    for (var i = 0; i < 4; i++) {
      flatColors = flatColors.concat(color);
    }
  });
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatColors), gl.STATIC_DRAW);

  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  var vertexShaderSource = `
            attribute vec3 position;
            attribute vec4 color;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            varying vec4 vColor;
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
            varying vec4 vColor;
            void main() {
                gl_FragColor = vColor;
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
  gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);

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
    gl.clearColor(9 / 255, 34 / 255, 172 / 255, 1.0); // Establece el color de fondo del lienzo (azul)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
  }

  render();
};
