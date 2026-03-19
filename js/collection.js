/* ════════════════════════════════════════════
   COLLECTION PAGE
════════════════════════════════════════════ */

function saveCurrent() {
    if (!BASE) {
        toast('Forge a palette first', 'er');
        return;
    }
    
    const saved = JSON.parse(localStorage.getItem('pf_saved') || '[]');
    if (saved.find(s => s.base === BASE)) {
        toast('Already in collection', 'in');
        return;
    }
    
    const mc = SCHEMES?.monochromatic || [BASE];
    saved.unshift({
        base: BASE,
        colors: mc,
        name: `Palette ${saved.length + 1}`,
        ts: Date.now()
    });
    
    localStorage.setItem('pf_saved', JSON.stringify(saved.slice(0, 50)));
    renderCollection();
    renderSidebar();
    toast('Saved to collection ★', 'ok');
}

function renderCollection() {
    const saved = JSON.parse(localStorage.getItem('pf_saved') || '[]');
    const grid = document.getElementById('collPalettes');
    const empty = document.getElementById('collEmpty');
    
    if (!saved.length) {
        grid.style.display = 'none';
        empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    grid.innerHTML = saved.map((item, i) => `
        <div class="coll-card" onclick="loadFromColl('${item.base}')">
            <div class="coll-swatches">
                ${item.colors.map(c => `<div class="mini-sw" style="background:${c}"></div>`).join('')}
            </div>
            <div class="coll-meta">
                <div class="coll-hex">${item.base}</div>
                <div class="coll-name">${item.name}</div>
                <div style="display:flex;gap:6px;margin-top:7px">
                    <button class="btn btn-g btn-sm" onclick="event.stopPropagation();deleteSaved(${i})">Remove</button>
                    <button class="btn btn-p btn-sm" onclick="event.stopPropagation();loadFromColl('${item.base}')">Load →</button>
                </div>
            </div>
        </div>
    `).join('');
}

function collTab(tab, btn) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    document.getElementById('collPalettes').style.display = tab === 'palettes' ? 'grid' : 'none';
    const cg = document.getElementById('collGradients');
    cg.style.display = tab === 'gradients' ? 'grid' : 'none';
    
    if (tab === 'gradients') {
        const g = JSON.parse(localStorage.getItem('pf_grads') || '[]');
        
        if (!g.length) {
            cg.innerHTML = '<p style="color:var(--tx2);font-size:13px">No gradients saved yet.</p>';
            return;
        }
        
        cg.innerHTML = g.map((item, i) => `
            <div class="coll-card" style="overflow:hidden;cursor:pointer" onclick="loadGrad(${i});nav('gradients')">
                <div style="height:52px;${item.css}"></div>
                <div class="coll-meta">
                    <div class="coll-hex">${item.colors.slice(0, 2).join(' → ')}</div>
                </div>
            </div>
        `).join('');
    }
}

function deleteSaved(i) {
    const s = JSON.parse(localStorage.getItem('pf_saved') || '[]');
    s.splice(i, 1);
    localStorage.setItem('pf_saved', JSON.stringify(s));
    renderCollection();
    renderSidebar();
    toast('Removed', 'in');
}

function loadFromColl(hex) {
    syncAllColorUIs(hex);
    document.getElementById('forgeHex').value = hex;
    forge();
    nav('forge');
}

function renderSidebar() {
    const saved = JSON.parse(localStorage.getItem('pf_saved') || '[]');
    const el = document.getElementById('sidebarMinis');
    
    if (!el || !saved.length) return;
    
    el.innerHTML = `<div class="sidebar-mini-label">Saved</div>` +
        saved.slice(0, 5).map(s => `
            <div class="mini-pal" onclick="loadFromColl('${s.base}')">
                ${s.colors.map(c => `<div class="mini-sw" style="background:${c}"></div>`).join('')}
            </div>
        `).join('');
}