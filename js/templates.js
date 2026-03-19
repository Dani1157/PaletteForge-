/* ════════════════════════════════════════════
   TEMPLATES PAGE
════════════════════════════════════════════ */

function renderTemplates() {
    const cat = document.getElementById('tmplCat').value;
    const filtered = cat ? TMPLS.filter(t => t.cat === cat) : TMPLS;
    
    document.getElementById('tmplGrid').innerHTML = filtered.map((t, i) => {
        const col = BASE || '#e8a020';
        return `
            <div class="tmpl-card" onclick="openTemplate(${TMPLS.indexOf(t)})">
                <div class="tmpl-thumb" style="background:${col}">
                    <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(150deg,${col},${SCHEMES?.complementary?.[1] || col})">
                        <div style="font-family:var(--fd);font-size:30px;letter-spacing:1px;color:${ton(col)};opacity:.9">${t.name}</div>
                        <div style="font-size:11px;color:${ton(col)};opacity:.6;margin-top:4px">${t.cat}</div>
                    </div>
                    ${t.badge ? `<div class="tmpl-badge"><span class="badge ${t.badge === 'Popular' ? 'ba' : t.badge === 'New' ? 'bg' : 'br-bad'}">${t.badge}</span></div>` : ''}
                </div>
                <div class="tmpl-info">
                    <div class="tmpl-name">${t.name}</div>
                    <div class="tmpl-cat">${t.cat} · ${t.desc}</div>
                </div>
            </div>
        `;
    }).join('');
}

function openTemplate(i) {
    activeTemplate = i;
    const t = TMPLS[i];
    document.getElementById('tmplModalTitle').textContent = t.name;
    
    const b = BASE || '#e8a020';
    const cs = SCHEMES || makeSchemes(b);
    const dk = isDark(b);
    const bg = dk ? '#0b0d10' : '#f8f7f3';
    const card = dk ? '#13161e' : '#fff';
    const tm = dk ? '#ede9e0' : '#1a1714';
    const ts = dk ? '#777' : '#6b6560';
    const bdr = dk ? '#1c2030' : '#e0dcd4';
    const tc = ton(b);
    const rb = `${h2r(b).r},${h2r(b).g},${h2r(b).b}`;
    
    document.getElementById('tmplModalBody').innerHTML = `
        <div style="border:1px solid var(--br);border-radius:var(--r2);overflow:hidden;margin-bottom:18px">
            <div style="background:${bg};color:${tm};padding:28px;font-family:'Outfit',sans-serif">
                <nav style="display:flex;align-items:center;justify-content:space-between;margin-bottom:28px">
                    <b style="font-size:17px">${t.name}<span style="color:${b}">.</span></b>
                    <div style="display:flex;gap:16px;font-size:13px;color:${ts}"><span>About</span><span>Work</span><span>Contact</span></div>
                    <button style="background:${b};color:${tc};border:none;padding:8px 20px;border-radius:5px;font-weight:700;font-size:13px">Get started</button>
                </nav>
                <div style="max-width:480px">
                    <div style="display:inline-block;background:rgba(${rb},.12);color:${b};padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:14px;border:1px solid rgba(${rb},.25)">${t.cat}</div>
                    <h2 style="font-size:38px;font-weight:800;line-height:1.08;margin-bottom:12px;letter-spacing:-1.5px">Built for <span style="color:${b}">modern</span> teams.</h2>
                    <p style="font-size:14px;color:${ts};line-height:1.75;margin-bottom:20px">${t.desc} — now fully themed with your forged palette.</p>
                    <div style="display:flex;gap:10px">
                        <button style="background:${b};color:${tc};border:none;padding:11px 26px;border-radius:5px;font-weight:700;font-size:14px">Start free →</button>
                        <button style="background:${card};color:${tm};border:1px solid ${bdr};padding:11px 26px;border-radius:5px;font-size:14px">Learn more</button>
                    </div>
                </div>
            </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;font-size:12px;color:var(--tx2)">
            <span class="badge ba">${t.cat}</span>
            ${t.badge ? `<span class="badge bg">${t.badge}</span>` : ''}
            <span style="margin-left:auto">Your palette: <b style="color:var(--ac)">${b}</b></span>
        </div>
    `;
    
    openOverlay('tmplModal');
}

function exportTemplate() {
    const t = TMPLS[activeTemplate];
    const b = BASE || '#e8a020';
    const comp = SCHEMES?.complementary?.[1] || '#118ab2';
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${t.name} — PaletteForge Export</title>
    <style>
        :root{--primary:${b};--comp:${comp};--text:#1a1714;--bg:#f8f7f4}
        body{font-family:system-ui,sans-serif;margin:0;background:var(--bg);color:var(--text)}
        nav{background:var(--primary);padding:16px 40px;display:flex;align-items:center;justify-content:space-between}
        nav b{color:${ton(b)};font-size:20px}
        nav a{color:${ton(b)};text-decoration:none;margin:0 12px;font-size:14px}
        main{padding:80px 40px;text-align:center}
        h1{font-size:52px;font-weight:800;margin-bottom:16px}
        h1 span{color:var(--primary)}
        p{font-size:18px;color:#666;max-width:500px;margin:0 auto 28px;line-height:1.7}
        .cta{background:var(--primary);color:${ton(b)};text-decoration:none;padding:14px 32px;border-radius:6px;font-weight:700;font-size:16px;display:inline-block}
    </style>
</head>
<body>
    <nav>
        <b>${t.name}</b>
        <div>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Contact</a>
        </div>
    </nav>
    <main>
        <h1>Your <span>headline</span> here.</h1>
        <p>${t.desc}</p>
        <a href="#" class="cta">Get Started →</a>
    </main>
</body>
</html>`;
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `${t.name.toLowerCase().replace(/\s/g, '-')}-paletteforge.html`;
    a.click();
    
    toast('Template exported!', 'ok');
    closeOverlay('tmplModal');
}

async function generateAITemplate() {
    if (!BASE) {
        toast('Forge a palette first', 'er');
        return;
    }
    nav('aistudio');
    const prompt = `You are a top web designer. Describe a stunning, detailed website design for a ${document.getElementById('tmplCat').value || 'SaaS'} using palette: primary ${BASE}, complementary ${SCHEMES?.complementary?.[1] || 'N/A'}. Describe: aesthetic direction, layout per-section, color application to specific elements, typography recommendations, unique design details that make it memorable. Be specific and vivid. 250 words.`;
    await streamAI(prompt, 'aiBrandOut');
}