/* 

JavaScript Document

Tooplate 2157 Poppy Studio

https://www.tooplate.com/view/2157-poppy-studio

*/


(function() {
  let topZ = 100;
  const isMobile = () => window.innerWidth <= 820;

  document.querySelectorAll('.note').forEach(note => {
    let isDragging = false;
    let didDrag = false;
    let startX, startY, origLeft, origTop;
    const handles = note.querySelectorAll('.drag-handle');

    /* ── Scatter → lock opacity ── */
    note.addEventListener('animationend', function(e) {
      if (e.animationName.startsWith('scatterIn')) {
        this.style.opacity = '1';
        this.style.animation = 'none';
      }
      if (e.animationName === 'jiggle') {
        this.classList.remove('jiggling');
        this.style.animation = 'none';
      }
    });

    /* ── Click on handle → jiggle (only if not dragged) ── */
    handles.forEach(h => h.addEventListener('click', function(e) {
      if (didDrag) { didDrag = false; return; }
      note.classList.remove('jiggling');
      note.style.animation = '';
      void note.offsetWidth;
      note.classList.add('jiggling');
    }));

    /* ── Drag: pointer down (handle only) ── */
    function onDown(e) {
      if (isMobile()) return;
      isDragging = true;
      didDrag = false;

      const ptr = e.touches ? e.touches[0] : e;
      startX = ptr.clientX;
      startY = ptr.clientY;

      const rect = note.getBoundingClientRect();
      const boardRect = note.parentElement.getBoundingClientRect();
      origLeft = rect.left - boardRect.left;
      origTop = rect.top - boardRect.top;

      note.style.left = origLeft + 'px';
      note.style.top = origTop + 'px';
      note.style.right = 'auto';
      note.style.transform = 'rotate(0deg)';
      note.style.zIndex = ++topZ;
      note.classList.add('dragging');

      e.preventDefault();
    }

    /* ── Drag: pointer move ── */
    function onMove(e) {
      if (!isDragging) return;
      const ptr = e.touches ? e.touches[0] : e;
      const dx = ptr.clientX - startX;
      const dy = ptr.clientY - startY;

      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didDrag = true;

      note.style.left = (origLeft + dx) + 'px';
      note.style.top = (origTop + dy) + 'px';
      e.preventDefault();
    }

    /* ── Drag: pointer up ── */
    function onUp() {
      if (!isDragging) return;
      isDragging = false;
	  note.style.transform = '';
      note.classList.remove('dragging');
    }

    /* Mouse events on handles */
    handles.forEach(h => {
      h.addEventListener('mousedown', onDown);
      h.addEventListener('touchstart', onDown, { passive: false });
    });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);
  });
})();