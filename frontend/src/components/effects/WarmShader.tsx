"use client";

import React, { useRef, useEffect, useCallback } from "react";

// GLSL Vertex Shader
const vertexShader = `
  precision mediump float;
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// GLSL Fragment Shader — Warm Liquid Intelligence
const fragmentShader = `
  precision mediump float;
  
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  
  // Ultra-reliable 2D value noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + vec2(10.0);
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = uv * vec2(aspect, 1.0);
    
    float t = u_time * 0.06;
    
    // Soft mouse influence
    vec2 mouseNorm = u_mouse / u_resolution;
    float mouseDist = length(uv - mouseNorm);
    float mouseInfluence = smoothstep(0.5, 0.0, mouseDist) * 0.12;
    
    // Multi-octave organic flow
    float n1 = fbm(p * 1.4 + vec2(t * 0.25, t * 0.15));
    float n2 = fbm(p * 0.9 - vec2(t * 0.12, t * 0.2) + vec2(n1 * 0.35));
    float n3 = fbm(p * 2.2 + vec2(n2 * 0.3, t * 0.08));
    
    float distortion = n1 * 0.5 + n2 * 0.3 + n3 * 0.2 + mouseInfluence;
    
    // Warm refined palette: Cream, Amber, and subtle Terracotta
    vec3 warmOrange = vec3(0.988, 0.424, 0.149);  // #FC6C26
    vec3 deepOrange = vec3(0.851, 0.322, 0.094);  // #D95218
    vec3 warmCream  = vec3(1.0, 0.965, 0.890);    // #FFF6E3
    vec3 softAmber  = vec3(1.0, 0.929, 0.780);    // #FFEDC7
    vec3 lightCream = vec3(1.0, 0.988, 0.957);    // #FFFBF4
    
    // Radial light focused around top/left
    float radial = length(uv - vec2(0.25, 0.6));
    float radialGlow = smoothstep(1.1, 0.0, radial);
    
    // Smooth mixing
    vec3 baseColor = mix(warmCream, lightCream, uv.y * 0.7 + distortion * 0.15);
    vec3 accentColor = mix(warmOrange, deepOrange, n2 * 0.6 + 0.4);
    
    // Luminous warmth bands
    float band = smoothstep(0.18, 0.38, distortion) * smoothstep(0.58, 0.38, distortion);
    vec3 color = mix(baseColor, accentColor, band * 0.15 * radialGlow);
    
    // Soft amber highlights
    float glow = smoothstep(0.35, 0.0, abs(n2 - 0.15)) * 0.1;
    color = mix(color, softAmber, glow);
    
    // Warm radial presence
    color += warmOrange * radialGlow * 0.035;
    
    // Subtle architectural grid
    vec2 gridUV = fract(p * 18.0);
    float gridLine = smoothstep(0.02, 0.0, min(gridUV.x, gridUV.y));
    color = mix(color, color * 0.94, gridLine * 0.05);
    
    // Vignette
    float vignette = smoothstep(1.5, 0.4, length((uv - 0.5) * 1.5));
    color *= 0.94 + 0.06 * vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface WarmShaderProps {
  className?: string;
  intensity?: number;
  interactive?: boolean;
}

export const WarmShader: React.FC<WarmShaderProps> = ({
  className = "",
  intensity = 1.0,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isVisibleRef = useRef<boolean>(true);
  const startTimeRef = useRef<number>(Date.now());

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });

    if (!gl) return;
    glRef.current = gl;

    // Compile vertex shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vertexShader);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.debug("VS compilation status:", gl.getShaderInfoLog(vs));
      return;
    }

    // Compile fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fragmentShader);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.debug("FS compilation status:", gl.getShaderInfoLog(fs));
      return;
    }

    // Link program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.debug("Program link status:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Full-screen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    // Reduce resolution for performance (0.35x native)
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const scale = 0.35 * intensity;
    const w = Math.floor(canvas.clientWidth * dpr * scale);
    const h = Math.floor(canvas.clientHeight * dpr * scale);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  }, [intensity]);

  const render = useCallback(() => {
    if (!isVisibleRef.current) {
      animFrameRef.current = requestAnimationFrame(render);
      return;
    }

    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;

    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");

    gl.uniform1f(timeLoc, elapsed);
    gl.uniform2f(resLoc, canvas.width, canvas.height);
    gl.uniform2f(mouseLoc, mouseRef.current.x * 0.35, mouseRef.current.y * 0.35);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animFrameRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    initGL();
    resize();

    animFrameRef.current = requestAnimationFrame(render);

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize, { passive: true });

    // Pause when tab hidden
    const handleVisibility = () => {
      isVisibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);

      // Cleanup WebGL context
      const gl = glRef.current;
      if (gl) {
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
      }
      glRef.current = null;
      programRef.current = null;
    };
  }, [initGL, resize, render]);

  useEffect(() => {
    if (!interactive) return;

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: window.innerHeight - e.clientY };
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ imageRendering: "auto" }}
      aria-hidden="true"
    />
  );
};
