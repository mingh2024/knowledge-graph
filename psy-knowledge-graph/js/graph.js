var THREE=window.THREE;var OrbitControls=window.OrbitControls;

var YR=["\u5927\u4e00","\u5927\u4e8c","\u5927\u4e09","\u5927\u56db"];

/* fixed type->ring order (outer to inner), same across all four years, by global node-count desc */

var TYPE_ORDER=["\u6784\u5ff5","\u65b9\u6cd5","\u7406\u8bba","\u8bfe\u7a0b","\u9886\u57df","\u5e94\u7528","\u6d41\u6d3e\u4e0e\u5386\u53f2"];

var YC={"\u5927\u4e00":0x3B82F6,"\u5927\u4e8c":0x10B981,"\u5927\u4e09":0x8B5CF6,"\u5927\u56db":0xF59E0B};

var YC_HEX={"\u5927\u4e00":"#3B82F6","\u5927\u4e8c":"#10B981","\u5927\u4e09":"#8B5CF6","\u5927\u56db":"#F59E0B"};

var Z_OFF={"\u5927\u4e00":-5,"\u5927\u4e8c":-1.7,"\u5927\u4e09":1.7,"\u5927\u56db":5};

var R_OUT=10,R_EDGE=0.5;var IS_NIGHT=false;

var DAY_COL=0xC0B8AC,DAY_OP=0.35,DAY_HL=0x999088,DAY_HL_OP=0.65;

var NIGHT_COL=0xC0D8F0,NIGHT_OP=0.15,NIGHT_HL=0xFFFFFF,NIGHT_HL_OP=0.50;

function tC(){return IS_NIGHT?NIGHT_COL:DAY_COL;}

function tO(){return IS_NIGHT?NIGHT_OP:DAY_OP;}

function hC(){return IS_NIGHT?NIGHT_HL:DAY_HL;}

function hO(){return IS_NIGHT?NIGHT_HL_OP:DAY_HL_OP;}

/* day=white, night=fluorescent green */

function dC(){return IS_NIGHT?"#39FF14":"#FFFFFF";}

function d3D(){return IS_NIGHT?["rgba(120,255,80,1)","rgba(57,255,20,1)","rgba(20,180,10,1)"]:["rgba(255,255,255,1)","rgba(220,220,220,1)","rgba(170,170,170,1)"];}
function d3S(){return IS_NIGHT?"rgba(30,60,180,0.95)":"rgba(0,0,0,0.75)";}



function drawShape(type,ctx,cx,cy,r){

  if(type==="\u8bfe\u7a0b"){for(var i=0;i<6;i++){var a=-Math.PI/2+i*Math.PI/3;i===0?ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}ctx.closePath();}

  else if(type==="\u9886\u57df"){ctx.arc(cx,cy,r*0.88,0,Math.PI*2);}

  else if(type==="\u7406\u8bba"){var wr=r*1.0,hr=r*0.7,cr=14;ctx.moveTo(cx-wr+cr,cy-hr);ctx.lineTo(cx+wr-cr,cy-hr);ctx.quadraticCurveTo(cx+wr,cy-hr,cx+wr,cy-hr+cr);ctx.lineTo(cx+wr,cy+hr-cr);ctx.quadraticCurveTo(cx+wr,cy+hr,cx+wr-cr,cy+hr);ctx.lineTo(cx-wr+cr,cy+hr);ctx.quadraticCurveTo(cx-wr,cy+hr,cx-wr,cy+hr-cr);ctx.lineTo(cx-wr,cy-hr+cr);ctx.quadraticCurveTo(cx-wr,cy-hr,cx-wr+cr,cy-hr);ctx.closePath();}

  else if(type==="\u6784\u5ff5"){var sq=r*0.8,sc=8;ctx.moveTo(cx-sq+sc,cy-sq);ctx.lineTo(cx+sq-sc,cy-sq);ctx.quadraticCurveTo(cx+sq,cy-sq,cx+sq,cy-sq+sc);ctx.lineTo(cx+sq,cy+sq-sc);ctx.quadraticCurveTo(cx+sq,cy+sq,cx+sq-sc,cy+sq);ctx.lineTo(cx-sq+sc,cy+sq);ctx.quadraticCurveTo(cx-sq,cy+sq,cx-sq,cy+sq-sc);ctx.lineTo(cx-sq,cy-sq+sc);ctx.quadraticCurveTo(cx-sq,cy-sq,cx-sq+sc,cy-sq);ctx.closePath();}

  else if(type==="\u65b9\u6cd5"){ctx.moveTo(cx,cy-r*0.9);ctx.lineTo(cx+r*0.75,cy);ctx.lineTo(cx,cy+r*0.9);ctx.lineTo(cx-r*0.75,cy);ctx.closePath();}

  else if(type==="\u5e94\u7528"){var tr=r*0.85;ctx.moveTo(cx,cy+tr);ctx.lineTo(cx+tr*0.866,cy-tr*0.5);ctx.lineTo(cx-tr*0.866,cy-tr*0.5);ctx.closePath();}

  else{ctx.ellipse(cx,cy,r*1.0,r*0.5,0,0,Math.PI*2);}

}

function makeNodeShape(type,hex){

  var c=document.createElement("canvas");c.width=200;c.height=200;

  var ctx=c.getContext("2d");var cx=100,cy=100,r=68;

  ctx.fillStyle=hex;ctx.globalAlpha=1;ctx.beginPath();drawShape(type,ctx,cx,cy,r);ctx.fill();

  var grd=ctx.createRadialGradient(cx-15,cy-15,2,cx,cy,r*0.5);grd.addColorStop(0,"rgba(255,255,255,0.4)");grd.addColorStop(0.5,"rgba(255,255,255,0.08)");grd.addColorStop(1,"rgba(0,0,0,0.1)");

  ctx.fillStyle=grd;ctx.globalAlpha=0.6;ctx.beginPath();drawShape(type,ctx,cx,cy,r);ctx.fill();ctx.globalAlpha=1;return c;

}

function makeLabel(name){

  var c=document.createElement("canvas");c.width=700;c.height=150;

  var ctx=c.getContext("2d");ctx.clearRect(0,0,700,150);

  ctx.textAlign="center";ctx.textBaseline="middle";

  ctx.shadowColor=IS_NIGHT?"rgba(0,0,0,0.9)":"rgba(255,255,255,0.6)";ctx.shadowBlur=8;

  ctx.fillStyle=IS_NIGHT?"#e0e8f0":"#1a1a2e";

  if(name.length<=5){ctx.font='bold 56px "Microsoft YaHei","PingFang SC",sans-serif';ctx.fillText(name,350,75);}

  else if(name.length<=9){var mi=Math.ceil(name.length/2);ctx.font='bold 44px "Microsoft YaHei","PingFang SC",sans-serif';ctx.fillText(name.slice(0,mi),350,50);ctx.fillText(name.slice(mi),350,105);}

  else{ctx.font='bold 38px "Microsoft YaHei","PingFang SC",sans-serif';for(var i=0;i<Math.ceil(name.length/5)&&i<3;i++)ctx.fillText(name.slice(i*5,(i+1)*5),350,30+i*44);}

  return c;

}

function makeRelIcon(type,color){

  var c=document.createElement("canvas");c.width=64;c.height=64;

  var ctx=c.getContext("2d");var cx=32,cy=32,r=24;

  var g3d=color||d3D();var grad=ctx.createRadialGradient(cx-6,cy-6,2,cx,cy,r);

  grad.addColorStop(0,g3d[0]);grad.addColorStop(0.6,g3d[1]);grad.addColorStop(1,g3d[2]);

  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();

  var sc2=d3S();ctx.strokeStyle=sc2;ctx.fillStyle=sc2;ctx.lineWidth=3;ctx.beginPath();

  switch(type){

    case"\u524d\u7f6e\u4e8e":ctx.moveTo(cx+16,cy);ctx.lineTo(cx-12,cy-16);ctx.lineTo(cx-12,cy+16);ctx.closePath();ctx.fill();break;

    case"\u4ece\u5c5e\u4e8e":ctx.moveTo(cx,cy-18);ctx.lineTo(cx+16,cy);ctx.lineTo(cx,cy+18);ctx.lineTo(cx-16,cy);ctx.closePath();ctx.stroke();break;

    case"\u8986\u76d6":ctx.beginPath();ctx.arc(cx-3,cy,9,-0.3,Math.PI+0.3);ctx.stroke();break;

    case"\u5e94\u7528\u4e8e":ctx.moveTo(cx+16,cy);ctx.lineTo(cx-12,cy-16);ctx.lineTo(cx-12,cy+16);ctx.closePath();ctx.stroke();break;

    case"\u89e3\u91ca":ctx.arc(cx,cy,8,0,Math.PI*2);ctx.stroke();ctx.font='bold 10px sans-serif';ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("i",cx,cy+2);break;

    case"\u6d4b\u91cf":ctx.lineWidth=4;ctx.moveTo(cx-14,cy-12);ctx.lineTo(cx+14,cy-12);ctx.moveTo(cx-18,cy);ctx.lineTo(cx+18,cy);ctx.moveTo(cx-14,cy+12);ctx.lineTo(cx+14,cy+12);ctx.stroke();break;

    case"\u5f71\u54cd":ctx.moveTo(cx+16,cy);ctx.lineTo(cx+10,cy-12);ctx.moveTo(cx+16,cy);ctx.lineTo(cx+10,cy+12);ctx.moveTo(cx-16,cy);ctx.lineTo(cx-10,cy-12);ctx.moveTo(cx-16,cy);ctx.lineTo(cx-10,cy+12);ctx.stroke();break;

    case"\u6f14\u53d8":ctx.arc(cx-2,cy,12,-Math.PI*0.7,Math.PI*0.7);ctx.moveTo(cx+12,cy-10);ctx.lineTo(cx+18,cy-5);ctx.lineTo(cx+8,cy-3);ctx.closePath();ctx.fill();break;

  }return c;

}

function makeTube(p1,p2,radius,color,op){

  var dir=new THREE.Vector3().subVectors(p2,p1);var len=dir.length();if(len<0.001)return null;

  var mid=new THREE.Vector3().addVectors(p1,p2).multiplyScalar(0.5);

  var mat=new THREE.MeshBasicMaterial({color:color,transparent:true,opacity:op,depthWrite:false});

  var geo=new THREE.CylinderGeometry(radius,radius,1,5,1);

  var mesh=new THREE.Mesh(geo,mat);mesh.position.copy(mid);mesh.scale.set(1,len,1);

  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.clone().normalize());

  return mesh;

}

window.createGraph3D=function(container,data,nodeIndex){

  var w=container.clientWidth,h=container.clientHeight;

  var scene=new THREE.Scene();scene.background=new THREE.Color(0xe8e0d4);

  var camera=new THREE.PerspectiveCamera(45,w/h,0.1,100);camera.position.set(20,16,20);

  var renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(w,h);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  container.appendChild(renderer.domElement);

  var controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);

  controls.enableDamping=true;controls.dampingFactor=0.08;controls.minDistance=8;controls.maxDistance=50;controls.maxPolarAngle=Math.PI/2.0;controls.update();

  var amb=new THREE.AmbientLight(0xf0e0c0,0.7);scene.add(amb);

  var dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(15,25,10);scene.add(dl);

  var mg=new THREE.Group();scene.add(mg);

  var ngs={},sps={},lbs={},rgs={},clickTargets=[];

  var tubes=[],decors=[];var autoRot=true,userInt=false,clickCb=null,activeFocus=null;

  var rc=new THREE.Raycaster(),pt=new THREE.Vector2();



  YR.forEach(function(gname){

    var gz=Z_OFF[gname],gcol=YC[gname],ghex=YC_HEX[gname];

    var rg=new THREE.Group();rg.position.z=gz;rg.userData.gradeName=gname;mg.add(rg);rgs[gname]=rg;

    var disc=new THREE.Mesh(new THREE.CircleGeometry(R_OUT,64),

      new THREE.MeshBasicMaterial({color:gcol,transparent:true,opacity:0.06,side:THREE.DoubleSide,depthWrite:false}));

    disc.scale.set(1,0.65,1);disc.position.z=0;rg.add(disc);

    function rp(rr){var p=[];for(var i=0;i<=72;i++){var a=i/72*Math.PI*2;p.push(new THREE.Vector3(Math.cos(a)*rr,Math.sin(a)*rr*0.65,0.02));}return p;}

    rg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rp(R_OUT)),new THREE.LineBasicMaterial({color:gcol,transparent:true,opacity:0.15})));

    var glc=document.createElement("canvas");glc.width=320;glc.height=60;

    var glctx=glc.getContext("2d");glctx.clearRect(0,0,320,60);

    glctx.font='bold 30px "Microsoft YaHei","PingFang SC",sans-serif';glctx.textAlign="center";glctx.textBaseline="middle";

    glctx.shadowColor="rgba(0,0,0,0.8)";glctx.shadowBlur=6;glctx.fillStyle=ghex;glctx.globalAlpha=0.7;

    glctx.fillText(gname,160,30);

    var glt=new THREE.CanvasTexture(glc);glt.needsUpdate=true;

    var gls=new THREE.Sprite(new THREE.SpriteMaterial({map:glt,transparent:true,depthTest:false}));

    gls.position.set(R_OUT+2,0,0);gls.scale.set(2,0.35,1);rg.add(gls);



    /* fixed-order concentric rings: nodes are filled ring by ring in a fixed type order

       (same order every year, so the wheel keeps the same "shape" across \u5927\u4e00~\u5927\u56db), and

       the number of rings + icon/label scale for the whole year are chosen so that every

       ring has enough arc length for its nodes at a guaranteed non-overlap spacing - a

       crowded year (e.g. 130+ nodes) gets more/tighter rings and slightly smaller icons

       instead of cramming nodes past their collision radius. Within a ring, nodes are

       ordered by a barycenter heuristic (average angle of already-placed related nodes,

       course-sector seeded on the very first ring) so related nodes line up radially

       instead of scattering, keeping relation lines short and untangled. */

    var gNodes=data.nodes.filter(function(n){return n.year===gname;});

    if(gNodes.length===0)return;

    var buckets={};gNodes.forEach(function(n){var t=n.type||"\u5176\u4ed6";if(!buckets[t])buckets[t]=[];buckets[t].push(n);});

    var typesPresent=TYPE_ORDER.filter(function(t){return buckets[t]&&buckets[t].length>0;});

    Object.keys(buckets).forEach(function(t){if(typesPresent.indexOf(t)<0)typesPresent.push(t);});



    var yearMeta=data.years.filter(function(y){return y.name===gname;})[0];

    var courseOrder=yearMeta?yearMeta.courses.map(function(c){return c.name;}):[];

    function courseIdx(n){var i=courseOrder.indexOf(n.course||"");return i<0?courseOrder.length:i;}



    var MAX_R=R_OUT-0.5,MIN_R=R_EDGE+1;

    var SPACING_K=1.0;/* min arc-length per node, in units of icon scale, before icons touch */

    var GAP_K=1.5;/* min radial gap between rings, in units of icon scale, before label/icon touch the next ring */

    function ringPlan(scale){

      var radii=[];for(var r=MAX_R;r>=MIN_R;r-=GAP_K*scale)radii.push(r);

      var caps=radii.map(function(rr){return Math.max(Math.floor(2*Math.PI*rr*0.65/(SPACING_K*scale)),1);});

      var total=0;caps.forEach(function(c){total+=c;});

      return{radii:radii,caps:caps,total:total};

    }

    var scale=1.2;

    while(scale>0.5&&ringPlan(scale).total<gNodes.length*1.05)scale-=0.02;

    scale=Math.max(scale,0.5);

    var plan=ringPlan(scale);



    /* fixed type order -> one flat fill list, then greedily chunked into the ring plan */

    var flat=[];typesPresent.forEach(function(tn){buckets[tn].forEach(function(n){flat.push(n);});});



    var ellY=0.65;var placedAngle={};var cursor=0;

    plan.radii.forEach(function(radius,ri){

      if(cursor>=flat.length)return;

      var cap=plan.caps[ri];

      var ringNodes=flat.slice(cursor,cursor+cap);

      cursor+=ringNodes.length;

      var count=ringNodes.length;

      if(count===0)return;

      /* faint ring guide so each ring reads as one clean concentric loop */

      rg.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rp(radius)),

        new THREE.LineBasicMaterial({color:gcol,transparent:true,opacity:0.05})));



      var ordered;

      if(ri===0){

        /* first ring has no prior neighbors yet: seed by course sector so each

           course's nodes already start out clustered in the same angular slice */

        ordered=ringNodes.map(function(n,idx){return{n:n,key:courseIdx(n)*1000+idx};});

        ordered.sort(function(a,b){return a.key-b.key;});

        ordered=ordered.map(function(o){return o.n;});

      } else {

        /* later rings: aim each node at the average angle of its already-placed

           related nodes (any outer ring), falling back to its course sector */

        ordered=ringNodes.map(function(n){

          var rel=n.relatedNodeIds||[];var sx=0,sy=0,cnt=0;

          rel.forEach(function(rid){

            if(placedAngle.hasOwnProperty(rid)){sx+=Math.cos(placedAngle[rid]);sy+=Math.sin(placedAngle[rid]);cnt++;}

          });

          var target=cnt>0?Math.atan2(sy,sx):(courseIdx(n)/Math.max(courseOrder.length,1))*Math.PI*2;

          return{n:n,target:target};

        });

        ordered.sort(function(a,b){return a.target-b.target;});

        ordered=ordered.map(function(o){return o.n;});

      }



      ordered.forEach(function(n,ni){

        var angle=(ni/count)*Math.PI*2;

        placedAngle[n.id]=angle;

        var px=Math.cos(angle)*radius,py=Math.sin(angle)*radius*ellY;

        var ng=new THREE.Group();ng.position.set(px,py,0.04);ng.userData.nodeId=n.id;

        rg.add(ng);ngs[n.id]=ng;

        var sc=makeNodeShape(n.type,ghex);

        var st=new THREE.CanvasTexture(sc);st.needsUpdate=true;

        var sp=new THREE.Sprite(new THREE.SpriteMaterial({map:st,transparent:true,depthTest:false,opacity:0.95}));

        sp.scale.set(scale,scale,1);sp.userData.nodeId=n.id;sp.renderOrder=0;

        ng.add(sp);sps[n.id]=sp;

        var lc=makeLabel(n.name);

        var lt=new THREE.CanvasTexture(lc);lt.needsUpdate=true;

        var lb=new THREE.Sprite(new THREE.SpriteMaterial({map:lt,transparent:true,depthTest:false,opacity:0.9}));

        lb.scale.set(4.0*scale,0.63*scale,1);lb.position.y=0;lb.renderOrder=1;

        ng.add(lb);lbs[n.id]=lb;

        /* click target - generous but scaled down with the icon so neighbors don't overlap */

        var ctMesh=new THREE.Mesh(new THREE.SphereGeometry(0.75*scale,8,8),

          new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));

        ctMesh.userData.nodeId=n.id;ng.add(ctMesh);clickTargets.push(ctMesh);

      });

    });

    /* safety net: ringPlan always sizes for gNodes.length*1.05, so this should never fire */

    if(cursor<flat.length)console.warn('layout: '+(flat.length-cursor)+' unplaced nodes in '+gname);

  });



  /* relations - all icons at midpoint */

  var _vA=new THREE.Vector3(),_vB=new THREE.Vector3();

  data.relations.forEach(function(rel){

    var gs=ngs[rel.sourceId],gt=ngs[rel.targetId];if(!gs||!gt)return;

    gs.getWorldPosition(_vA);gt.getWorldPosition(_vB);

    var tube=makeTube(_vA,_vB,0.035,tC(),tO());

    if(!tube)return;

    tube.userData.relType=rel.type;tube.userData.sourceId=rel.sourceId;tube.userData.targetId=rel.targetId;

    tube.userData.srcGrade=nodeIndex[rel.sourceId]?nodeIndex[rel.sourceId].year:null;

    tube.userData.tgtGrade=nodeIndex[rel.targetId]?nodeIndex[rel.targetId].year:null;

    mg.add(tube);tubes.push(tube);

    /* ALL icons at MIDPOINT (not endpoint) */

    var dc=makeRelIcon(rel.type,d3D());var dt=new THREE.CanvasTexture(dc);dt.needsUpdate=true;var ds=new THREE.Sprite(new THREE.SpriteMaterial({map:dt,transparent:true,depthTest:false}));

    /* small icons */

    ds.scale.set(0.6,0.6,1);ds.renderOrder=2;ds.userData.relType=rel.type;

    var md=new THREE.Vector3();md.copy(_vA).add(_vB).multiplyScalar(0.5);mg.updateMatrixWorld(true);mg.worldToLocal(md);ds.position.copy(md);

    ds.userData.sourceId=rel.sourceId;ds.userData.targetId=rel.targetId;ds.userData.srcGrade=tube.userData.srcGrade;ds.userData.tgtGrade=tube.userData.tgtGrade;ds.visible=false;
    /*rotation disabled*/

    mg.add(ds);decors.push(ds);

  });



  /* grade focus */

  function focusGrade(gname){

    activeFocus=gname;var z=Z_OFF[gname];

    YR.forEach(function(g){if(rgs[g])rgs[g].visible=(g===gname);});

    tubes.forEach(function(t){var sg=t.userData.srcGrade,tg=t.userData.tgtGrade;t.visible=(sg===gname&&tg===gname);});

    decors.forEach(function(d){d.visible=false;});

    var sp=camera.position.clone(),ep=new THREE.Vector3(0,0,z+16);

    var st=controls.target.clone(),et=new THREE.Vector3(0,0,z);

    var dur=700,t0=performance.now();

    (function an(){var t=Math.min((performance.now()-t0)/dur,1),e=1-Math.pow(1-t,3);camera.position.lerpVectors(sp,ep,e);controls.target.lerpVectors(st,et,e);controls.update();if(t<1)requestAnimationFrame(an);})();

    var ov=document.getElementById("overviewThumb");if(ov)ov.style.display="block";drawOverview();

  }

  function unfocusGrade(){

    activeFocus=null;YR.forEach(function(g){if(rgs[g])rgs[g].visible=true;});

    tubes.forEach(function(t){t.visible=true;});decors.forEach(function(d){d.visible=false;});

    var sp=camera.position.clone(),ep=new THREE.Vector3(20,14,20);

    var st=controls.target.clone(),et=new THREE.Vector3(0,0,0);

    var dur=600,t0=performance.now();

    (function an(){var t=Math.min((performance.now()-t0)/dur,1),e=1-Math.pow(1-t,3);camera.position.lerpVectors(sp,ep,e);controls.target.lerpVectors(st,et,e);controls.update();if(t<1)requestAnimationFrame(an);})();

    var ov=document.getElementById("overviewThumb");if(ov)ov.style.display="none";

  }

  function drawOverview(){

    var cv=document.getElementById("overviewCanvas");if(!cv)return;

    var ctx=cv.getContext("2d");var cw=cv.width,ch=cv.height,cx=cw/2,cy=ch/2;

    ctx.clearRect(0,0,cw,ch);

    YR.forEach(function(g,i){var r=8+i*9;var col=YC_HEX[g];ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.globalAlpha=0.3+i*0.12;ctx.stroke();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=col;ctx.globalAlpha=0.06;ctx.fill();});

    ctx.globalAlpha=0.6;ctx.fillStyle="#fff";ctx.font="8px sans-serif";ctx.textAlign="center";ctx.fillText("\u56db\u5e74\u5236",cx,cy+3);ctx.globalAlpha=1;

  }

  function stopAuto(){autoRot=false;userInt=true;}

  var dp={x:0,y:0},isD=false;

  renderer.domElement.addEventListener("pointerdown",function(e){dp.x=e.clientX;dp.y=e.clientY;isD=true;stopAuto();});

  renderer.domElement.addEventListener("pointerup",function(e){

    if(!isD)return;isD=false;

    if(Math.abs(e.clientX-dp.x)>5||Math.abs(e.clientY-dp.y)>5)return;

    var r=renderer.domElement.getBoundingClientRect();

    pt.x=((e.clientX-r.left)/r.width)*2-1;pt.y=-((e.clientY-r.top)/r.height)*2+1;

    rc.setFromCamera(pt,camera);

    var hits=rc.intersectObjects(clickTargets);

    if(hits.length>0){for(var hi=0;hi<hits.length;hi++){var o=hits[hi].object;while(o&&!o.userData.nodeId)o=o.parent;if(o&&o.userData.nodeId){var ny=nodeIndex[o.userData.nodeId]?nodeIndex[o.userData.nodeId].year:null;if(!activeFocus||ny===activeFocus){clickCb(o.userData.nodeId);break;}}}}

  });

  renderer.domElement.addEventListener("wheel",stopAuto);



  function applyTheme(theme){

    IS_NIGHT=(theme==="night");

    scene.background=new THREE.Color(IS_NIGHT?0x080816:0xe8e0d4);

    amb.color.setHex(IS_NIGHT?0x404070:0xf0e0c0);amb.intensity=IS_NIGHT?0.6:0.7;

    tubes.forEach(function(t){if(t.type==="Mesh"){t.material.color.setHex(tC());t.material.opacity=tO();t.material.needsUpdate=true;}});

    /* update decoration colors */

    decors.forEach(function(d){

      if(d.type!=="Sprite")return;var rt=d.userData.relType||"\u89e3\u91ca";

      var nc=makeRelIcon(rt,d3D());var nt=new THREE.CanvasTexture(nc);nt.needsUpdate=true;d.material.map=nt;

    });

    for(var id in lbs){if(!nodeIndex[id])continue;var nl=makeLabel(nodeIndex[id].name);var nlt=new THREE.CanvasTexture(nl);nlt.needsUpdate=true;lbs[id].material.map=nlt;lbs[id].material.opacity=0.9;}

  }

  function highlightNode(nid){

    var rel=new Set([nid]);var n=nodeIndex[nid];

    if(n&&n.relatedNodeIds)n.relatedNodeIds.forEach(function(id){rel.add(id);});

    for(var id in sps){if(rel.has(id)){sps[id].material.opacity=1;if(lbs[id])lbs[id].material.opacity=1;}else{sps[id].material.opacity=0.04;if(lbs[id])lbs[id].material.opacity=0.02;}}

    tubes.forEach(function(t){if(rel.has(t.userData.sourceId)&&rel.has(t.userData.targetId)){t.material.opacity=hO();t.material.color.setHex(hC());}else{t.material.opacity=IS_NIGHT?0.03:0.04;}});
    decors.forEach(function(d){if(rel.has(d.userData.sourceId)&&rel.has(d.userData.targetId)){var sg=d.userData.srcGrade,tg=d.userData.tgtGrade;d.visible=(!activeFocus||(sg===activeFocus&&tg===activeFocus));}else{d.visible=false;}});

  }

  function unhighlightAll(){

    for(var id in sps){sps[id].material.opacity=0.95;if(lbs[id])lbs[id].material.opacity=0.9;}

    tubes.forEach(function(t){t.material.opacity=tO();t.material.color.setHex(tC());});
    decors.forEach(function(d){d.visible=false;});

  }

  applyTheme("day");

  function anim(){requestAnimationFrame(anim);if(autoRot&&!userInt)mg.rotation.y+=0.0015;var cd=camera.position.distanceTo(controls.target);var active=(activeFocus!=null);Object.keys(lbs).forEach(function(id){lbs[id].material.opacity=(active||cd<18)?0.9:0;});controls.update();renderer.render(scene,camera);}

  anim();

  return{

    onNodeClick:function(cb){clickCb=cb;},

    highlightNode:highlightNode,unhighlightAll:unhighlightAll,

    focusYear:function(g){focusGrade(g);},

    resetView:function(){unfocusGrade();unhighlightAll();},

    setAutoRotate:function(on){autoRot=on;if(on)userInt=false;},

    setTheme:function(t){applyTheme(t);},

    onResize:function(){var w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}

  };

};

