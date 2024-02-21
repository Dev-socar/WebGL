window.onload = function () {
  // Se ejecuta cuando la ventana y todos sus elementos se han cargado completamente

  var canvas = document.getElementById("canvas-3d");
  // Obtiene el elemento canvas con el ID "canvas-3d" del documento HTML

  var gl = canvas.getContext("webgl");
  // Obtiene el contexto WebGL del canvas

  if (!gl) {
    // Si no se pudo obtener el contexto WebGL
    console.error(
      "Unable to initialize WebGL. Your browser may not support it."
    ); // Muestra un mensaje de error en la consola
    return; // Termina la ejecución de la función
  }

  var vertices = [];
  var colors = [];
  // Arrays para almacenar vértices y colores

  var latitudeBands = 30;
  var longitudeBands = 30;
  var radius = 1.0;
  // Parámetros para definir la esfera

  for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
    var theta = (latNumber * Math.PI) / latitudeBands;
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
      var phi = (longNumber * 2 * Math.PI) / longitudeBands;
      var sinPhi = Math.sin(phi);
      var cosPhi = Math.cos(phi);

      var x = cosPhi * sinTheta;
      var y = cosTheta;
      var z = sinPhi * sinTheta;

      vertices.push(radius * x, radius * y, radius * z);
      // Añade las coordenadas del vértice al array de vértices
      colors.push(1.0, 1.0, 1.0); // Color blanco para cada vértice
    }
  }

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  // Crea y llena un buffer con los datos de los vértices

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  // Crea y llena un buffer con los datos de los colores

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
  // Código fuente del shader de vértices

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  // Compilación del shader de vértices

  var fragmentShaderSource = `
            precision mediump float;
            varying vec3 vColor;
            void main() {
                vec3 overlayColor = vec3(1.0, 1.0, 1.0); // Color blanco de la capa
                gl_FragColor = vec4(vColor * overlayColor, 1.0);
            }
        `;
  // Código fuente del shader de fragmentos

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  // Compilación del shader de fragmentos

  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
  // Creación y configuración del programa de shaders

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
  // Configuración de los atributos de posición y color

  var modelViewMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "modelViewMatrix"
  );
  var projectionMatrixLocation = gl.getUniformLocation(
    shaderProgram,
    "projectionMatrix"
  );
  // Obtención de las ubicaciones de las matrices de modelo-vista y proyección

  var projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    Math.PI / 4,
    canvas.width / canvas.height,
    0.1,
    100.0
  );
  gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
  // Definición de la matriz de proyección y envío al shader

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
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length / 3);
    // Limpia el buffer de color y dibuja la esfera
    requestAnimationFrame(render);
    // Solicita que se ejecute la función render en el próximo ciclo de renderizado
  }

  render();
  // Inicia la animación
};
