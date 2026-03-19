/* ════════════════════════════════════════════
   COLOR MATH
════════════════════════════════════════════ */

// Hex to RGB
const h2r = h => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16)
    };
};

// RGB to Hex
const r2h = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');

// RGB to HSL
const r2hs = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    let h, s, l = (mx + mn) / 2;
    
    if (mx === mn) {
        h = s = 0;
    } else {
        const d = mx - mn;
        s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
        switch (mx) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
};

// HSL to RGB
const hs2r = (h, s, l) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    
    if (!s) {
        r = g = b = l;
    } else {
        const f = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = f(p, q, h + 1 / 3);
        g = f(p, q, h);
        b = f(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

// HSL to Hex
const hh = (h, s, l) => {
    const { r, g, b } = hs2r(h, s, l);
    return r2h(r, g, b);
};

// Clamp value between min and max
const cl = (v, a = 5, b = 95) => Math.max(a, Math.min(b, v));

// Luminance (relative brightness)
const lum = h => {
    const { r, g, b } = h2r(h);
    return [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
};

// Contrast ratio (WCAG)
const cr = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

// Check if color is dark
const isDark = h => lum(h) < 0.35;

// Get contrasting text color (black or white)
const ton = h => isDark(h) ? '#ffffff' : '#000000';

// Mix two colors by percentage
const mixC = (a, b, t) => {
    const x = h2r(a), y = h2r(b);
    return r2h(
        x.r + (y.r - x.r) * t,
        x.g + (y.g - x.g) * t,
        x.b + (y.b - x.b) * t
    );
};

// Generate color schemes from base hex
function makeSchemes(hex) {
    const { r, g, b } = h2r(hex);
    const { h, s, l } = r2hs(r, g, b);
    
    return {
        complementary: [
            hex,
            hh((h + 180) % 360, s, l),
            hh((h + 180) % 360, cl(s * 0.7), cl(l * 1.2)),
            hh(h, cl(s * 0.45), cl(l * 1.45)),
            hh((h + 180) % 360, cl(s * 0.3), cl(l * 1.65))
        ],
        'split-comp': [
            hex,
            hh((h + 150) % 360, s, l),
            hh((h + 210) % 360, s, l),
            hh((h + 150) % 360, cl(s * 0.7), cl(l * 1.3)),
            hh((h + 210) % 360, cl(s * 0.5), cl(l * 0.7))
        ],
        triadic: [
            hex,
            hh((h + 120) % 360, s, l),
            hh((h + 240) % 360, s, l),
            hh((h + 120) % 360, cl(s * 0.7), cl(l * 1.3)),
            hh((h + 240) % 360, cl(s * 0.5), cl(l * 0.7))
        ],
        analogous: [
            hh((h + 30) % 360, s, l),
            hh((h + 15) % 360, s, l),
            hex,
            hh((h - 15 + 360) % 360, s, l),
            hh((h - 30 + 360) % 360, s, l)
        ],
        monochromatic: [
            hh(h, s, cl(l * 0.4)),
            hh(h, s, cl(l * 0.65)),
            hex,
            hh(h, cl(s * 0.7), cl(l * 1.35)),
            hh(h, cl(s * 0.35), cl(l * 1.65))
        ]
    };
}