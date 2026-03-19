/* ════════════════════════════════════════════
   MIXER PAGE
════════════════════════════════════════════ */

function updateMixer() {
    const a = document.getElementById('mcA').value;
    const b = document.getElementById('mcB').value;
    
    document.getElementById('mwA').style.background = a;
    document.getElementById('mwB').style.background = b;
    document.getElementById('mhA').value = a;
    document.getElementById('mhB').value = b;
    
    const steps = 9;
    
    document.getElementById('mixBar').innerHTML = Array.from({ length: steps }, (_, i) => {
        const c = mixC(a, b, i / (steps - 1));
        return `<div class="mix-sw" style="background:${c}" onclick="copy('${c}')" title="Click to copy ${c}"></div>`;
    }).join('');
    
    document.getElementById('mixHexBar').innerHTML = Array.from({ length: steps }, (_, i) => {
        const c = mixC(a, b, i / (steps - 1));
        return `<div class="mix-hex" onclick="copy('${c}')">${c}</div>`;
    }).join('');
}

function syncMixHex(side) {
    const inp = document.getElementById('mh' + side);
    let v = inp.value;
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        document.getElementById('mc' + side).value = v;
        updateMixer();
    }
}

function setMixerFromPalette(side) {
    if (!SCHEMES) {
        toast('Forge a palette first', 'er');
        return;
    }
    const c = side === 'A' ? BASE : SCHEMES.complementary[1];
    document.getElementById('mc' + side).value = c;
    updateMixer();
    toast(`Set Color ${side} to ${c}`, 'in');
}

function addMixToPalette() {
    if (!SCHEMES) {
        toast('Forge a palette first', 'er');
        return;
    }
    const a = document.getElementById('mcA').value;
    const b = document.getElementById('mcB').value;
    const mid = mixC(a, b, 0.5);
    copy(mid);
    toast(`Mix midpoint ${mid} copied`, 'ok');
}