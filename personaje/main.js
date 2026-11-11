import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const escena = new THREE.Scene();
escena.background = new THREE.Color(0x1a331e);

let camara = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camara.position.set(12, 8, 16);

const renderizador = new THREE.WebGLRenderer({ antialias: true });
renderizador.setSize(innerWidth, innerHeight);
document.body.appendChild(renderizador.domElement);

const controles = new OrbitControls(camara, renderizador.domElement);
controles.target.set(0, 1.5, 0);

// Iluminación
escena.add(new THREE.AmbientLight(0xd4f0d0, 0.9));
const luzSol = new THREE.DirectionalLight(0xfffae0, 1.8);
luzSol.position.set(10, 20, 10);
escena.add(luzSol);

// Prado
escena.add(new THREE.AxesHelper(5));
const pisoGeometria = new THREE.PlaneGeometry(60, 60);
const pisoMaterial = new THREE.MeshStandardMaterial({ color: 0x3a6e28, roughness: 0.8 });
const piso = new THREE.Mesh(pisoGeometria, pisoMaterial);
piso.rotation.x = -Math.PI / 2;
escena.add(piso);
escena.add(new THREE.GridHelper(60, 30, 0x4f8737, 0x2e541f));

// Decoración prado (Árboles y rocas)
const matTronco = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
const matHojas = new THREE.MeshStandardMaterial({ color: 0x24571d, roughness: 0.6 });
const matRocaAmbiente = new THREE.MeshStandardMaterial({ color: 0x666666, roughness: 0.9 });

function crearArbol(x, z) {
    const arbol = new THREE.Group();
    const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 2.5, 8), matTronco);
    tronco.position.y = 1.25;
    arbol.add(tronco);

    const copas = new THREE.Mesh(new THREE.ConeGeometry(1.8, 3.5, 8), matHojas);
    copas.position.y = 3.5;
    arbol.add(copas);

    arbol.position.set(x, 0, z);
    escena.add(arbol);
}

for (let i = 0; i < 20; i++) {
    const angulo = (i / 20) * Math.PI * 2;
    const radio = 14 + Math.random() * 8;
    crearArbol(Math.cos(angulo) * radio, Math.sin(angulo) * radio);
}

const geoRocaDeco = new THREE.DodecahedronGeometry(0.5, 0);
for (let i = 0; i < 12; i++) {
    const r = new THREE.Mesh(geoRocaDeco, matRocaAmbiente);
    r.position.set((Math.random() - 0.5) * 22, 0.3, (Math.random() - 0.5) * 22);
    r.rotation.set(Math.random(), Math.random(), Math.random());
    escena.add(r);
}

const datos = {};
const panel = document.getElementById('panel');
function vec(v) {
    return `(${v.x.toFixed(1)}, ${v.y.toFixed(1)}, ${v.z.toFixed(1)})`;
}

const animaciones = [];
const reloj = new THREE.Clock();

// Materiales del Cuche
const matRosado = new THREE.MeshStandardMaterial({ color: 0xffa0b4, roughness: 0.5 });
const matRosadoOscuro = new THREE.MeshStandardMaterial({ color: 0xe07a90 });
const matMejillas = new THREE.MeshStandardMaterial({ color: 0xff6688 });
const matNegro = new THREE.MeshStandardMaterial({ color: 0x050505 });
const matBlanco = new THREE.MeshStandardMaterial({ color: 0xffffff });
const matBocaFondo = new THREE.MeshBasicMaterial({ color: 0x660011 });
const matFuego = new THREE.MeshBasicMaterial({ color: 0xff4500 });
const matRayo = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 3 });
const matRoca = new THREE.MeshStandardMaterial({ color: 0x4a3b32, roughness: 0.9 });

// CONSTRUCCIÓN DEL CUCHE 
const cuche = new THREE.Group();
escena.add(cuche);

const cuerpoCuche = new THREE.Group();
cuche.add(cuerpoCuche);

function crearPieza(geometria, material, x, y, z, padre = cuerpoCuche) {
    const malla = new THREE.Mesh(geometria, material);
    malla.position.set(x, y, z);
    padre.add(malla);
    return malla;
}

// Cuerpo y Cabeza
const tronco = crearPieza(new THREE.SphereGeometry(1.3, 16, 16), matRosado, 0, 1.3, 0);
tronco.scale.set(1.1, 0.9, 1.4);

const cabeza = crearPieza(new THREE.SphereGeometry(0.9, 16, 16), matRosado, 0, 1.6, 1.3);

// --- OJITOS VISIBLES ---
// Pupila negra izquierda y derecha
crearPieza(new THREE.SphereGeometry(0.16, 16, 16), matNegro, -0.4, 1.9, 2.05);
crearPieza(new THREE.SphereGeometry(0.16, 16, 16), matNegro,  0.4, 1.9, 2.05);

// Brillo blanco del ojo izquierdo
crearPieza(new THREE.SphereGeometry(0.06, 12, 12), matBlanco, -0.35, 1.96, 2.18);
// Brillo blanco del ojo derecho
crearPieza(new THREE.SphereGeometry(0.06, 12, 12), matBlanco,  0.45, 1.96, 2.18);

// Cejas
const cejaIzq = crearPieza(new THREE.BoxGeometry(0.22, 0.05, 0.05), matRosadoOscuro, -0.4, 2.12, 2.0);
cejaIzq.rotation.z = -0.15;
const cejaDer = crearPieza(new THREE.BoxGeometry(0.22, 0.05, 0.05), matRosadoOscuro, 0.4, 2.12, 2.0);
cejaDer.rotation.z = 0.15;

// Hocico
const hocico = crearPieza(new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16), matRosadoOscuro, 0, 1.5, 2.1);
hocico.rotation.x = Math.PI / 2;
crearPieza(new THREE.SphereGeometry(0.07, 8, 8), matNegro, -0.12, 1.5, 2.23);
crearPieza(new THREE.SphereGeometry(0.07, 8, 8), matNegro,  0.12, 1.5, 2.23);

// Mejillas sonrosadas
crearPieza(new THREE.SphereGeometry(0.15, 12, 12), matMejillas, -0.65, 1.6, 1.9);
crearPieza(new THREE.SphereGeometry(0.15, 12, 12), matMejillas,  0.65, 1.6, 1.9);

// Sonrisa
const bocaBoca = crearPieza(new THREE.TorusGeometry(0.16, 0.04, 8, 16, Math.PI), matBocaFondo, 0, 1.3, 2.05);
bocaBoca.rotation.z = Math.PI;

// Orejas
const orejaGeo = new THREE.ConeGeometry(0.3, 0.6, 4);
const orejaIzq = crearPieza(orejaGeo, matRosadoOscuro, -0.6, 2.3, 1.4);
orejaIzq.rotation.set(-0.2, 0, -0.5);
const orejaDer = crearPieza(orejaGeo, matRosadoOscuro, 0.6, 2.3, 1.4);
orejaDer.rotation.set(-0.2, 0, 0.5);

// Patitas
const patasGeo = new THREE.CylinderGeometry(0.2, 0.18, 0.7, 12);
crearPieza(patasGeo, matRosado, -0.7, 0.35,  0.9);
crearPieza(patasGeo, matRosado,  0.7, 0.35,  0.9);
crearPieza(patasGeo, matRosado, -0.7, 0.35, -0.7);
crearPieza(patasGeo, matRosado,  0.7, 0.35, -0.7);

// Cola
const cola = crearPieza(new THREE.TorusGeometry(0.2, 0.06, 8, 16, Math.PI * 1.5), matRosadoOscuro, 0, 1.4, -1.4);
cola.rotation.y = Math.PI / 2;

// --- EFECTO FUEGO (Tecla B) ---
const numParticulasFuego = 40;
const fuegoGrupo = new THREE.Group();
cuche.add(fuegoGrupo);
fuegoGrupo.position.set(0, 1.5, 2.3);

const fuegoGeometria = new THREE.SphereGeometry(0.15, 8, 8);
const particulasFuego = [];

for (let i = 0; i < numParticulasFuego; i++) {
    const p = new THREE.Mesh(fuegoGeometria, matFuego);
    p.visible = false;
    p.userData = {
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        vz: 0.15 + Math.random() * 0.15,
        vida: 1
    };
    fuegoGrupo.add(p);
    particulasFuego.push(p);
}

let tiempoFuego = 0;

animaciones.push(() => {
    if (tiempoFuego > 0) {
        tiempoFuego -= 0.016;
        particulasFuego.forEach((p) => {
            p.visible = true;
            p.position.x += p.userData.vx;
            p.position.y += p.userData.vy;
            p.position.z += p.userData.vz;
            p.userData.vida += 0.04;

            const s = Math.max(0, 1.2 - p.userData.vida);
            p.scale.set(s, s, s);

            if (p.userData.vida >= 1.2) {
                p.position.set(0, 0, 0);
                p.userData.vida = 0;
            }
        });
    } else {
        particulasFuego.forEach((p) => (p.visible = false));
    }
});

// EFECTO RAYOS
const rayoGeo = new THREE.BufferGeometry();
const rayoLinea = new THREE.Line(rayoGeo, matRayo);
rayoLinea.visible = false;
escena.add(rayoLinea);

let tiempoRayo = 0;

animaciones.push(() => {
    if (tiempoRayo > 0) {
        tiempoRayo -= 0.016;

        const origen = new THREE.Vector3();
        hocico.getWorldPosition(origen);

        const dirForward = new THREE.Vector3(0, 0, 8).applyQuaternion(cuche.quaternion);
        const destino = origen.clone().add(dirForward);

        const puntos = [origen];
        const pasos = 8;
        for (let i = 1; i < pasos; i++) {
            const pct = i / pasos;
            const p = origen.clone().lerp(destino, pct);
            p.x += (Math.random() - 0.5) * 0.9;
            p.y += (Math.random() - 0.5) * 0.9;
            p.z += (Math.random() - 0.5) * 0.9;
            puntos.push(p);
        }
        puntos.push(destino);

        rayoGeo.setFromPoints(puntos);
        rayoLinea.visible = true;
    } else {
        rayoLinea.visible = false;
    }
});

// PIEDRAS GIGANTES
const piedrasLanzadas = [];
const geoPiedraLanzada = new THREE.DodecahedronGeometry(1.3, 0);

function lanzarPiedraGigante() {
    const piedra = new THREE.Mesh(geoPiedraLanzada, matRoca);
    const posInicial = new THREE.Vector3();
    cuche.getWorldPosition(posInicial);
    piedra.position.copy(posInicial);
    piedra.position.y += 1.0;

    const dirForward = new THREE.Vector3(0, 0, 1).applyQuaternion(cuche.quaternion);

    piedra.userData = {
        vx: dirForward.x * 0.4,
        vy: 0.18 + Math.random() * 0.05,
        vz: dirForward.z * 0.4,
        vida: 0
    };

    escena.add(piedra);
    piedrasLanzadas.push(piedra);
}

animaciones.push(() => {
    for (let i = piedrasLanzadas.length - 1; i >= 0; i--) {
        const p = piedrasLanzadas[i];
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz;
        p.userData.vy -= 0.007;
        p.rotation.x += 0.08;

        p.userData.vida += 0.016;
        if (p.position.y <= 0.65 || p.userData.vida > 3.5) {
            escena.remove(p);
            piedrasLanzadas.splice(i, 1);
        }
    }
});

//  TECLADO Y EVENTOS 
let inicioBrinco = -10;
let gelatina = false;

addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (e.key === 'ArrowRight') cuche.position.x += 0.5;
    if (e.key === 'ArrowLeft') cuche.position.x -= 0.5;
    if (e.key === 'ArrowUp') cuche.position.z -= 0.5;
    if (e.key === 'ArrowDown') cuche.position.z += 0.5;
    if (e.key === ' ') inicioBrinco = reloj.getElapsedTime();
    if (e.key === '+') cuche.scale.multiplyScalar(1.1);
    if (e.key === '-') cuche.scale.multiplyScalar(0.9);
    if (key === 'q') cuche.rotation.y += Math.PI / 8;
    if (key === 'e') cuche.rotation.y -= Math.PI / 8;
    if (key === 'g') gelatina = !gelatina;

    if (key === 'b') tiempoFuego = 0.8;
    if (key === 'm') lanzarPiedraGigante();
    if (key === 'n') tiempoRayo = 0.6;
});

// Animaciones de salto y sesgado
animaciones.push((t) => {
    const s = t - inicioBrinco; 
    cuche.position.y = s < 0.6 ? Math.sin((s / 0.6) * Math.PI) * 1.5 : 0;
    datos['Traslación'] = vec(cuche.position);
    datos['Escala'] = vec(cuche.scale);
    const grados = THREE.MathUtils.radToDeg(cuche.rotation.y);
    datos['Rotación Y'] = `${grados.toFixed(1)}°`;
});

cuerpoCuche.matrixAutoUpdate = false; 
animaciones.push((t) => {
    const k = gelatina ? 0.3 * Math.sin(t * 5) : 0;
    cuerpoCuche.matrix.set(
        1, k, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );
    cuerpoCuche.matrixWorldNeedsUpdate = true;
    datos['Sesgado k'] = k.toFixed(2);
});

// Render loop
renderizador.setAnimationLoop(() => {
    const t = reloj.getElapsedTime();
    animaciones.forEach((animar) => animar(t));
    
    const lineas = Object.entries(datos).map(([k, v]) => `${k}: ${v}`);
    if (panel) panel.textContent = lineas.join('\n');
    
    controles.update();
    renderizador.render(escena, camara);
});

addEventListener('resize', () => {
    camara.aspect = innerWidth / innerHeight;
    camara.updateProjectionMatrix();
    renderizador.setSize(innerWidth, innerHeight);
});