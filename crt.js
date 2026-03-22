const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const main = document.querySelector('main');
const text = document.querySelector('.text');

const menu = document.querySelector('.menu');
const ul = menu.querySelector('ul');

const ww = window.innerWidth;

let idx = 0;
let frame;

let isRedactedMode = false;
let isMenuVisible = true;

let maskData = null;
let frozenBuffer = null;

// Scroll settings
const visibleItems = 4;
const itemHeight = 50;
let scrollOffset = 0;

// Set canvas size
canvas.width = ww / 3;
canvas.height = (ww * 0.5625) / 3;

const w = canvas.width;
const h = canvas.height;

// 1. PRE-LOAD MASK (Ready for later)
const img = new Image();
img.src = 'imgs/WIP.png'; 
img.onload = () => {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = w; tCanvas.height = h;
    const tCtx = tCanvas.getContext('2d');
    tCtx.drawImage(img, 0, 0, w, h);
    maskData = tCtx.getImageData(0, 0, w, h).data;

    frozenBuffer = new Uint32Array(w * h);
    for (let i = 0; i < frozenBuffer.length; i++) {
        frozenBuffer[i] = ((255 * Math.random()) | 0) << 24;
    }
};

function snow(ctx) {
    const d = ctx.createImageData(w, h);
    const b = new Uint32Array(d.data.buffer);

    for (let i = 0; i < b.length; i++) {
        const isMask = isRedactedMode && maskData && maskData[i * 4] < 128;
        if (isMask) {
            b[i] = frozenBuffer[i];
        } else {
            b[i] = ((255 * Math.random()) | 0) << 24;
        }
    }
    ctx.putImageData(d, 0, 0);
}

function animate() {
	snow(ctx);
	frame = requestAnimationFrame(animate);
};

// Glitch
for (i = 0; i < 4; i++) {
	var span = text.firstElementChild.cloneNode(true);
	text.appendChild(span);
}

const sourceDisplays = text.querySelectorAll('span');

window.addEventListener('DOMContentLoaded', function(e) {
	setTimeout(function() {
		main.classList.add('on');
		main.classList.remove('off');
		animate();
	}, 1000);
});

window.addEventListener('keydown', (e) => {
    const prev = idx;
    const items = ul.children;
    const maxIndex = ul.children.length - 1;

    if (e.key.toLowerCase() === 'q') {
        e.preventDefault();
        isMenuVisible = !isMenuVisible;
        menu.style.display = isMenuVisible ? 'block' : 'none';
        // text.style.display = isMenuVisible ? 'block' : 'none';
        return;
    }

    if (!isMenuVisible) return;

	// Scroll
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();

        if (e.key === "ArrowUp" && idx > 0) idx--;
        if (e.key === "ArrowDown" && idx < maxIndex) idx++;

        idx = Math.max(0, Math.min(idx, maxIndex));

        items[prev].classList.remove('active');
        items[idx].classList.add('active');

        // Set AV-__
        const currentSource = items[idx].getAttribute('data-source');
		sourceDisplays.forEach(span => {
			span.innerText =  currentSource;
		});

        const firstVisibleIndex = Math.floor(scrollOffset / itemHeight);
        const lastVisibleIndex = firstVisibleIndex + visibleItems - 1;

        if (idx > lastVisibleIndex) {
            scrollOffset = (idx - lastVisibleIndex) * itemHeight + scrollOffset;
        } else if (idx < firstVisibleIndex) {
            scrollOffset = idx * itemHeight;
        }

        const maxOffset = Math.max(0, (items.length - visibleItems) * itemHeight);
        scrollOffset = Math.max(0, Math.min(scrollOffset, maxOffset));
        ul.style.transform = `translateY(-${scrollOffset}px)`;
    }

    if (e.key === "Enter") {
        const currentItem = items[idx];
        const link = currentItem.querySelector('a').getAttribute('href');

        if (link && link !== "#") {
            window.location.href = link;
        } else if (currentItem.classList.contains('redacted')) {
            sourceDisplays.forEach(span => {
                span.innerText = "INTERCEPTED...";
            });
			isRedactedMode = true;
			isMenuVisible = false;
        	menu.style.display = isMenuVisible ? 'block' : 'none';
        }
    }
});