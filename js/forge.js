/* ════════════════════════════════════════════
   FORGE PAGE
════════════════════════════════════════════ */

function forge() {
    let hex = document.getElementById('forgeHex').value.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
        toast('Enter a valid hex color like #3a7bd5', 'er');
        return;
    }
    syncAllColorUIs(hex);
    SCHEMES = makeSchemes(hex);
    document.getElementById('forgeEmpty').style.display = 'none';
    document.getElementById('forgeOutput').style.display = 'block';
    renderSchemes();
    renderPreview();
    renderColorInfo();
    renderLogoGrid();
    renderQuickExport();
    buildExportPage();
    toast(`Palette forged for ${hex} ✦`, 'ok');
}

/* ════════════════════════════════════════════
   SCHEME GRID
════════════════════════════════════════════ */

function renderSchemes() {
    const names = {
        complementary: 'Complementary',
        'split-comp': 'Split-Comp',
        triadic: 'Triadic',
        analogous: 'Analogous',
        monochromatic: 'Monochromatic'
    };
    
    document.getElementById('schemeGrid').innerHTML = Object.entries(SCHEMES).map(([k, cs]) => `
        <div class="scheme-card" onclick="applyScheme(${JSON.stringify(cs)})">
            <div class="scheme-lbl">${names[k]}
                <button class="btn btn-g btn-sm" style="padding:1px 8px;font-size:9px" onclick="event.stopPropagation();copyAll(${JSON.stringify(cs)})">Copy All</button>
            </div>
            <div class="swatch-row">
                ${cs.map(c => `<div class="sw" style="background:${c}" onclick="event.stopPropagation();copy('${c}')"><div class="sw-hex">${c}</div></div>`).join('')}
            </div>
            <div class="scheme-chips">
                ${cs.map(c => `<span class="chip" onclick="event.stopPropagation();copy('${c}')">${c}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

/* ════════════════════════════════════════════
   LIVE PREVIEW
════════════════════════════════════════════ */

function switchPrev(type, btn) {
    PREV = type;
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('prevUrl').textContent = PREV_URLS[type] || 'yoursite.com';
    if (SCHEMES) renderPreview();
}

function renderPreview() {
    if (!SCHEMES) return;
    
    const b = BASE, cs = SCHEMES, dk = isDark(b);
    const bg = dk ? '#0b0d10' : '#f8f7f3';
    const card = dk ? '#13161e' : '#fff';
    const tm = dk ? '#ede9e0' : '#1a1714';
    const ts = dk ? '#777' : '#6b6560';
    const bdr = dk ? '#1c2030' : '#e0dcd4';
    const tc = ton(b);
    const rb = `${h2r(b).r},${h2r(b).g},${h2r(b).b}`;
    const comp = cs.complementary[1];
    const tri = cs.triadic[1];
    const tri2 = cs.triadic[2];
    const mc = cs.monochromatic;
    
    const prevs = {
        landing: `<div style="background:${bg};color:${tm};padding:28px;font-family:'Outfit',sans-serif">
            <nav style="display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;padding-bottom:16px;border-bottom:1px solid ${bdr}">
                <b style="font-size:17px;letter-spacing:-.5px">Brand<span style="color:${b}">Co</span></b>
                <div style="display:flex;gap:20px;font-size:13px;color:${ts}"><span>Features</span><span>Pricing</span><span>About</span><span>Blog</span></div>
                <div style="display:flex;gap:8px"><button style="background:none;color:${tm};border:1px solid ${bdr};padding:7px 16px;border-radius:5px;font-size:13px">Log in</button><button style="background:${b};color:${tc};border:none;padding:7px 18px;border-radius:5px;font-weight:700;font-size:13px">Get started</button></div>
            </nav>
            <div style="text-align:center;padding:12px 0 32px;max-width:540px;margin:0 auto">
                <div style="display:inline-block;background:rgba(${rb},.12);color:${b};padding:5px 14px;border-radius:20px;font-size:11px;font-weight:700;margin-bottom:18px;border:1px solid rgba(${rb},.25)">✦ Now in public beta · 12,000+ teams</div>
                <h1 style="font-size:42px;font-weight:800;line-height:1.08;margin-bottom:12px;letter-spacing:-1.5px">Build products your <span style="color:${b}">users love.</span></h1>
                <p style="font-size:14px;color:${ts};line-height:1.75;margin-bottom:26px">The all-in-one platform for design, collaboration, and shipping. No code required.</p>
                <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
                    <button style="background:${b};color:${tc};border:none;padding:12px 28px;border-radius:5px;font-weight:700;font-size:14px">Start free trial →</button>
                    <button style="background:${card};color:${tm};border:1px solid ${bdr};padding:12px 28px;border-radius:5px;font-size:14px">Watch demo ▷</button>
                </div>
                <p style="font-size:11px;color:${ts};margin-top:10px">Free forever · No credit card · Cancel anytime</p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
                ${[
                    ['◈', 'Analytics', 'Real-time AI dashboards'],
                    ['⬡', 'Collaboration', 'Unlimited teammates'],
                    ['◉', 'Automation', 'Visual workflow builder']
                ].map(([ic, t, d]) => `
                    <div style="padding:18px;border-radius:8px;border:1px solid ${bdr};background:${card}">
                        <div style="width:34px;height:34px;border-radius:8px;background:rgba(${rb},.14);color:${b};display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:12px">${ic}</div>
                        <b style="font-size:13px;display:block;margin-bottom:4px">${t}</b>
                        <span style="font-size:12px;color:${ts};line-height:1.6">${d}</span>
                    </div>
                `).join('')}
            </div>
        </div>`,
        
        dashboard: `<div style="background:${bg};color:${tm};display:grid;grid-template-columns:190px 1fr;min-height:360px;overflow:hidden;font-family:'Outfit',sans-serif">
            <div style="background:${card};border-right:1px solid ${bdr};padding:16px 0">
                <div style="padding:0 14px 14px;border-bottom:1px solid ${bdr};margin-bottom:12px"><b style="font-size:14px">WorkSpace</b><div style="font-size:11px;color:${ts};margin-top:2px">Welcome back 👋</div></div>
                ${[
                    ['◈ Overview', 1],
                    ['⬡ Analytics', 0],
                    ['◉ Projects', 0],
                    ['⬢ Revenue', 0],
                    ['◎ Settings', 0]
                ].map(([l, a]) => `
                    <div style="padding:8px 14px;font-size:12px;cursor:pointer;${a ? `color:${b};background:rgba(${rb},.1);border-left:3px solid ${b};font-weight:600;` : `color:${ts};`}">${l}</div>
                `).join('')}
                <div style="margin:12px 12px 0;padding:10px;background:rgba(${rb},.08);border-radius:6px;border:1px solid rgba(${rb},.15)">
                    <div style="font-size:9px;font-weight:700;color:${b};text-transform:uppercase;letter-spacing:1px;margin-bottom:3px">Pro Plan</div>
                    <div style="height:3px;background:rgba(${rb},.15);border-radius:2px;margin-top:6px"><div style="height:100%;width:65%;background:${b};border-radius:2px"></div></div>
                </div>
            </div>
            <div style="padding:18px">
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:14px">
                    ${[
                        ['MRR', '$48.2k', '↑ 12%'],
                        ['Users', '3,842', '↑ 8%'],
                        ['Churn', '1.2%', '↓ 0.3%'],
                        ['NPS', '74', '↑ 6']
                    ].map(([l, v, c]) => `
                        <div style="padding:12px;background:${card};border:1px solid ${bdr};border-radius:6px">
                            <div style="font-size:9px;color:${ts};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">${l}</div>
                            <div style="font-size:20px;font-weight:800;letter-spacing:-.5px;margin-bottom:2px">${v}</div>
                            <div style="font-size:10px;color:#4ade80">${c}</div>
                        </div>
                    `).join('')}
                </div>
                <div style="display:grid;grid-template-columns:3fr 2fr;gap:10px">
                    <div style="background:${card};border:1px solid ${bdr};border-radius:6px;padding:14px">
                        <b style="font-size:11px;display:block;margin-bottom:12px">Revenue</b>
                        <div style="display:flex;align-items:flex-end;gap:4px;height:72px">
                            ${[38, 58, 45, 82, 55, 72, 94, 68, 80, 50, 88, 65].map((v, i) =>
                                `<div style="flex:1;background:${i === 10 ? b : `rgba(${rb},.2)`};border-radius:2px 2px 0 0;height:${v}%"></div>`
                            ).join('')}
                        </div>
                        <div style="display:flex;justify-content:space-between;margin-top:4px;font-size:9px;color:${ts}">
                            <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                        </div>
                    </div>
                    <div style="background:${card};border:1px solid ${bdr};border-radius:6px;padding:14px">
                        <b style="font-size:11px;display:block;margin-bottom:10px">Traffic</b>
                        ${[
                            ['Organic', 42, b],
                            ['Paid', 28, comp],
                            ['Direct', 18, tri],
                            ['Social', 12, tri2]
                        ].map(([l, p, c]) => `
                            <div style="margin-bottom:8px">
                                <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px">
                                    <span style="color:${ts}">${l}</span><b>${p}%</b>
                                </div>
                                <div style="height:3px;background:${bdr};border-radius:2px">
                                    <div style="height:100%;width:${p}%;background:${c};border-radius:2px"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>`,
        
        ecommerce: `<div style="background:${bg};color:${tm};padding:22px;font-family:'Outfit',sans-serif">
            <nav style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid ${bdr}">
                <b style="font-size:18px;text-transform:uppercase;letter-spacing:2px">SHOP<span style="color:${b}">×</span>CO</b>
                <div style="display:flex;gap:16px;font-size:12px;color:${ts}"><span>New In</span><span>Women</span><span>Men</span><span style="color:${b};font-weight:700">Sale 🔥</span></div>
                <div style="display:flex;gap:12px;font-size:14px"><span>🔍</span><span>♡</span><span style="position:relative">🛒<span style="position:absolute;top:-6px;right:-6px;background:${b};color:${tc};width:14px;height:14px;border-radius:50%;font-size:9px;display:inline-flex;align-items:center;justify-content:center;font-weight:700">3</span></span></div>
            </nav>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
                ${[
                    ['Minimal Tee', '$29', '👕', 0],
                    ['Cargo Pants', '$89', '👖', 1],
                    ['Canvas Jacket', '$149', '🧥', 2],
                    ['Linen Shirt', '$59', '👔', 3]
                ].map(([n, p, ic, i]) => `
                    <div>
                        <div style="height:120px;background:${mc[i] || b};border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:34px;margin-bottom:10px;position:relative">
                            ${ic}${i === 0 ? `<div style="position:absolute;top:8px;left:8px;background:${b};color:${tc};padding:2px 8px;border-radius:3px;font-size:9px;font-weight:700">BEST</div>` : ''}
                        </div>
                        <b style="font-size:12px;display:block;margin-bottom:3px">${n}</b>
                        <b style="font-size:13px;color:${b}">${p}</b>
                    </div>
                `).join('')}
            </div>
        </div>`,
        
        blog: `<div style="background:${bg};color:${tm};padding:22px;font-family:'Outfit',sans-serif">
            <nav style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:12px;border-bottom:1px solid ${bdr}">
                <b style="font-size:18px;font-family:Georgia,serif">The<span style="color:${b}">Post</span></b>
                <div style="display:flex;gap:16px;font-size:12px;color:${ts}"><span>Design</span><span>Tech</span><span>Culture</span></div>
                <button style="background:${b};color:${tc};border:none;padding:6px 14px;border-radius:4px;font-size:12px;font-weight:700">Subscribe</button>
            </nav>
            <div style="display:grid;grid-template-columns:3fr 2fr;gap:22px">
                <div>
                    <div style="height:140px;background:linear-gradient(135deg,${b},${comp});border-radius:6px;margin-bottom:16px;display:flex;align-items:flex-end;padding:14px"><span style="background:rgba(0,0,0,.65);color:#fff;padding:3px 10px;border-radius:3px;font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Design</span></div>
                    <h2 style="font-size:20px;font-weight:800;line-height:1.2;margin-bottom:10px;font-family:Georgia,serif">The Color Theory Revolution: Rethinking Palettes in 2025</h2>
                    <p style="font-size:12px;color:${ts};line-height:1.75;margin-bottom:12px">For years, designers played it safe. A new generation is embracing bold, emotionally resonant color choices.</p>
                    <div style="display:flex;align-items:center;gap:8px;font-size:11px;color:${ts}"><div style="width:24px;height:24px;border-radius:50%;background:${b};display:flex;align-items:center;justify-content:center;color:${tc};font-weight:700;font-size:10px">A</div>Alex Rivera · Mar 19 · 6 min read</div>
                </div>
                <div>
                    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${ts};margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid ${bdr}">Trending</div>
                    ${[
                        ['Why Less Is More', '2 min'],
                        ['Brutalism Returns', '5 min'],
                        ['Color in 2025', '4 min']
                    ].map(([t, time]) => `
                        <div style="padding:9px 0;border-bottom:1px solid ${bdr};cursor:pointer">
                            <b style="font-size:12px;line-height:1.3;display:block;margin-bottom:2px">${t}</b>
                            <span style="font-size:10px;color:${ts}">${time} read</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`,
        
        saas: `<div style="background:${bg};color:${tm};font-family:'Outfit',sans-serif;min-height:320px">
            <div style="background:${card};border-bottom:1px solid ${bdr};padding:10px 18px;display:flex;align-items:center;gap:10px">
                ${['Files', 'Team', 'Inbox', 'Settings'].map((l, i) => `
                    <div style="padding:5px 12px;border-radius:4px;font-size:12px;font-weight:500;${i === 0 ? `background:rgba(${rb},.12);color:${b};` : `color:${ts};`}">${l}</div>
                `).join('')}
                <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
                    <div style="background:${bg};border:1px solid ${bdr};border-radius:4px;padding:4px 10px;font-size:11px;color:${ts}">🔍 Search…</div>
                    <div style="width:26px;height:26px;border-radius:50%;background:${b};color:${tc};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700">U</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:190px 1fr;min-height:260px">
                <div style="background:${card};border-right:1px solid ${bdr};padding:12px">
                    <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:${ts};margin-bottom:8px">Workspaces</div>
                    ${['Design System', 'Marketing', 'Mobile App'].map((l, i) => `
                        <div style="display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:4px;cursor:pointer;margin-bottom:2px;${i === 0 ? `background:rgba(${rb},.1);color:${b};` : `color:${ts};`}">
                            <div style="width:6px;height:6px;border-radius:50%;background:${[b, comp, tri][i]};flex-shrink:0"></div>
                            <span style="font-size:12px">${l}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="padding:18px">
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
                        ${['Design System', 'Brand Assets', 'Components'].map((t, i) => `
                            <div style="border:1px solid ${bdr};border-radius:6px;overflow:hidden;cursor:pointer">
                                <div style="height:80px;background:${mc[i] || b};display:flex;align-items:center;justify-content:center;font-size:24px">📁</div>
                                <div style="padding:9px 12px;background:${card}">
                                    <b style="font-size:11px">${t}</b>
                                    <div style="font-size:10px;color:${ts};margin-top:1px">Updated 2h ago</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>`,
        
        portfolio: `<div style="background:${bg};color:${tm};padding:28px;font-family:'Outfit',sans-serif">
            <nav style="display:flex;align-items:center;justify-content:space-between;margin-bottom:40px">
                <b style="font-size:16px">Alex<span style="color:${b}">.</span></b>
                <div style="display:flex;gap:22px;font-size:12px;color:${ts}"><span>Work</span><span>About</span><span>Lab</span><b style="color:${tm}">Contact</b></div>
            </nav>
            <div style="margin-bottom:36px">
                <div style="font-size:10px;font-weight:700;color:${b};text-transform:uppercase;letter-spacing:2px;margin-bottom:12px">Product Designer & Developer</div>
                <h1 style="font-size:38px;font-weight:800;line-height:1.05;letter-spacing:-2px;margin-bottom:12px">I craft digital<br><span style="color:${b}">experiences</span> that matter.</h1>
                <div style="display:flex;gap:10px"><button style="background:${b};color:${tc};border:none;padding:10px 22px;border-radius:5px;font-weight:700;font-size:13px">View work →</button><button style="background:none;color:${tm};border:1px solid ${bdr};padding:10px 22px;border-radius:5px;font-size:13px">Resume ↓</button></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
                ${[b, comp, tri].map((c, i) => `
                    <div style="border-radius:6px;overflow:hidden;border:1px solid ${bdr};cursor:pointer">
                        <div style="height:90px;background:${c};display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:${ton(c)}">0${i + 1}</div>
                        <div style="padding:10px;background:${card}">
                            <b style="font-size:12px">Project ${['Alpha', 'Beta', 'Gamma'][i]}</b>
                            <div style="font-size:10px;color:${ts};margin-top:2px">UI Design · Dev</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`
    };
    
    document.getElementById('prevBody').innerHTML = `<div class="pane active">${prevs[PREV] || prevs.landing}</div>`;
}

/* ════════════════════════════════════════════
   COLOR INFO / PSYCH / CONTRAST
════════════════════════════════════════════ */

function renderColorInfo() {
    const { r, g, b } = h2r(BASE);
    const { h, s, l } = r2hs(r, g, b);
    
    document.getElementById('colorInfoCard').innerHTML = `
        <div class="info-swatch" style="background:${BASE}"></div>
        <div class="info-grid">
            <div class="info-cell" onclick="copy('${BASE}')">
                <div class="info-cell-lbl">HEX</div>
                <div class="info-cell-val">${BASE}</div>
            </div>
            <div class="info-cell" onclick="copy('rgb(${r},${g},${b})')">
                <div class="info-cell-lbl">RGB</div>
                <div class="info-cell-val">${r}, ${g}, ${b}</div>
            </div>
            <div class="info-cell" onclick="copy('hsl(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%)')">
                <div class="info-cell-lbl">HSL</div>
                <div class="info-cell-val">${Math.round(h)}°, ${Math.round(s)}%, ${Math.round(l)}%</div>
            </div>
            <div class="info-cell">
                <div class="info-cell-lbl">Luminance</div>
                <div class="info-cell-val">${lum(BASE).toFixed(3)}</div>
            </div>
        </div>
    `;
    
    const p = getPsych(BASE);
    document.getElementById('psychCard').innerHTML = `
        <div style="font-family:var(--fd);font-size:18px;color:var(--ac);margin-bottom:10px;letter-spacing:.5px">${p.mood}</div>
        <div style="font-size:12px;color:var(--tx2);line-height:1.65;margin-bottom:12px">${p.tip}</div>
        <div style="display:flex;flex-wrap:wrap;gap:5px">
            ${p.industries.map(i => `<span style="padding:3px 10px;border-radius:20px;font-size:11px;border:1px solid ${BASE};color:${BASE}">${i}</span>`).join('')}
        </div>
    `;
    
    const ratios = [
        [BASE, '#fff', 'Base / White'],
        [BASE, '#000', 'Base / Black'],
        ['#fff', BASE, 'White / Base']
    ];
    
    document.getElementById('contrastQuick').innerHTML = ratios.map(([fg, bg, l]) => {
        const r = cr(fg, bg);
        const aa = r >= 4.5;
        return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--br)">
                <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:28px;height:18px;background:${bg};border:1px solid var(--br);border-radius:3px;display:flex;align-items:center;justify-content:center"><span style="color:${fg};font-size:9px;font-weight:700">Aa</span></div>
                    <span style="font-size:11px;color:var(--tx2)">${l}</span>
                </div>
                <div style="display:flex;align-items:center;gap:5px">
                    <span style="font-family:var(--fm);font-size:11px;font-weight:700;color:${aa ? 'var(--green)' : 'var(--red)'}">${r.toFixed(1)}:1</span>
                    <span class="${aa ? 'wcag wpass' : 'wcag wfail'}">${aa ? 'AA ✓' : 'AA ✗'}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getPsych(hex) {
    const { h, s } = r2hs(...Object.values(h2r(hex)));
    
    if (s < 15) return {
        mood: 'Neutral & Balanced',
        industries: ['Corporate', 'Finance', 'Tech'],
        tip: 'Use as a foundation. Pair with a bold accent for impact.'
    };
    if (h < 20 || h >= 330) return {
        mood: 'Passionate & Urgent',
        industries: ['Food', 'Sport', 'Fashion'],
        tip: 'Commands attention instantly. Use as a powerful accent color.'
    };
    if (h < 45) return {
        mood: 'Warm & Optimistic',
        industries: ['Food', 'Retail', 'Lifestyle'],
        tip: 'Great for CTAs. High energy — avoid covering large areas.'
    };
    if (h < 75) return {
        mood: 'Cheerful & Creative',
        industries: ['Design', 'Media', 'Kids'],
        tip: 'Highest visibility. Perfect for interactive elements and buttons.'
    };
    if (h < 150) return {
        mood: 'Fresh & Trustworthy',
        industries: ['Health', 'Wellness', 'Finance'],
        tip: 'Universal trust signal. Balance with warm tones to avoid sterility.'
    };
    if (h < 195) return {
        mood: 'Calm & Clear',
        industries: ['SaaS', 'Healthcare', 'Tech'],
        tip: 'Excellent for large surfaces. Add dark shades for visual hierarchy.'
    };
    if (h < 255) return {
        mood: 'Reliable & Professional',
        industries: ['Tech', 'Finance', 'Corporate'],
        tip: 'Builds trust effortlessly. Pair with warm off-whites for depth.'
    };
    if (h < 300) return {
        mood: 'Creative & Luxurious',
        industries: ['Beauty', 'Luxury', 'Creative'],
        tip: 'Premium quality signal. Dark shades feel sophisticated and modern.'
    };
    return {
        mood: 'Romantic & Refined',
        industries: ['Beauty', 'Lifestyle', 'Wellness'],
        tip: 'Modern and youthful. Light tints make elegant backgrounds.'
    };
}

/* ════════════════════════════════════════════
   LOGO GRID
════════════════════════════════════════════ */

function renderLogoGrid() {
    const opts = [
        { bg: BASE, fg: ton(BASE), use: 'Primary Brand', note: 'Base as main fill' },
        { bg: SCHEMES.complementary[1], fg: ton(SCHEMES.complementary[1]), use: 'Complementary', note: 'Bold contrast pair' },
        { bg: '#111', fg: BASE, use: 'Dark + Accent', note: 'Premium & timeless' },
        { bg: '#f5f2eb', fg: BASE, use: 'Light + Accent', note: 'Clean & versatile' }
    ];
    
    document.getElementById('logoGrid').innerHTML = opts.map(o => `
        <div class="logo-card" onclick="copy('${o.bg}')">
            <div class="logo-use">${o.use}</div>
            <div class="logo-mark" style="background:${o.bg};color:${o.fg}">Aa</div>
            <div style="font-size:11px;color:var(--tx2);margin-bottom:5px;line-height:1.4">${o.note}</div>
            <div class="logo-hex">${o.bg}</div>
        </div>
    `).join('');
}

/* ════════════════════════════════════════════
   QUICK EXPORT
════════════════════════════════════════════ */

function renderQuickExport() {
    const mc = SCHEMES.monochromatic;
    const comp = SCHEMES.complementary[1];
    
    const css = `:root {\n  --primary: ${BASE};\n  --comp: ${comp};\n${mc.map((c, i) => `  --scale-${(i + 1) * 100}: ${c};`).join('\n')}\n}`;
    const scss = `$primary: ${BASE};\n$comp: ${comp};\n${mc.map((c, i) => `$scale-${(i + 1) * 100}: ${c};`).join('\n')}`;
    const json = JSON.stringify({
        primary: BASE,
        comp,
        scale: Object.fromEntries(mc.map((c, i) => [(i + 1) * 100, c]))
    }, null, 2);
    
    document.getElementById('quickExportGrid').innerHTML = [
        ['CSS Variables', css, 'Copy CSS'],
        ['SCSS Variables', scss, 'Copy SCSS'],
        ['JSON Tokens', json, 'Copy JSON']
    ].map(([title, code, lbl]) => `
        <div class="card">
            <div class="card-hdr"><span class="card-ttl">${title}</span><button class="btn btn-g btn-sm" onclick="copy(${JSON.stringify(code)})">${lbl}</button></div>
            <div class="card-body"><pre class="qe-code">${code}</pre></div>
        </div>
    `).join('');
}

/* ════════════════════════════════════════════
   AI SUGGEST FUNCTION - ADD THIS AT THE END!
════════════════════════════════════════════ */

async function openAISuggest() {
    const concept = window.prompt('Describe the palette you want (e.g., "warm sunset for a wellness brand"):', 'moody ocean blues for a tech startup');
    if (!concept) return;
    
    toast('🎨 AI is crafting your palette...', 'in');
    
    try {
        // Try ColorFolio API first
        const response = await fetch('https://colormagic.app/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                input: concept,
                count: 1
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const hex = data.colors?.[0] || data.hex || '#e8a020';
            syncAllColorUIs(hex);
            document.getElementById('forgeHex').value = hex;
            forge();
            toast(`✨ AI generated palette using ColorFolio!`, 'ok');
            return;
        }
        
        throw new Error('ColorFolio failed');
        
    } catch (e) {
        // Fallback to Pollinations
        try {
            const response = await fetch(`https://text.pollinations.ai/Suggest a perfect base hex color for: ${concept}. Return ONLY the hex code like #3a7bd5, nothing else.`);
            const text = await response.text();
            const hex = text.match(/#[0-9a-fA-F]{6}/)?.[0];
            
            if (hex) {
                syncAllColorUIs(hex);
                document.getElementById('forgeHex').value = hex;
                forge();
                toast(`✨ AI generated palette using Pollinations!`, 'ok');
                return;
            }
        } catch (e2) {
            // Final fallback
            toast('⚠️ Using random color', 'er');
            randomColor();
        }
    }
}