window.onload = function () {
  // Espera a que se cargue la ventana para ejecutar este código
  const canvas = document.getElementById("canvas"); // Obtiene el elemento canvas del documento HTML
  const gl = canvas.getContext("webgl"); // Obtiene el contexto de renderizado WebGL del canvas

  if (!gl) {
    // Verifica si el navegador soporta WebGL
    console.error("No soporta WebGL.");
    return; // Si no es soportado, se detiene la ejecución del código
  }

  const vsSource = ` // Define el código fuente del shader de vértices
    attribute vec2 aPosition; // Atributo que representa la posición de los vértices
    void main() { // Función principal del shader de vértices
        gl_Position = vec4(aPosition, 0.0, 1.0); // Establece la posición del vértice en el espacio homogéneo
    }
  `;

  const fsSource = ` // Define el código fuente del shader de fragmentos
    precision mediump float; // Establece la precisión de los cálculos en punto flotante
    void main() { // Función principal del shader de fragmentos
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Establece el color del fragmento (en este caso, rojo)
    }
  `;

  function compileShader(gl, source, type) {
    // Función para compilar un shader
    const shader = gl.createShader(type); // Crea un nuevo shader del tipo especificado
    gl.shaderSource(shader, source); // Establece el código fuente del shader
    gl.compileShader(shader); // Compila el shader

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      // Verifica si la compilación fue exitosa
      console.error(
        // Si hubo un error en la compilación, muestra un mensaje de error
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader); // Elimina el shader
      return null; // Retorna null para indicar que hubo un error
    }

    return shader; // Retorna el shader compilado
  }

  const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER); // Compila el shader de vértices
  const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER); // Compila el shader de fragmentos

  const shaderProgram = gl.createProgram(); // Crea un nuevo programa de shaders
  gl.attachShader(shaderProgram, vertexShader); // Adjunta el shader de vértices al programa
  gl.attachShader(shaderProgram, fragmentShader); // Adjunta el shader de fragmentos al programa
  gl.linkProgram(shaderProgram); // Enlaza los shaders al programa

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    // Verifica si la unión de shaders fue exitosa
    console.error(
      // Si hubo un error en la unión de shaders, muestra un mensaje de error
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null; // Retorna null para indicar que hubo un error
  }

  gl.useProgram(shaderProgram); // Usa el programa de shaders para renderizar

  // Define los vértices para aproximar el círculo
  const numSegments = 100; // Número de segmentos para aproximar el círculo, entre mayor es mejor el detalle
  const vertices = []; // Array para almacenar los vértices
  for (let i = 0; i < numSegments; i++) {
    // Itera sobre los segmentos del círculo
    const theta = (2 * Math.PI * i) / numSegments; // Calcula el ángulo correspondiente al segmento actual
    const x = Math.cos(theta); // Calcula la coordenada x del vértice actual
    const y = Math.sin(theta); // Calcula la coordenada y del vértice actual
    vertices.push(x, y); // Agrega las coordenadas del vértice al array de vértices
  }

  // Crea y llena el búfer de datos con los vértices del círculo
  const positionBuffer = gl.createBuffer(); // Crea un nuevo búfer de datos
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Establece el búfer como el búfer de posiciones
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); // Llena el búfer con los vértices del círculo

  // Configura los atributos de posición
  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "aPosition"
  ); // Obtiene la ubicación del atributo de posición en los shaders
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0); // Configura el atributo de posición para que lea datos del búfer
  gl.enableVertexAttribArray(positionAttributeLocation); // Habilita el atributo de posición para su uso en los shaders

  // Limpia el lienzo y dibuja el círculo
  gl.clearColor(9 / 255, 34 / 255, 172 / 255, 1.0); // Establece el color de fondo del lienzo (azul)
  gl.clear(gl.COLOR_BUFFER_BIT); // Limpia el lienzo con el color de fondo establecido
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments); // Dibuja el círculo utilizando el método de ventilador de triángulos
};
