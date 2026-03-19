/* ════════════════════════════════════════════
   CONTRAST PAGE
════════════════════════════════════════════ */

function updateContrast() {
    const fg = document.getElementById('cfgC').value;
    const bg = document.getElementById('cbgC').value;
    
    document.getElementById('cfgW').style.background = fg;
    document.getElementById('cbgW').style.background = bg;
    document.getElementById('cfgH').value = fg;
    document.getElementById('cbgH').value = bg;
    
    const ratio = cr(fg, bg);
    const r = ratio.toFixed(2);
    const aa = ratio >= 4.5;
    const aaa = ratio >= 7;
    const aa18 = ratio >= 3;
    
    document.getElementById('contrastResults').innerHTML = `
        <div class="c-result">
            <div class="c-demo" style="background:${bg};color:${fg}"><span style="font-size:20px;font-weight:700">Normal Text Aa</span><span style="font-size:14px">Body paragraph copy</span></div>
            <div class="c-meta">
                <div class="c-ratio" style="color:${aa ? 'var(--green)' : 'var(--red)'}">${r}:1</div>
                <span class="${aa ? 'wcag wpass' : 'wcag wfail'}">AA ${aa ? '✓' : '✗'}</span>
                <span class="${aaa ? 'wcag wpass' : 'wcag wfail'}">AAA ${aaa ? '✓' : '✗'}</span>
            </div>
        </div>
        <div class="c-result">
            <div class="c-demo" style="background:${bg};color:${fg}"><span style="font-size:28px;font-weight:800">Large Text</span><span style="font-size:18px">Heading level</span></div>
            <div class="c-meta">
                <div class="c-ratio" style="color:${aa18 ? 'var(--green)' : 'var(--red)'}">${r}:1</div>
                <span class="${aa18 ? 'wcag wpass' : 'wcag wfail'}">Large AA ${aa18 ? '✓' : '✗'}</span>
                <span class="${aaa ? 'wcag wpass' : 'wcag wfail'}">Large AAA ${aaa ? '✓' : '✗'}</span>
            </div>
        </div>
        <div class="c-result">
            <div class="c-demo" style="background:${bg}"><div style="width:44px;height:44px;background:${fg};border-radius:4px;margin:0 auto 4px"></div><span style="font-size:12px;color:${fg}">UI Component</span></div>
            <div class="c-meta">
                <div class="c-ratio" style="color:${aa18 ? 'var(--green)' : 'var(--red)'}">${r}:1</div>
                <span class="${aa18 ? 'wcag wpass' : 'wcag wfail'}">UI 3:1 ${aa18 ? '✓' : '✗'}</span>
                <div style="font-size:11px;color:var(--tx2);margin-top:4px">
                    ${r >= 7 ? 'Excellent' : r >= 4.5 ? 'Good' : r >= 3 ? 'Minimum' : 'Fails WCAG'}
                </div>
            </div>
        </div>
    `;
    
    buildContrastMatrix();
}

function syncContrastH(side) {
    const inp = document.getElementById('c' + side + 'H');
    let v = inp.value;
    if (!v.startsWith('#')) v = '#' + v;
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
        document.getElementById('c' + side + 'C').value = v;
        updateContrast();
    }
}

function setContrastFromPalette(side) {
    if (!SCHEMES) {
        toast('Forge a palette first', 'er');
        return;
    }
    const c = side === 'fg' ? ton(BASE) : BASE;
    document.getElementById('c' + side + 'C').value = c;
    document.getElementById('c' + side + 'H').value = c;
    document.getElementById('c' + side + 'W').style.background = c;
    updateContrast();
}

function buildContrastMatrix() {
    if (!SCHEMES) return;
    
    const colors = [
        BASE,
        ...SCHEMES.complementary.slice(1, 3),
        ...SCHEMES.monochromatic.slice(1, 3),
        '#ffffff',
        '#000000'
    ];
    
    let html = '<table style="border-collapse:collapse;font-size:10px"><thead><tr><th style="padding:5px 8px;color:var(--tx3);font-family:var(--fm);text-align:left">FG↓ BG→</th>';
    
    colors.forEach(c => {
        html += `<th style="padding:4px 6px"><div style="width:22px;height:22px;background:${c};border-radius:3px;border:1px solid var(--br);margin:0 auto"></div></th>`;
    });
    
    html += '</tr></thead><tbody>';
    
    colors.forEach(fg => {
        html += `<tr><td style="padding:4px 6px"><div style="width:22px;height:22px;background:${fg};border-radius:3px;border:1px solid var(--br)"></div></td>`;
        
        colors.forEach(bg => {
            const r = cr(fg, bg);
            const ok = r >= 4.5;
            html += `<td style="padding:3px 4px;text-align:center">
                <div style="background:${bg};color:${fg};padding:3px 5px;border-radius:2px;font-family:var(--fm);font-size:9px;border:1px solid ${ok ? 'rgba(40,196,120,.3)' : 'rgba(232,64,64,.2)'};cursor:pointer" onclick="copy('${fg}/${bg}')" title="${fg} on ${bg}">
                    ${r.toFixed(1)}
                </div>
            </td>`;
        });
        
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    document.getElementById('contrastMatrix').innerHTML = html;
}
