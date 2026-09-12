import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

// A reconstruction of the supplied photograph. Dimensions and the hidden side
// are inferred, not measured. All textures below are portable baked PBR maps.
const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, x) => { const t = clamp((x-a)/(b-a)); return t*t*(3-2*t); };
function random(seed=1294) { return () => { seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296; }; }
function canvas(w,h) { const c=document.createElement('canvas');c.width=w;c.height=h;return c; }
function texture(c,name,color=true) { const t=new THREE.CanvasTexture(c);t.name=name;t.colorSpace=color?THREE.SRGBColorSpace:THREE.NoColorSpace;t.anisotropy=8;t.wrapS=THREE.RepeatWrapping;return t; }
function lathe(points,segments=128,start=0,length=TAU) { return new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),segments,start,length); }
function add(group,name,geometry,material) { geometry.normalizeNormals();if(material.normalMap&&geometry.index&&geometry.attributes.uv)geometry.computeTangents();if(!material.map&&!material.normalMap)geometry.deleteAttribute('uv');const m=new THREE.Mesh(geometry,material);m.name=name;m.castShadow=false;m.receiveShadow=false;group.add(m);return m; }
function radius(y) { return .783 + .231*clamp((y-.09)/2.49); }

function makeDrinkMaps() {
  const w=1024,h=1024,c=canvas(w,h),ctx=c.getContext('2d'),im=ctx.createImageData(w,h),rng=random(977);
  // Milk occupies the lower third, then fades gradually through honey/caramel.
  // These albedo stops are guided by the unprinted, lit side of the reference.
  // Directional dark-to-light shading is supplied by actual studio lighting.
  const stops=[
    [0,[249,241,224]],[.16,[247,236,216]],[.29,[243,222,194]],
    [.42,[233,200,159]],[.55,[215,168,127]],[.70,[193,139,98]],
    [.84,[187,126,84]],[.96,[187,119,70]],[1,[199,132,82]],
  ];
  const espresso=[67,32,16];
  const nrand=random(553),grid=Array.from({length:65},()=>Array.from({length:64},()=>nrand()));
  function noise(x,y){let ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const get=(a,b)=>grid[((b%65)+65)%65][((a%64)+64)%64];return (get(ix,iy)*(1-fx)+get(ix+1,iy)*fx)*(1-fy)+(get(ix,iy+1)*(1-fx)+get(ix+1,iy+1)*fx)*fy;}
  function palette(y){y=clamp(y);let s=0;while(s<stops.length-2&&y>stops[s+1][0])s++;const a=stops[s],b=stops[s+1],t=smooth(a[0],b[0],y);return a[1].map((v,k)=>v*(1-t)+b[1][k]*t);}
  for(let j=0;j<h;j++) {
    const y=1-j/(h-1);
    for(let i=0;i<w;i++) {
      const u=i/w,a=u*TAU,phi=a-Math.PI;
      const broad=noise(u*8, y*9),fine=noise(u*32,y*31);
      const flow=.020*Math.sin(a*3-y*6)+.011*Math.sin(a*7+y*13)+(broad-.5)*.035;
      const milkWisp=Math.pow(Math.max(0,Math.sin(a*4+y*9+.7*Math.sin(a*2-y*6))),5)*.025*(1-smooth(.45,.7,y));
      const base=palette(y+flow-milkWisp);
      // Espresso eddies and submerged ice form an uneven band near the rim.
      const beltHeight=.885+.018*Math.sin(a*3)+.012*Math.sin(a*7+1)+(broad-.5)*.025;
      const belt=Math.exp(-Math.pow((y-beltHeight)/.033,2));
      const around=.40+.60*Math.pow(.5+.5*Math.cos(phi+.45),2);
      const darkBelt=belt*around*(.40+.32*broad);
      const ribbon=Math.exp(-Math.pow((y-(.948+.016*Math.sin(a*4+y*3)))/.010,2))*.22*around;
      const eddy1=Math.exp(-Math.pow((phi+.38)/.32,2)-Math.pow((y-.94)/.020,2))*.40;
      const eddy2=Math.exp(-Math.pow((phi+.07)/.055,2)-Math.pow((y-.80)/.013,2))*.50;
      const cap=clamp(darkBelt+ribbon+eddy1+eddy2,0,.83);
      const mottling=1+(broad-.5)*.025+(fine-.5)*.011+.004*(rng()-.5);
      const p=(j*w+i)*4;
      for(let k=0;k<3;k++) im.data[p+k]=clamp((base[k]*(1-cap)+espresso[k]*cap)*mottling,0,255);
      im.data[p+3]=255;
    }
  }
  ctx.putImageData(im,0,0);
  const normal=canvas(256,256),nctx=normal.getContext('2d'),ni=nctx.createImageData(256,256),nr=random(482);
  for(let i=0;i<ni.data.length;i+=4){ni.data[i]=128+(nr()-.5)*4;ni.data[i+1]=128+(nr()-.5)*4;ni.data[i+2]=255;ni.data[i+3]=255;}
  nctx.putImageData(ni,0,0);
  return {color:texture(c,'Latte_Milk_Espresso_Seamless'),normal:texture(normal,'Plastic_Micro_Normal',false)};
}

function makeBrandMap(reference) {
  // Isolate the red print from the provided photograph, discard its lighting,
  // and inverse-project the front cylinder to a wrap-ready transparent map.
  const src=canvas(reference.naturalWidth,reference.naturalHeight),sc=src.getContext('2d');sc.drawImage(reference,0,0);
  const sd=sc.getImageData(0,0,src.width,src.height).data;
  const w=2048,h=1024,out=canvas(w,h),oc=out.getContext('2d'),oi=oc.createImageData(w,h);
  const sample=(x,y,k)=>{
    x=clamp(x,0,src.width-2);y=clamp(y,0,src.height-2);
    const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
    const a=(yi*src.width+xi)*4+k,b=a+src.width*4;
    return (sd[a]*(1-xf)+sd[a+4]*xf)*(1-yf)+(sd[b]*(1-xf)+sd[b+4]*xf)*yf;
  };
  for(let j=0;j<h;j++) {
    const Y=(1-j/(h-1))*2.47+.04;
    for(let i=0;i<w;i++) {
      const phi=(i/(w-1)-.5)*TAU;
      if(Math.abs(phi)>1.16)continue;
      const bodyT=clamp(Y/2.58),rpx=90+31*bodyT;
      const cx=481-1.8*(1-bodyT),xp=cx+Math.sin(phi)*rpx;
      // Front lower rim lies at y=566; vertical projection includes its ellipse.
      const yp=557-Y/2.58*284+8.5*Math.cos(phi);
      if(yp<348||yp>568||xp<394||xp>563)continue;
      const r=sample(xp,yp,0),g=sample(xp,yp,1),b=sample(xp,yp,2);
      const redSignal=r-2*g+b;
      const redHue=(g-b)/Math.max(1,r-b);
      let alpha=smooth(14,34,redSignal)*(1-smooth(.31,.43,redHue))*smooth(16,37,r-b);
      // Beyond the artwork's outline, keep the cylinder entirely unprinted.
      alpha*=smooth(394,398,xp)*(1-smooth(560,563,xp));
      const k=(j*w+i)*4;oi.data[k]=134;oi.data[k+1]=31;oi.data[k+2]=29;oi.data[k+3]=Math.round(alpha*255);
    }
  }
  oc.putImageData(oi,0,0);
  return texture(out,'ARNO_Original_Photo_Print_Unwrapped');
}

export function buildCup(reference) {
  const cup=new THREE.Group();cup.name='ARNO_Cup';
  cup.userData={description:'ARNO iced latte with a photo-matched milk-to-caramel gradient and espresso eddies',front:'+Z',units:'metres',nominalHeightMetres:.222,source:'cup_arno(3).png',reconstruction:'Single-view approximation; front print extracted from reference; rear is inferred and unbranded',revision:'Reference gradient: creamy lower third, caramel middle, uneven dark espresso near the rim; fill restored below lid'};
  const physical=new THREE.Group();physical.name='CupAssembly';cup.add(physical);
  // Geometry uses convenient studio units; this transform exports nominal metres.
  physical.scale.setScalar(.05);physical.position.y=-.111;
  const maps=makeDrinkMaps();
  const plastic=new THREE.MeshPhysicalMaterial({name:'Clear_Thin_Plastic',color:'#ffffff',metalness:0,roughness:.13,transmission:1,thickness:.009,ior:1.48,envMapIntensity:.75,normalMap:maps.normal,normalScale:new THREE.Vector2(.055,.055)});
  // Thin alpha-blended plastic keeps the nested straw and ice visible in a
  // single-pass glTF viewer; transmissive outer shells otherwise hide them.
  const lidMat=new THREE.MeshPhysicalMaterial({name:'Clear_Dome_Plastic',color:'#aab3b5',metalness:0,roughness:.055,transparent:true,opacity:.40,transmission:0,ior:1.48,clearcoat:.30,clearcoatRoughness:.08,envMapIntensity:1,depthWrite:false});
  const rimMat=new THREE.MeshPhysicalMaterial({name:'Moulded_Plastic_Rim',color:'#bdc7c7',roughness:.12,transparent:true,opacity:.50,transmission:0,ior:1.48,envMapIntensity:1.25,depthWrite:false});
  const liquidMat=new THREE.MeshPhysicalMaterial({name:'Milk_Caramel_Espresso',color:'#ffffff',map:maps.color,roughness:.57,metalness:0,clearcoat:.10,clearcoatRoughness:.30,specularIntensity:.55,envMapIntensity:1});
  const capMat=new THREE.MeshPhysicalMaterial({name:'Espresso_Surface',color:'#5b2c12',roughness:.43,metalness:0,clearcoat:.12,specularIntensity:.45,envMapIntensity:.35});
  const cremaMat=new THREE.MeshStandardMaterial({name:'Coffee_Crema',color:'#b98954',roughness:.59,metalness:0});
  const iceMat=new THREE.MeshPhysicalMaterial({name:'Ice_Submerged',color:'#c3ac8f',roughness:.16,metalness:0,transmission:.72,thickness:.10,ior:1.31,envMapIntensity:1});
  const inkMat=new THREE.MeshStandardMaterial({name:'ARNO_Burgundy_Print',map:makeBrandMap(reference),color:'#ffffff',roughness:.62,metalness:0,transparent:true,alphaTest:.04,depthWrite:false,side:THREE.FrontSide,envMapIntensity:.3});

  const shellProfile=[[.002,.035],[.69,.035],[.75,.05],[.777,.08],[.784,.125],[.789,.17],[.80,.27],[.816,.46],[.844,.77],[.874,1.1],[.907,1.46],[.94,1.82],[.974,2.18],[1.006,2.49],[1.011,2.55],[1.015,2.59]];
  const shell=add(physical,'Cup_Shell',lathe(shellProfile),plastic);
  const drinkPoints=[[.002,.075],[.705,.075],[.752,.085],[.765,.13]];
  for(let i=0;i<=64;i++){const y=.15+i/64*2.40;drinkPoints.push([radius(y)-.018,y]);}
  // The photograph is filled to the cup rim, leaving the dome as air space.
  drinkPoints.push([.996,2.565]);
  const liquidGeo=lathe(drinkPoints,128,-Math.PI);
  const uv=liquidGeo.attributes.uv,pos=liquidGeo.attributes.position;
  for(let i=0;i<uv.count;i++) uv.setY(i,clamp((pos.getY(i)-.075)/2.49));
  uv.needsUpdate=true;
  const liquid=add(physical,'Latte_Contents',liquidGeo,liquidMat);liquid.castShadow=true;
  const surface=add(physical,'Coffee_Surface',new THREE.CircleGeometry(.996,96),capMat);surface.rotation.x=-Math.PI/2;surface.position.y=2.565;
  const meniscus=add(physical,'Coffee_Meniscus',new THREE.TorusGeometry(.985,.007,8,128),cremaMat);meniscus.rotation.x=Math.PI/2;meniscus.position.y=2.566;
  const foamParts=[],foamRandom=random(181);
  for(let i=0;i<38;i++){
    const a=foamRandom()*TAU,r=.931+foamRandom()*.04,size=.002+foamRandom()*.006;
    const g=new THREE.RingGeometry(size*.58,size,7);g.rotateX(-Math.PI/2);g.translate(r*Math.sin(a),2.568,r*Math.cos(a));foamParts.push(g);
  }
  add(physical,'Coffee_Surface_Bubbles',mergeGeometries(foamParts,false),cremaMat);foamParts.forEach(g=>g.dispose());

  const printGeo=lathe(Array.from({length:65},(_,i)=>{const y=.04+i/64*2.47;return [radius(y)+.004,y];}),128,-Math.PI);
  const print=add(physical,'ARNO_Print',printGeo,inkMat);

  const lidGroup=new THREE.Group();lidGroup.name='Lid';physical.add(lidGroup);
  const snapProfile=[[1.006,2.568],[1.055,2.573],[1.07,2.58],[1.074,2.607],[1.175,2.612],[1.194,2.63],[1.197,2.664],[1.188,2.69],[1.163,2.704],[1.16,2.73],[1.171,2.743],[1.178,2.757],[1.175,2.777],[1.16,2.788],[1.112,2.788],[1.104,2.78]];
  add(lidGroup,'Snap_Flange',lathe(snapProfile,160),rimMat);
  const dome=[];
  for(let i=0;i<=52;i++){const a=Math.PI/2-i/52*(Math.PI/2-.11);dome.push([1.106*Math.sin(a),2.775+.855*Math.cos(a)]);}
  add(lidGroup,'Dome',lathe(dome,160),lidMat);
  const hole=add(lidGroup,'Straw_Aperture',new THREE.TorusGeometry(.121,.011,6,64),rimMat);hole.rotation.x=Math.PI/2;hole.position.y=3.624;
  const ribs=[];
  for(let i=0;i<112;i++){
    const a=i/112*TAU,g=new THREE.CapsuleGeometry(.007,.04,2,4);g.rotateZ(.1);g.translate(1.195*Math.sin(a),2.66,1.195*Math.cos(a));ribs.push(g);
  }
  add(lidGroup,'Flange_Micro_Ridges',mergeGeometries(ribs,false),rimMat);ribs.forEach(g=>g.dispose());
  for(const [r,y,s] of [[1.038,2.58,.016],[1.165,2.781,.009],[.763,.066,.018]]) {
    const ring=add(physical,`Rolled_Ring_${y}`,new THREE.TorusGeometry(r,s,8,128),rimMat);ring.rotation.x=Math.PI/2;ring.position.y=y;
  }

  const straw=new THREE.Group();straw.name='Straw';physical.add(straw);
  const start=new THREE.Vector3(.195,2.43,.005),end=new THREE.Vector3(-.207,4.445,.005),dir=end.clone().sub(start),len=dir.length();
  const strawProfile=[[.041,0],[.046,.009],[.046,len-.008],[.041,len],[.033,len],[.034,.008],[.041,0]];
  const strawMat=lidMat.clone();strawMat.name='Clear_Straw_Plastic';strawMat.opacity=.46;strawMat.roughness=.12;
  const strawMesh=add(straw,'Hollow_Clear_Straw',lathe(strawProfile,40),strawMat);strawMesh.position.copy(start);strawMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());

  const ice=new THREE.Group();ice.name='Ice';physical.add(ice);
  const icePositions=[[-.58,2.48,-.10,.35,.16],[-.15,2.50,-.53,.42,-.31],[.52,2.49,-.23,.32,.47],[.34,2.46,.47,.36,-.37],[-.31,2.47,.42,.33,.65],[.23,2.48,.04,.27,.2]];
  icePositions.forEach(([x,y,z,s,r],i)=>{const g=new RoundedBoxGeometry(s,.19,s*.83,3,.033);g.computeVertexNormals();const m=add(ice,`Ice_${String(i+1).padStart(2,'0')}`,g,iceMat);m.position.set(x,y,z);m.rotation.set(.08,r,-.08);});

  const dropletMat=new THREE.MeshPhysicalMaterial({name:'Condensation_Water',color:'#ffffff',roughness:.13,metalness:0,transmission:.95,thickness:.007,ior:1.33,envMapIntensity:.65});
  const rng=random(377),droplets=[];
  for(let i=0;i<185;i++) {
    const y=.23+rng()*2.18,a=rng()*TAU,r=.006+Math.pow(rng(),3)*.022;
    const g=new THREE.SphereGeometry(1,7,5);g.scale(r,r*(1.05+rng()*.38),r*.48);
    g.rotateY(a);g.translate((radius(y)+r*.23)*Math.sin(a),y,(radius(y)+r*.23)*Math.cos(a));droplets.push(g);
  }
  add(physical,'Condensation',mergeGeometries(droplets,false),dropletMat);droplets.forEach(g=>g.dispose());
  // Reusable local metadata for the supplied R3F adapter, never a baked animation.
  cup.updateMatrixWorld(true);
  return cup;
}
