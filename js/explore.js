/* ════════════════════════════════════════════
   EXPLORE PAGE
════════════════════════════════════════════ */

function renderExploreGrid(tab) {
    const palettes = EXPLORE[tab] || EXPLORE.trending;
    
    document.getElementById('exploreGrid').innerHTML = palettes.map(p => `
        <div class="coll-card">
            <div class="coll-swatches">
                ${p.colors.map(c => `<div class="mini-sw" style="background:${c}"></div>`).join('')}
            </div>
            <div class="coll-meta">
                <div class="coll-hex">${p.base}</div>
                <div class="coll-name">${p.name}</div>
                <div style="display:flex;gap:6px;margin-top:7px">
                    <button class="btn btn-g btn-sm" onclick="saveExplore(${JSON.stringify(p).replace(/"/g, '&quot;')})">★ Save</button>
                    <button class="btn btn-p btn-sm" onclick="loadFromColl('${p.base}')">Load →</button>
                </div>
            </div>
        </div>
    `).join('');
}

function exploreTab(tab, btn) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderExploreGrid(tab);
}

function saveExplore(p) {
    const saved = JSON.parse(localStorage.getItem('pf_saved') || '[]');
    
    if (!saved.find(s => s.base === p.base)) {
        saved.unshift({ ...p, ts: Date.now() });
        localStorage.setItem('pf_saved', JSON.stringify(saved.slice(0, 50)));
    }
    
    renderCollection();
    renderSidebar();
    toast(`"${p.name}" saved!`, 'ok');
}