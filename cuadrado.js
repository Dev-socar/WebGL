window.onload = function () {
  const canvas = document.getElementById("canvas"); //obtengo el canva con su id
  const gl = canvas.getContext("webgl"); //obtenemos el contexto de renderizado WebGL para renderizar gráficos

  if (!gl) {
    //Verificamos que el navegador soporte WebGL
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
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // color del cuadrado en este caso es rojo
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
      gl.deconsteShader(shader);
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

  // definimos la posicion de los vertices del cuadrado
  const vertices = [-0.3, 0.3, -0.3, -0.3, 0.3, 0.3, 0.3, -0.3];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //Obtenemos la ubicación del atributo de posición en el shader de vértices
  const positionAttributeLocation = gl.getAttribLocation(
    shaderProgram,
    "aPosition"
  );
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.clearColor(9 / 255, 34 / 255, 172 / 255, 1.0); // Le ponemos un color azul al bg del canva
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};
