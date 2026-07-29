import os
import re

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "js", "graph.js"), 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Increase disc opacity for better colors
c = c.replace('opacity: 0.12,\n      side: THREE.DoubleSide', 'opacity: 0.18,\n      side: THREE.DoubleSide')

# 2. Fix connection line Z to match sphere Z (0.05 instead of 0.02) 
c = c.replace('new THREE.Vector3(m1.position.x, m1.position.y, z1 + 0.02),\n                 new THREE.Vector3(m2.position.x, m2.position.y, z2 + 0.02)];',
    'new THREE.Vector3(m1.position.x, m1.position.y, z1 + 0.05),\n                 new THREE.Vector3(m2.position.x, m2.position.y, z2 + 0.05)];')

# 3. Increase line opacities
c = c.replace('var lineMat = new THREE.LineBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.08,',
    'var lineMat = new THREE.LineBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.15,')
c = c.replace('l.material.opacity = 0.08; l.material.color.setHex(0x4488cc);',
    'l.material.opacity = 0.15; l.material.color.setHex(0x4488cc);')
c = c.replace('l.material.opacity = 0.6; l.material.color.setHex(0x66aaff);',
    'l.material.opacity = 0.9; l.material.color.setHex(0x66aaff); l.material.linewidth = 2;')

# 4. Add ring drag rotation and Z-push tracking
# Replace the pointer event handlers section
old_handlers = '''  function onPointerDown(ev) {
    var rect = renderer.domElement.getBoundingClientRect();
    pDown.x = ev.clientX; pDown.y = ev.clientY; isDown = true;
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    // Stop auto-rotate on any interaction
    stopAutoRotate();
  }
  function onPointerUp(ev) {
    if (!isDown) return; isDown = false;
    if (Math.abs(ev.clientX - pDown.x) > 4 || Math.abs(ev.clientY - pDown.y) > 4) return;
    var rect = renderer.domElement.getBoundingClientRect();
    var px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    var py = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(px, py), camera);
    var hits = raycaster.intersectObjects(Object.values(nodeMeshes));
    if (hits.length > 0 && clickHandler) {
      var hit = hits[0].object;
      if (hit.userData && hit.userData.nodeId) clickHandler(hit.userData.nodeId);
    }
  }
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  // Also stop on wheel (zoom)
  renderer.domElement.addEventListener('wheel', function() { stopAutoRotate(); });'''

new_handlers = '''  var dragRing = -1;
  var dragStartAngle = 0;
  var isRingDrag = false;
  var isZDrag = false;
  var shiftHeld = false;

  function onPointerDown(ev) {
    var rect = renderer.domElement.getBoundingClientRect();
    pDown.x = ev.clientX; pDown.y = ev.clientY; isDown = true;
    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    stopAutoRotate();
    shiftHeld = ev.shiftKey;
    
    // Check if hitting a ring disc
    raycaster.setFromCamera(pointer, camera);
    var discHits = raycaster.intersectObjects(ringDiscs);
    if (discHits.length > 0) {
      var yi = discHits[0].object.userData.yearIndex;
      if (yi !== undefined) {
        dragRing = yi;
        var dx = pointerDownPos.x - rect.width / 2;
        var dy = pointerDownPos.y - rect.height / 2;
        dragStartAngle = Math.atan2(dy, dx);
        isRingDrag = true;
        isZDrag = shiftHeld;
        return;
      }
    }
    isRingDrag = false; isZDrag = false;
  }
  function onPointerMove(ev) {
    if (!isDown || dragRing < 0) return;
    var rect = renderer.domElement.getBoundingClientRect();
    var dx = ev.clientX - rect.width / 2;
    var dy = ev.clientY - rect.height / 2;
    var angle = Math.atan2(dy, dx);
    if (isZDrag) {
      // Z-push: vertical movement
      var deltaZ = (pDown.y - ev.clientY) * 0.05;
      ringZTargets[dragRing] += deltaZ;
      ringScaleTargets[dragRing] = 1.1;
      pDown.y = ev.clientY;
      // Dim other rings
      for (var i = 0; i < 4; i++) {
        if (i !== dragRing) {
          ringDiscs[i].material.opacity = 0.04;
        } else {
          ringDiscs[i].material.opacity = 0.25;
        }
      }
    } else {
      // Ring rotation
      var delta = angle - dragStartAngle;
      ringRotationAngles[dragRing] += delta;
      yearGroups[dragRing].rotation.y = ringRotationAngles[dragRing];
      dragStartAngle = angle;
    }
  }
  function onPointerUp(ev) {
    if (!isDown) return; isDown = false;
    if (isRingDrag) { isRingDrag = false; dragRing = -1; return; }
    if (isZDrag) { isZDrag = false; dragRing = -1; 
      // Reset ring opacities
      for (var i = 0; i < 4; i++) ringDiscs[i].material.opacity = 0.18;
      return; 
    }
    if (Math.abs(ev.clientX - pDown.x) > 4 || Math.abs(ev.clientY - pDown.y) > 4) return;
    var rect = renderer.domElement.getBoundingClientRect();
    var px = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
    var py = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(new THREE.Vector2(px, py), camera);
    var hits = raycaster.intersectObjects(Object.values(nodeMeshes));
    if (hits.length > 0 && clickHandler) {
      var hit = hits[0].object;
      if (hit.userData && hit.userData.nodeId) clickHandler(hit.userData.nodeId);
    }
  }
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('wheel', function() { stopAutoRotate(); });'''

c = c.replace(old_handlers, new_handlers)

# 5. Add yearIndex to ringDiscs
c = c.replace('ringDiscs.push(disc);', 'ringDiscs.push(disc);\n    disc.userData.yearIndex = yi;')

# 6. Add pointerDownPos variable
c = c.replace('var pDown = { x: 0, y: 0 };', 'var pDown = { x: 0, y: 0 };\nvar pointerDownPos = { x: 0, y: 0 };')

# 7. Update pointerDown to also track pointerDownPos
c = c.replace('pDown.x = ev.clientX; pDown.y = ev.clientY; isDown = true;\n    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;\n    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;\n    stopAutoRotate();\n    shiftHeld = ev.shiftKey;',
    'pDown.x = ev.clientX; pDown.y = ev.clientY; isDown = true;\n    pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;\n    pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;\n    pointerDownPos.x = ev.clientX; pointerDownPos.y = ev.clientY;\n    stopAutoRotate();\n    shiftHeld = ev.shiftKey;')

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "js", "graph.js"), 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
