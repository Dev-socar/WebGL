// Obtener el contexto WebGL
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

// Función para crear la matriz de traslación
function createTranslationMatrix(tx, ty) {
  return [1, 0, 0, 0, 1, 0, tx, ty, 1];
}

// Variables para la animación
let translationX = -0.5;
let translationY = 0.0;

// Función de animación
function animate() {
  // Actualizar la posición
  translationX += 0.01;

  // Crear la matriz de traslación
  const translationMatrix = createTranslationMatrix(translationX, translationY);

  // Establecer la matriz de transformación
  setTransformMatrix(translationMatrix);

  // Dibujar el cuadrado
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  // Solicitar el siguiente cuadro de animación
  requestAnimationFrame(animate);
}

// Limpiar el canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Iniciar la animación
animate();
