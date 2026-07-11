import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6bb4cf);
scene.fog = new THREE.FogExp2(0x8ac5d5, 0.0065);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 700);

scene.add(new THREE.HemisphereLight(0xcaf5ff, 0x315448, 2.1));
const sun = new THREE.DirectionalLight(0xfff3d4, 3.2);
sun.position.set(-80, 100, -50); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = sun.shadow.camera.bottom = -100; sun.shadow.camera.right = sun.shadow.camera.top = 100;
scene.add(sun);
const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(7, 24, 12), new THREE.MeshBasicMaterial({ color: 0xffe5a8 }));
sunDisc.position.set(-110, 60, -180); scene.add(sunDisc);

const waterGeo = new THREE.PlaneGeometry(700, 700, 100, 100);
waterGeo.rotateX(-Math.PI / 2);
const basePositions = Float32Array.from(waterGeo.attributes.position.array);
const water = new THREE.Mesh(waterGeo, new THREE.MeshStandardMaterial({ color:0x147895, roughness:.28, metalness:.12, transparent:true, opacity:.96, flatShading:true }));
water.receiveShadow = true; scene.add(water);

const boat = new THREE.Group();
const hullShape = new THREE.Shape();
hullShape.moveTo(-1.55,-3.5); hullShape.lineTo(1.55,-3.5); hullShape.lineTo(1.2,2.0); hullShape.lineTo(0,4.1); hullShape.lineTo(-1.2,2.0); hullShape.closePath();
const hullGeo = new THREE.ExtrudeGeometry(hullShape,{depth:1.15,bevelEnabled:true,bevelSize:.22,bevelThickness:.28,bevelSegments:2});
hullGeo.rotateX(Math.PI/2); hullGeo.translate(0,.35,0);
const hull = new THREE.Mesh(hullGeo,new THREE.MeshStandardMaterial({color:0xe8eceb,roughness:.32})); hull.castShadow=true; boat.add(hull);
const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(2.7,.65,5.5),new THREE.MeshStandardMaterial({color:0x102f3d,roughness:.45})); lowerHull.position.set(0,-.05,.1); lowerHull.castShadow=true; boat.add(lowerHull);
const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.05,1.05,2.0),new THREE.MeshStandardMaterial({color:0xeef4ec,roughness:.4})); cabin.position.set(0,1,-.4); cabin.castShadow=true; boat.add(cabin);
const glass = new THREE.Mesh(new THREE.BoxGeometry(2.12,.58,.1),new THREE.MeshStandardMaterial({color:0x123b50,metalness:.3,roughness:.15})); glass.position.set(0,1.22,.65); boat.add(glass);
const mast = new THREE.Mesh(new THREE.CylinderGeometry(.055,.07,3.1,8),new THREE.MeshStandardMaterial({color:0x263f46})); mast.position.set(0,2.45,-.45); boat.add(mast);
const flag = new THREE.Mesh(new THREE.PlaneGeometry(.75,.42),new THREE.MeshBasicMaterial({color:0xff6b45,side:THREE.DoubleSide})); flag.position.set(.38,3.6,-.45); flag.rotation.y=Math.PI/2; boat.add(flag);
boat.scale.set(.82,.82,.82); boat.position.set(0,.65,15); scene.add(boat);

const wakeMat = new THREE.MeshBasicMaterial({color:0xdafaff,transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false});
const wakes=[]; for(let i=0;i<12;i++){const w=new THREE.Mesh(new THREE.RingGeometry(.8+i*.2,1+i*.25,18,1,0,Math.PI),wakeMat.clone());w.rotation.x=-Math.PI/2;w.rotation.z=Math.PI;w.position.y=.12;w.visible=false;scene.add(w);wakes.push(w)}

const checkpoints = [[0,-20],[18,-58],[5,-96],[-30,-125],[-52,-165],[-22,-205],[20,-235],[0,-278]];
const rings=[];
checkpoints.forEach(([x,z],i)=>{const group=new THREE.Group(); const ring=new THREE.Mesh(new THREE.TorusGeometry(5.3,.28,10,42),new THREE.MeshStandardMaterial({color:i?0xffb75e:0x72efff,emissive:i?0x6b2900:0x087d90,emissiveIntensity:1.4})); ring.position.y=4.6; group.add(ring); for(const side of [-1,1]){const pole=new THREE.Mesh(new THREE.CylinderGeometry(.11,.18,4.5,8),new THREE.MeshStandardMaterial({color:0xeae2cc}));pole.position.set(side*5.3,2.25,0);group.add(pole)} group.position.set(x,0,z);scene.add(group);rings.push(group)});

const obstacles=[];
function island(x,z,s=1){const g=new THREE.Group();const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(5*s,1),new THREE.MeshStandardMaterial({color:0x6f7767,roughness:1,flatShading:true}));rock.scale.y=.55;rock.position.y=1;rock.castShadow=true;g.add(rock); const green=new THREE.Mesh(new THREE.DodecahedronGeometry(4.2*s,1),new THREE.MeshStandardMaterial({color:0x3f7654,roughness:1,flatShading:true}));green.scale.y=.25;green.position.y=2.8*s;g.add(green);g.position.set(x,0,z);scene.add(g);obstacles.push({x,z,r:4.5*s});}
[[-19,-39,1], [34,-84,1.25],[-18,-105,.7],[-52,-104,1.2],[-70,-150,1.35],[-18,-161,.7],[8,-180,1],[-48,-222,1.25],[42,-216,1.5],[-5,-254,.65],[28,-270,.8]].forEach(v=>island(...v));
function buoy(x,z){const g=new THREE.Group();const body=new THREE.Mesh(new THREE.CylinderGeometry(.4,.65,1.5,10),new THREE.MeshStandardMaterial({color:0xff5e3f}));body.position.y=.7;g.add(body);const ball=new THREE.Mesh(new THREE.SphereGeometry(.35,10,8),new THREE.MeshStandardMaterial({color:0xffcf64,emissive:0x643000,emissiveIntensity:.6}));ball.position.y=1.75;g.add(ball);g.position.set(x,0,z);scene.add(g);obstacles.push({x,z,r:1.2});}
[[10,-40],[-7,-72],[18,-115],[-39,-145],[-30,-188],[5,-220],[-14,-265]].forEach(v=>buoy(...v));

const cloudMat=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,transparent:true,opacity:.62});
for(let i=0;i<18;i++){const g=new THREE.Group();for(let j=0;j<4;j++){const c=new THREE.Mesh(new THREE.SphereGeometry(3+Math.random()*3,8,6),cloudMat);c.position.set(j*4+Math.random()*2,Math.random()*2,Math.random()*2);g.add(c)}g.position.set((Math.random()-.5)*320,35+Math.random()*25,-60-Math.random()*280);scene.add(g)}

const keys={up:false,down:false,left:false,right:false}; let velocity=0, heading=0, current=0, health=100, elapsed=0, playing=false, invulnerable=0;
const ui={start:document.querySelector('#start-screen'),finish:document.querySelector('#finish-screen'),hud:document.querySelector('#hud'),touch:document.querySelector('#touch-controls'),speedometer:document.querySelector('#speedometer'),timer:document.querySelector('#timer'),checkpoint:document.querySelector('#checkpoint'),health:document.querySelector('#health-bar'),speed:document.querySelector('#speed'),message:document.querySelector('#message')};
function formatTime(t){const m=Math.floor(t/60),s=Math.floor(t%60),cs=Math.floor((t%1)*100);return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(cs).padStart(2,'0')}`}
function message(text){ui.message.textContent=text;ui.message.classList.remove('pop');void ui.message.offsetWidth;ui.message.classList.add('pop')}
function reset(){boat.position.set(0,.65,15);boat.rotation.set(0,0,0);velocity=heading=current=elapsed=0;health=100;invulnerable=0;rings.forEach((r,i)=>{r.visible=true;r.children[0].material.color.setHex(i?0xffb75e:0x72efff)});ui.checkpoint.textContent='0';ui.health.style.width='100%';ui.timer.textContent='00:00.00';}
function start(){reset();playing=true;ui.start.classList.remove('show');ui.finish.classList.remove('show');[ui.hud,ui.speedometer,ui.touch].forEach(x=>x.classList.remove('hidden'));message('GO!')}
function finish(){playing=false;velocity=0;[ui.hud,ui.speedometer,ui.touch].forEach(x=>x.classList.add('hidden'));const best=Number(localStorage.getItem('azure-run-best')||Infinity),isBest=elapsed<best;if(isBest)localStorage.setItem('azure-run-best',elapsed);document.querySelector('#final-time').textContent=formatTime(elapsed);document.querySelector('#record-text').textContent=isBest?'新的最佳纪录':`最佳纪录 ${formatTime(best)}`;ui.finish.classList.add('show')}
document.querySelector('#start-btn').onclick=start;document.querySelector('#restart-btn').onclick=start;
const keyMap={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown',e=>{if(keyMap[e.code]){keys[keyMap[e.code]]=true;e.preventDefault()}});addEventListener('keyup',e=>{if(keyMap[e.code])keys[keyMap[e.code]]=false});
document.querySelectorAll('[data-key]').forEach(btn=>{const k=btn.dataset.key==='brake'?'down':btn.dataset.key;const set=v=>{keys[k]=v;btn.classList.toggle('active',v)};btn.addEventListener('pointerdown',e=>{e.preventDefault();set(true)});['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,()=>set(false)))});

const clock=new THREE.Clock(),camTarget=new THREE.Vector3();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime,pos=water.geometry.attributes.position;
for(let i=0;i<pos.count;i++){const x=basePositions[i*3],z=basePositions[i*3+2];pos.setY(i,Math.sin(x*.075+t*1.25)*.32+Math.sin(z*.11+t*.85)*.25)}pos.needsUpdate=true;water.position.x=boat.position.x;water.position.z=boat.position.z-80;
rings.forEach((r,i)=>{r.children[0].rotation.z=t*.35;r.position.y=Math.sin(t*1.3+i)*.18});
if(playing){elapsed+=dt;invulnerable=Math.max(0,invulnerable-dt);const throttle=keys.up?1:keys.down?-.65:0;velocity+=throttle*11*dt;velocity-=velocity*(keys.up?.32:.72)*dt;velocity=THREE.MathUtils.clamp(velocity,-4.5,18);const steer=(keys.left?1:0)-(keys.right?1:0);heading+=steer*dt*(1.35*Math.min(Math.abs(velocity)/5,1)+.25)*(velocity>=0?1:-1);boat.position.x-=Math.sin(heading)*velocity*dt;boat.position.z-=Math.cos(heading)*velocity*dt;boat.rotation.y=heading;boat.rotation.z=THREE.MathUtils.lerp(boat.rotation.z,steer*.18,.08);boat.rotation.x=Math.sin(t*2.4)*.025-velocity*.002;boat.position.y=.72+Math.sin(t*2.2)*.09;
const cp=rings[current];if(cp&&boat.position.distanceTo(cp.position)<7){cp.visible=false;current++;ui.checkpoint.textContent=current;message(current===rings.length?'FINISH!':`CHECKPOINT ${current}`);if(current===rings.length)setTimeout(finish,700);else rings[current].children[0].material.color.setHex(0x72efff)}
for(const o of obstacles){const dx=boat.position.x-o.x,dz=boat.position.z-o.z;if(dx*dx+dz*dz<(o.r+1.4)**2&&invulnerable<=0){health-=25;invulnerable=1.1;velocity*=-.3;boat.position.x+=dx*.3;boat.position.z+=dz*.3;ui.health.style.width=`${health}%`;message('HULL DAMAGED');if(health<=0){health=100;ui.health.style.width='100%';boat.position.set(current?checkpoints[Math.max(0,current-1)][0]:0,.7,current?checkpoints[Math.max(0,current-1)][1]+9:15);velocity=0;message('RESCUED')}}}
ui.timer.textContent=formatTime(elapsed);ui.speed.textContent=Math.round(Math.abs(velocity)*2.25);
for(let i=0;i<wakes.length;i++){const w=wakes[i];w.visible=velocity>2;const delay=i*.65;w.position.set(boat.position.x+Math.sin(heading)*delay, .15, boat.position.z+Math.cos(heading)*delay);w.rotation.z=-heading+Math.PI;w.material.opacity=Math.max(0,.5-i*.035)*(velocity/18);}
}
camTarget.set(boat.position.x+Math.sin(heading)*10,7.2,boat.position.z+Math.cos(heading)*12);camera.position.lerp(camTarget,1-Math.pow(.001,dt));const look=new THREE.Vector3(boat.position.x-Math.sin(heading)*5,1.2,boat.position.z-Math.cos(heading)*9);camera.lookAt(look);renderer.render(scene,camera)}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
