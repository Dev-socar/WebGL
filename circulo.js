window.onload = function () {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    console.error("No soporta WebGL.");
    return;
  }

  const vsSource = `
    attribute vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // color del círculo en este caso es rojo
    }
  `;

  function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(
        "An error occurred compiling the shaders: " +
          gl.getShaderInfoLog(shader)
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  gl.useProgram(shaderProgram);

  // Define los vértices para aproximar el círculo
  const numSegments = 100; // Número de segmentos para aproximar el círculo
  const vertices = [];
  for (let i = 0; i < numSegments; i++) {
    const theta = (2 * Math.PI * i) / numSegments;
    const x = Math.cos(theta);
    const y = Math.sin(theta);
    vertices.push(x, y);
  }

  // Crea y llena el búfer de datos con los vértices del círculo
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Configura los atributos de posición
  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "aPosition"
  );
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Limpia el lienzo y dibuja el círculo
  gl.clearColor(9 / 255, 34 / 255, 172 / 255, 1.0); // Le ponemos un color azul al bg del canva
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments); // Dibuja el círculo
};
