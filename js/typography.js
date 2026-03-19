/* ════════════════════════════════════════════
   TYPOGRAPHY PAGE
════════════════════════════════════════════ */

function renderTypo() {
    document.getElementById('typoList').innerHTML = FONTS.map(f => `
        <div class="typo-card">
            <div class="typo-hdr">
                <div>
                    <div class="section-label">${f.l}</div>
                    <div style="display:flex;gap:5px;flex-wrap:wrap">
                        ${f.tags.map(t => `<span class="badge ba">${t}</span>`).join('')}
                    </div>
                </div>
                <div style="display:flex;gap:6px">
                    <button class="btn btn-g btn-sm" onclick="copy('font-family: \\'${f.h}\\', serif;')">Copy Heading</button>
                    <button class="btn btn-g btn-sm" onclick="copy('font-family: \\'${f.b}\\', sans-serif;')">Copy Body</button>
                </div>
            </div>
            <div class="typo-body">
                <div style="font-family:'${f.h}',Georgia,serif;font-size:30px;font-weight:700;color:var(--ac);margin-bottom:6px;line-height:1.2">${f.h}</div>
                <div style="font-family:'${f.b}',sans-serif;font-size:14px;color:var(--tx2);line-height:1.75;margin-bottom:14px">
                    The quick brown fox jumps over the lazy dog. Body copy should be eminently readable at any size — this pairing works beautifully for web and print alike.
                </div>
                <div style="display:flex;gap:8px">
                    <span class="badge bb">${f.h} — Headings</span>
                    <span class="badge bg">${f.b} — Body</span>
                </div>
            </div>
        </div>
    `).join('');
}