import * as THREE from "three";

/**
 * Hero particle engine.
 * Every particle knows three "home" positions: a budding yeast cell, a burst
 * cloud, and a DNA double helix. A vertex shader morphs between them using a
 * single `uMorph` uniform (0 = cell, 1 = cloud, 2 = helix) with per-particle
 * staggering, so GSAP can scrub the whole story from scroll position.
 */

export type HeroState = {
  /** 0 cell → 1 cloud → 2 helix */
  morph: number;
  /** 0 → 1 intro assembly (particles fly in from the cloud) */
  assemble: number;
  camZ: number;
  rotY: number;
  spin: number;
  fade: number;
  /** 0 → 1: raises the cell above the title block at rest */
  lift: number;
};

export const createHeroState = (): HeroState => ({ morph: 0, assemble: 0, camZ: 8, rotY: 0, spin: 0, fade: 1, lift: 1 });

/* ── Shaders ────────────────────────────────────────────────── */

// Ashima Arts 3D simplex noise (MIT)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uMorph;
uniform float uSize;
uniform float uPixelRatio;
uniform float uVertical;
uniform float uHelixScale;
uniform float uHelixSpin;
uniform float uHelixOffset;
uniform float uCellRotY;
uniform float uCellRotX;

attribute vec3 aCell;
attribute vec3 aCloud;
attribute vec4 aRand;
attribute vec3 aColCell;
attribute vec3 aColHelix;

varying vec3 vColor;
varying float vAlpha;

${NOISE}

mat2 rot(float a){ float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

void main() {
  float delay = aRand.x * 0.42;
  float t1 = smoothstep(delay, delay + 0.58, clamp(uMorph, 0.0, 1.0));
  float t2 = smoothstep(delay, delay + 0.58, clamp(uMorph - 1.0, 0.0, 1.0));

  // Cell: a breathing, slowly turning membrane.
  vec3 cell = aCell;
  float n = snoise(cell * 1.35 + vec3(0.0, uTime * 0.22, uTime * 0.1));
  cell += normalize(cell + 1e-4) * n * 0.055;
  cell.yz *= rot(uCellRotX);
  cell.xz *= rot(uCellRotY);

  // Cloud: drifting, orbiting debris.
  vec3 cloud = aCloud;
  cloud.xz *= rot(uTime * 0.04 * (0.4 + aRand.y));
  cloud += 0.16 * vec3(
    sin(uTime * 0.55 + aRand.z * 6.2831),
    cos(uTime * 0.45 + aRand.w * 6.2831),
    sin(uTime * 0.35 + aRand.y * 6.2831)
  );

  // Helix: spins on its own axis; stands upright on portrait screens.
  vec3 helix = position * uHelixScale;
  helix.yz *= rot(uHelixSpin + uTime * 0.22);
  if (uVertical > 0.5) helix = vec3(helix.y, helix.x, helix.z);
  else helix.x += uHelixOffset;

  vec3 p = mix(cell, cloud, t1);
  p = mix(p, helix, t2);

  // A little vortex while particles are in flight.
  float flight = sin(3.14159 * t1) * (1.0 - t2) + sin(3.14159 * t2);
  p.xz *= rot(flight * (aRand.y - 0.5) * 1.4);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.35 + aRand.y * 0.95) * (1.0 + 0.25 * t1 * (1.0 - t2));
  gl_PointSize = size * uPixelRatio / -mv.z;

  vec3 mid = mix(aColCell, aColHelix, 0.5);
  vColor = mix(mix(aColCell, mid, t1), aColHelix, t2);
  float twinkle = 0.78 + 0.22 * sin(uTime * 1.7 + aRand.z * 40.0);
  vAlpha = twinkle * mix(1.0, 0.8, t1 * (1.0 - t2));
}`;

const FRAGMENT = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float glow = pow(smoothstep(0.5, 0.0, d), 1.7);
  gl_FragColor = vec4(vColor, glow * vAlpha * uOpacity);
}`;

const DUST_VERTEX = /* glsl */ `
uniform float uTime; uniform float uPixelRatio;
attribute float aSeed;
varying float vA;
void main(){
  vec3 p = position;
  p.y += sin(uTime * 0.15 + aSeed * 30.0) * 0.25;
  p.x += cos(uTime * 0.1 + aSeed * 20.0) * 0.25;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (6.0 + aSeed * 10.0) * uPixelRatio / -mv.z;
  vA = 0.25 + 0.35 * aSeed;
}`;
const DUST_FRAGMENT = /* glsl */ `
uniform float uOpacity; varying float vA;
void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard;
  gl_FragColor = vec4(vec3(0.75, 0.85, 1.0), smoothstep(0.5, 0.0, d) * vA * uOpacity); }`;

/* ── Geometry ───────────────────────────────────────────────── */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const C = (hex: string) => new THREE.Color(hex);
const PALETTE = {
  teal: C("#5eead4"),
  sky: C("#38bdf8"),
  mint: C("#86efac"),
  violet: C("#a78bfa"),
  pink: C("#f472b6"),
  amber: C("#fcd34d"),
  dim: C("#7d8db3"),
};

function buildGeometry(count: number) {
  const rng = mulberry32(20261104);
  const gauss = () => {
    const u = 1 - rng();
    const v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const onSphere = () => {
    const v = new THREE.Vector3(gauss(), gauss(), gauss());
    return v.normalize();
  };

  const cell = new Float32Array(count * 3);
  const cloud = new Float32Array(count * 3);
  const helix = new Float32Array(count * 3);
  const rand = new Float32Array(count * 4);
  const colCell = new Float32Array(count * 3);
  const colHelix = new Float32Array(count * 3);

  // Mother cell + daughter bud (budding yeast).
  const mother = { c: new THREE.Vector3(0, 0, 0), r: new THREE.Vector3(1.05, 1.32, 1.05) };
  const bud = { c: new THREE.Vector3(0.78, 1.18, 0.12), r: new THREE.Vector3(0.52, 0.6, 0.52) };
  const inside = (p: THREE.Vector3, e: typeof mother, k = 1) => {
    const d = p.clone().sub(e.c).divide(e.r);
    return d.lengthSq() < k;
  };
  const shift = new THREE.Vector3(-0.22, -0.32, 0);
  const organelles = Array.from({ length: 7 }, () =>
    new THREE.Vector3((rng() - 0.5) * 1.3, (rng() - 0.5) * 1.6, (rng() - 0.5) * 1.3),
  );

  // Helix constants
  const L = 7.4;
  const R = 0.82;
  const turns = 3.1;
  const rungs = 34;
  const strandOffset = 2.3;

  const tmp = new THREE.Vector3();
  const col = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const r = rng();
    let p: THREE.Vector3;

    if (r < 0.54) {
      do {
        p = onSphere().multiply(mother.r).multiplyScalar(1 + (rng() - 0.5) * 0.05);
      } while (inside(p, bud, 0.96));
      col.copy(PALETTE.teal).lerp(PALETTE.sky, rng() * 0.8);
    } else if (r < 0.69) {
      do {
        p = onSphere().multiply(bud.r).multiplyScalar(1 + (rng() - 0.5) * 0.06).add(bud.c);
      } while (inside(p, mother, 0.97));
      col.copy(PALETTE.teal).lerp(PALETTE.mint, 0.3 + rng() * 0.5);
    } else if (r < 0.8) {
      // nucleus, denser towards its envelope
      p = onSphere().multiplyScalar(0.4 * Math.pow(rng(), 0.25)).add(tmp.set(-0.18, -0.22, 0.2));
      col.copy(PALETTE.violet).lerp(PALETTE.pink, rng() * 0.25);
    } else if (r < 0.86) {
      // vacuole
      p = onSphere().multiplyScalar(0.42 + (rng() - 0.5) * 0.04).add(tmp.set(0.28, 0.42, -0.22));
      col.copy(PALETTE.pink).lerp(PALETTE.violet, rng() * 0.3);
    } else if (r < 0.9) {
      const o = organelles[Math.floor(rng() * organelles.length)];
      p = new THREE.Vector3(gauss(), gauss() * 2.2, gauss()).multiplyScalar(0.05).add(o);
      col.copy(PALETTE.amber);
    } else {
      // cytoplasm specks
      p = onSphere().multiply(mother.r).multiplyScalar(0.92 * Math.cbrt(rng()));
      col.copy(PALETTE.dim);
    }
    p.add(shift);
    cell.set([p.x, p.y, p.z], i * 3);
    colCell.set([col.r, col.g, col.b], i * 3);

    // Cloud: burst outward along each particle's own direction.
    const dir = p.clone().add(new THREE.Vector3(gauss(), gauss(), gauss()).multiplyScalar(0.35)).normalize();
    const dist = 1.9 + Math.pow(rng(), 0.85) * 2.9;
    cloud.set([dir.x * dist * 1.25, dir.y * dist * 0.72, dir.z * dist - 0.5], i * 3);

    // Helix (canonical axis = x).
    const h = rng();
    const t = rng();
    const x = (t - 0.5) * L;
    const a = t * turns * Math.PI * 2;
    if (h < 0.78) {
      // backbone strands A (cyan) and B (violet)
      const strandB = h >= 0.39;
      const off = strandB ? strandOffset : 0;
      helix.set(
        [x + gauss() * 0.02, Math.cos(a + off) * R + gauss() * 0.05, Math.sin(a + off) * R + gauss() * 0.05],
        i * 3,
      );
      if (strandB) col.copy(PALETTE.violet).lerp(PALETTE.pink, rng() * 0.6);
      else col.copy(PALETTE.sky).lerp(PALETTE.teal, rng() * 0.6);
    } else {
      // base-pair rungs
      const k = Math.floor(rng() * rungs);
      const tr = (k + 0.5) / rungs;
      const xr = (tr - 0.5) * L;
      const ar = tr * turns * Math.PI * 2;
      const s = 0.12 + rng() * 0.76;
      const ya = Math.cos(ar) * R;
      const za = Math.sin(ar) * R;
      const yb = Math.cos(ar + strandOffset) * R;
      const zb = Math.sin(ar + strandOffset) * R;
      helix.set([xr + gauss() * 0.015, ya + (yb - ya) * s + gauss() * 0.012, za + (zb - za) * s + gauss() * 0.012], i * 3);
      col.copy(s < 0.5 ? PALETTE.amber : PALETTE.mint).lerp(new THREE.Color("#ffffff"), 0.25);
    }
    colHelix.set([col.r, col.g, col.b], i * 3);

    rand.set([rng(), rng(), rng(), rng()], i * 4);
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(helix, 3));
  g.setAttribute("aCell", new THREE.BufferAttribute(cell, 3));
  g.setAttribute("aCloud", new THREE.BufferAttribute(cloud, 3));
  g.setAttribute("aRand", new THREE.BufferAttribute(rand, 4));
  g.setAttribute("aColCell", new THREE.BufferAttribute(colCell, 3));
  g.setAttribute("aColHelix", new THREE.BufferAttribute(colHelix, 3));
  // Positions change in the shader, so give a generous static bound.
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
  return g;
}

function buildDust(count: number) {
  const rng = mulberry32(7);
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos.set([(rng() - 0.5) * 26, (rng() - 0.5) * 16, -2 - rng() * 14], i * 3);
    seed[i] = rng();
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  return g;
}

/* ── Scene ──────────────────────────────────────────────────── */

export class CellScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  private group = new THREE.Group();
  private material: THREE.ShaderMaterial;
  private dustMaterial: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private raf = 0;
  private visible = true;
  private fit = 1;
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  private resizeObserver: ResizeObserver;
  private intersection: IntersectionObserver;
  private disposed = false;

  constructor(
    private host: HTMLElement,
    private state: HeroState,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setClearColor(0x000000, 0);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
    host.appendChild(this.renderer.domElement);

    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    const count = small ? 8000 : 15000;

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 1 },
        uSize: { value: small ? 34 : 30 },
        uPixelRatio: { value: dpr },
        uVertical: { value: 0 },
        uHelixScale: { value: 1 },
        uHelixSpin: { value: 0 },
        uHelixOffset: { value: 0 },
        uCellRotY: { value: 0 },
        uCellRotX: { value: 0.2 },
        uOpacity: { value: 1 },
      },
    });
    this.group.add(new THREE.Points(buildGeometry(count), this.material));

    this.dustMaterial = new THREE.ShaderMaterial({
      vertexShader: DUST_VERTEX,
      fragmentShader: DUST_FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: dpr }, uOpacity: { value: 1 } },
    });
    this.scene.add(new THREE.Points(buildDust(small ? 500 : 1100), this.dustMaterial));
    this.scene.add(this.group);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.resize();

    this.intersection = new IntersectionObserver(([e]) => (this.visible = e.isIntersecting), { rootMargin: "100px" });
    this.intersection.observe(host);

    window.addEventListener("pointermove", this.onPointer, { passive: true });
    this.tick();
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  private resize() {
    const w = this.host.clientWidth || window.innerWidth;
    const h = this.host.clientHeight || window.innerHeight;
    const aspect = w / h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    // Keep the cell comfortably framed on tall phone screens.
    this.fit = Math.max(1, 0.78 / aspect);
    const vertical = aspect < 0.9;
    this.material.uniforms.uVertical.value = vertical ? 1 : 0;
    this.material.uniforms.uHelixScale.value = vertical ? 0.8 : Math.min(0.82, aspect / 1.6);
    this.material.uniforms.uHelixOffset.value = vertical ? 0 : Math.min(1.1, (aspect - 1) * 1.2);
  }

  private tick = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.tick);
    if (!this.visible) return;
    const t = this.clock.getElapsedTime();
    const s = this.state;
    const u = this.material.uniforms;

    u.uTime.value = t;
    u.uMorph.value = Math.max(s.morph, 1 - s.assemble);
    u.uCellRotY.value = s.rotY + t * 0.12;
    u.uCellRotX.value = 0.22 + Math.sin(t * 0.3) * 0.06;
    u.uHelixSpin.value = s.spin;
    u.uOpacity.value = s.fade;
    this.dustMaterial.uniforms.uTime.value = t;
    this.dustMaterial.uniforms.uOpacity.value = 0.5 + 0.5 * s.fade;

    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.04;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.04;
    this.group.position.y = s.lift * (this.fit > 1 ? 1.25 : 1.0);
    this.group.rotation.y = this.pointer.x * 0.12;
    this.group.rotation.x = this.pointer.y * 0.08;

    this.camera.position.set(this.pointer.x * 0.15, -this.pointer.y * 0.1, s.camZ * this.fit);
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("pointermove", this.onPointer);
    this.resizeObserver.disconnect();
    this.intersection.disconnect();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Points) {
        o.geometry.dispose();
        (o.material as THREE.Material).dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}

export function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}
