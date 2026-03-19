/* ════════════════════════════════════════════
   IMAGES PAGE
════════════════════════════════════════════ */

function autoKw(hex) {
    const { h, s } = r2hs(...Object.values(h2r(hex)));
    if (s < 20) return colorKwMap.neutral;
    if (h < 20 || h >= 330) return colorKwMap.red;
    if (h < 45) return colorKwMap.orange;
    if (h < 75) return colorKwMap.yellow;
    if (h < 150) return colorKwMap.green;
    if (h < 195) return colorKwMap.teal;
    if (h < 255) return colorKwMap.blue;
    if (h < 285) return colorKwMap.indigo;
    if (h < 320) return colorKwMap.purple;
    return colorKwMap.pink;
}

function autoImages() {
    if (!BASE) {
        toast('Forge a palette first', 'er');
        return;
    }
    const kw = autoKw(BASE);
    document.getElementById('imgQ').value = kw;
    searchImages(kw);
}

function searchImages(overrideQ) {
    const q = overrideQ || document.getElementById('imgQ').value.trim();
    if (!q) {
        toast('Enter a search keyword', 'er');
        return;
    }
    imgCurrentQ = q;
    imgPage = 1;
    const color = document.getElementById('imgColor').value;
    imgCurrentColor = color;
    doImageSearch(q, color, 1, false);
}

function loadMoreImages() {
    imgPage++;
    doImageSearch(imgCurrentQ, imgCurrentColor, imgPage, true);
}

function doImageSearch(q, color, page, append) {
    const grid = document.getElementById('imgGrid');
    
    if (!append) {
        grid.innerHTML = Array.from({ length: 8 }, () => `<div class="img-tile skel"></div>`).join('');
    }
    
    const sig = Date.now();
    const imgs = Array.from({ length: 8 }, (_, i) => {
        const sz = i % 2 === 0 ? '800x600' : '900x700';
        const colorParam = color ? `${encodeURIComponent(color)},` : '';
        return {
            src: `https://source.unsplash.com/${sz}/?${colorParam}${encodeURIComponent(q)}&sig=${sig + i * 199 + (page * 1000)}`,
            q,
            i: i + (page - 1) * 8
        };
    });
    
    if (!append) {
        grid.innerHTML = imgs.map(im => `
            <div class="img-tile" onclick="openImgDetail('${im.src}','${im.q.replace(/'/g, "\\'")}')" data-src="${im.src}">
                <img src="${im.src}" alt="${im.q}" loading="lazy" onerror="this.closest('.img-tile').style.display='none'">
                <div class="img-tile-ov"><span class="img-tile-src">Unsplash · ${im.q}</span></div>
                <div class="img-tile-actions">
                    <button class="img-act-btn" onclick="event.stopPropagation();window.open('${im.src}','_blank')">↗ Open</button>
                    <button class="img-act-btn" onclick="event.stopPropagation();copy('${im.src}')">Copy URL</button>
                </div>
            </div>
        `).join('');
    } else {
        imgs.forEach(im => {
            const el = document.createElement('div');
            el.className = 'img-tile';
            el.onclick = () => openImgDetail(im.src, im.q);
            el.innerHTML = `
                <img src="${im.src}" alt="${im.q}" loading="lazy" onerror="this.closest('.img-tile').style.display='none'">
                <div class="img-tile-ov"><span class="img-tile-src">Unsplash · ${im.q}</span></div>
                <div class="img-tile-actions">
                    <button class="img-act-btn" onclick="event.stopPropagation();window.open('${im.src}','_blank')">↗ Open</button>
                </div>
            `;
            grid.appendChild(el);
        });
    }
    
    document.getElementById('imgLoadMore').style.display = 'block';
}

function openImgDetail(src, q) {
    document.getElementById('imgModalBody').innerHTML = `
        <img src="${src}" alt="${q}" style="width:100%;border-radius:var(--r2);margin-bottom:16px;display:block">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <a href="${src}" target="_blank" class="btn btn-p btn-sm">Open full size ↗</a>
            <button class="btn btn-s btn-sm" onclick="copy('${src}')">Copy URL</button>
            <span style="font-size:12px;color:var(--tx2)">Photo from <a href="https://unsplash.com" target="_blank" style="color:var(--ac)">Unsplash</a></span>
        </div>
    `;
    openOverlay('imgModal');
}