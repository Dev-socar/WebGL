const canvas = document.getElementById("canvas-2d");
const gl = canvas.getContext("webgl");

// Definir los shaders
const vertexShaderSource = `
            attribute vec2 a_position;
            uniform mat3 u_matrix;
            void main() {
                gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
            }
        `;
const fragmentShaderSource = `
            precision mediump float;
            void main() {
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            }
        `;

// Compilar shaders
function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(
  gl,
  fragmentShaderSource,
  gl.FRAGMENT_SHADER
);

// Crear el programa WebGL
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Crear el búfer de posición
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// Obtener la posición de atributo
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Obtener la ubicación de la matriz uniforme
const matrixUniformLocation = gl.getUniformLocation(program, "u_matrix");

// Función para establecer la matriz de transformación
function setTransformMatrix(matrix) {
  gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);
}

// Función para crear la matriz de escalamiento
function createScaleMatrix(scaleX, scaleY) {
  return [scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1];
}

// Función para dibujar
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Calcular el factor de escalamiento
  const scaleFactor = Math.sin(performance.now() / 1000) * 0.5 + 1; // Oscilación entre 0.5 y 1.5

  // Crear la matriz de escalamiento
  const scaleMatrix = createScaleMatrix(scaleFactor, scaleFactor);

  // Establecer la matriz de transformación
  setTransformMatrix(scaleMatrix);

  // Dibujar el cuadrado
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  // Solicitar un nuevo cuadro de animación
  requestAnimationFrame(draw);
}

// Limpiar el canvas
gl.clearColor(76 / 255, 37 / 255, 124 / 255, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Dibujar
draw();
