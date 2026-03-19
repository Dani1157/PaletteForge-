/* ════════════════════════════════════════════
   EXPORT PAGE
════════════════════════════════════════════ */

function buildExportPage() {
    document.getElementById('efGrid').innerHTML = EF.map(f => `
        <div class="ef-card ${f.id === currentExportFmt ? 'sel' : ''}" onclick="selectExport('${f.id}')">
            <div class="ef-icon">${f.icon}</div>
            <div class="ef-name">${f.name}</div>
            <div class="ef-desc">${f.desc}</div>
        </div>
    `).join('');
    
    selectExport(currentExportFmt, false);
}
function selectExport(fmt, notify = true) {
    currentExportFmt = fmt;
    
    document.querySelectorAll('.ef-card').forEach((c, i) => {
        c.classList.toggle('sel', EF[i].id === fmt);
    });
    
    // 🛡️ ADD THIS SAFETY CHECK
    if (!BASE || !SCHEMES) {
        document.getElementById('exportOut').textContent = 'Forge a palette first to see export code.';
        return;
    }
    
    const mc = SCHEMES.monochromatic;
    const comp = SCHEMES.complementary[1];
    


    
    const outputs = {
        css: `:root {\n  /* PaletteForge — ${BASE} */\n  --color-primary: ${BASE};\n  --color-comp: ${comp};\n${mc.map((c, i) => `  --color-scale-${(i + 1) * 100}: ${c};`).join('\n')}\n  /* Analogous */\n${SCHEMES.analogous.map((c, i) => `  --color-analog-${i + 1}: ${c};`).join('\n')}\n}`,
        
        scss: `// PaletteForge Export — ${BASE}\n$primary: ${BASE};\n$comp: ${comp};\n\n$scale: (\n${mc.map((c, i) => `  ${(i + 1) * 100}: ${c},`).join('\n')}\n);\n\n// Usage: map-get($scale, 300)\n@each $k, $v in $scale {\n  .color-#{$k} { color: $v; }\n  .bg-#{$k} { background-color: $v; }\n}`,
        
        tw: `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n          DEFAULT: '${BASE}',\n          comp: '${comp}',\n${mc.map((c, i) => `          '${(i + 1) * 100}': '${c}',`).join('\n')}\n        }\n      }\n    }\n  }\n}`,
        
        json: JSON.stringify({
            $schema: 'https://design-tokens.github.io/community-group/format/',
            color: {
                primary: { $value: BASE, $type: 'color' },
                comp: { $value: comp, $type: 'color' },
                ...Object.fromEntries(mc.map((c, i) => [`scale${(i + 1) * 100}`, { $value: c, $type: 'color' }]))
            }
        }, null, 2),
        
        figma: `/* Paste into Figma Token Plugin */\nPrimary:         ${BASE}\nComp:            ${comp}\n${mc.map((c, i) => `Scale/${(i + 1) * 100}:       ${c}`).join('\n')}\n\n/* Figma RGB Values */\n${[BASE, comp, ...mc].map(c => {
            const { r, g, b } = h2r(c);
            return `${c}  →  rgb(${r}, ${g}, ${b})`;
        }).join('\n')}`,
        
        android: `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <!-- PaletteForge Export -->\n    <color name="color_primary">${BASE}</color>\n    <color name="color_comp">${comp}</color>\n${mc.map((c, i) => `    <color name="color_scale_${(i + 1) * 100}">${c}</color>`).join('\n')}\n</resources>`
    };
    
    document.getElementById('exportOut').textContent = outputs[fmt] || '';
}

function copyExport() {
    copy(document.getElementById('exportOut').textContent);
}