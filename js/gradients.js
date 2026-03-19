/* ════════════════════════════════════════════
   GRADIENTS PAGE
════════════════════════════════════════════ */

function initGrad() {
    if (SCHEMES) {
        gradStops = [BASE, SCHEMES.complementary[1]];
    }
    renderGradStops();
    updateGrad();
}

function renderGradStops() {
    document.getElementById('gradStopsRow').innerHTML = gradStops.map((c, i) => `
        <div class="grad-stop-item">
            <div class="grad-stop-well" style="background:${c}" id="gsw${i}">
                <input type="color" value="${c}" oninput="gradStops[${i}]=this.value;document.getElementById('gsw${i}').style.background=this.value;updateGrad()">
            </div>
            <span class="mono" style="font-size:9px;color:var(--tx3)">${c}</span>
            ${gradStops.length > 2 ? `<button onclick="removeStop(${i})" style="background:none;border:none;color:var(--tx3);cursor:pointer;font-size:10px">✕</button>` : ''}
        </div>
    `).join('');
}

function addGradStop() {
    gradStops.push('#ffffff');
    renderGradStops();
    updateGrad();
}

function removeStop(i) {
    gradStops.splice(i, 1);
    renderGradStops();
    updateGrad();
}

function setGradType(t, btn) {
    gradType = t;
    ['linear', 'radial', 'conic'].forEach(x => {
        const b = document.getElementById(`gt-${x}`);
        if (b) {
            b.className = x === t ? 'btn btn-p btn-sm' : 'btn btn-s btn-sm';
        }
    });
    document.getElementById('gradAngleWrap').style.display = t === 'radial' ? 'none' : 'block';
    updateGrad();
}

function updateGrad() {
    gradAngle = parseInt(document.getElementById('gradAngleSlider').value) || 135;
    document.getElementById('gradAngleLbl').textContent = gradAngle + '°';
    
    const stops = gradStops.join(', ');
    let css;
    
    if (gradType === 'linear') css = `linear-gradient(${gradAngle}deg, ${stops})`;
    else if (gradType === 'radial') css = `radial-gradient(circle, ${stops})`;
    else css = `conic-gradient(from ${gradAngle}deg, ${stops})`;
    
    document.getElementById('gradCanvas').style.background = css;
    document.getElementById('gradCSSOut').textContent = `background: ${css};`;
}

function gradPreset(name) {
    const P = {
        sunset: ['#ff6b35', '#f7931e', '#ffcd3c'],
        ocean: ['#0077b6', '#00b4d8', '#90e0ef'],
        midnight: ['#0d0221', '#6a0572', '#ab83a1'],
        forest: ['#1b4332', '#40916c', '#95d5b2'],
        aurora: ['#00f5d4', '#fee440', '#f15bb5', '#9b5de5'],
        candy: ['#ff99c8', '#fcf6bd', '#d0f4de'],
        palette: SCHEMES ? [BASE, SCHEMES.complementary[1], SCHEMES.triadic?.[1] || BASE] : [BASE]
    };
    
    gradStops = P[name] || [BASE, '#ffffff'];
    renderGradStops();
    updateGrad();
}

function copyGradCSS() {
    copy(document.getElementById('gradCSSOut').textContent);
}

function saveGradient() {
    const css = document.getElementById('gradCSSOut').textContent;
    const g = JSON.parse(localStorage.getItem('pf_grads') || '[]');
    g.unshift({ css, colors: [...gradStops], ts: Date.now() });
    localStorage.setItem('pf_grads', JSON.stringify(g.slice(0, 24)));
    renderSavedGrads();
    toast('Gradient saved!', 'ok');
}

function renderSavedGrads() {
    const g = JSON.parse(localStorage.getItem('pf_grads') || '[]');
    const grid = document.getElementById('savedGradsGrid');
    if (!grid) return;
    
    if (!g.length) {
        grid.innerHTML = '<p style="color:var(--tx2);font-size:13px">No gradients saved yet.</p>';
        return;
    }
    
    grid.innerHTML = g.map((item, i) => `
        <div class="card" style="overflow:hidden;cursor:pointer" onclick="loadGrad(${i})">
            <div style="height:56px;${item.css}"></div>
            <div style="padding:8px 12px;font-family:var(--fm);font-size:9px;color:var(--tx3)">${item.colors.slice(0, 3).join(' → ')}</div>
        </div>
    `).join('');
}

function loadGrad(i) {
    const g = JSON.parse(localStorage.getItem('pf_grads') || '[]')[i];
    if (!g) return;
    gradStops = g.colors;
    renderGradStops();
    updateGrad();
    toast('Gradient loaded', 'ok');
}