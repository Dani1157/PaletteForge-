/* ════════════════════════════════════════════
   ULTIMATE AI TEMPLATE GENERATOR - OP EDITION
════════════════════════════════════════════ */

// Template Generator State
let generatedTemplateCode = '';
let previewMode = 'desktop';
let savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
let currentTemplateId = Date.now();
let templateHistory = JSON.parse(localStorage.getItem('templateHistory') || '[]');

// ============================================
// OPEN TEMPLATE GENERATOR
// ============================================

function openTemplateGenerator() {
    let modal = document.getElementById('templateGeneratorModal');
    
    if (modal) {
        modal.classList.add('open');
        loadSavedTemplatesList();
    } else {
        createTemplateGeneratorModal();
    }
}

// ============================================
// CREATE THE MODAL (ULTIMATE EDITION)
// ============================================

function createTemplateGeneratorModal() {
    const modalHTML = `
    <div class="overlay" id="templateGeneratorModal">
        <div class="modal" style="max-width:1400px; width:95%; height:95vh;">
            <div class="modal-hdr">
                <div class="modal-ttl">🚀 ULTIMATE AI Template Studio</div>
                <button class="modal-x" onclick="closeOverlay('templateGeneratorModal')">✕</button>
            </div>
            <div class="modal-body" style="height:calc(100% - 130px); overflow:hidden; padding:20px;">
                
                <!-- TOP BAR - AI Model Selector -->
                <div style="display:flex; gap:10px; margin-bottom:20px; padding:10px; background:var(--s2); border-radius:var(--r2); align-items:center; flex-wrap:wrap;">
                    <span class="badge ba" style="font-size:12px;">🤖 AI Model:</span>
                    <select id="aiModelSelect" class="sel" style="width:200px;">
                        <option value="claude">Claude 3.7 (Best for templates)</option>
                        <option value="gpt4">GPT-4 Turbo (Creative)</option>
                        <option value="gemini">Gemini Pro (Fast)</option>
                        <option value="local" selected>PaletteForge AI (Local - No API)</option>
                        <option value="mixtral">Mixtral 8x7B (Open Source)</option>
                    </select>
                    
                    <span class="badge bg" style="font-size:12px;">🎨 Quality:</span>
                    <select id="qualitySelect" class="sel" style="width:150px;">
                        <option value="draft">Draft (Fast)</option>
                        <option value="standard" selected>Standard</option>
                        <option value="premium">Premium (Detailed)</option>
                        <option value="enterprise">Enterprise (Complex)</option>
                    </select>
                    
                    <span class="badge bb" style="font-size:12px;">📱 Device:</span>
                    <div style="display:flex; gap:5px; margin-left:10px;">
                        <button class="tbtn ${previewMode === 'mobile' ? 'active' : ''}" onclick="setPreviewMode('mobile')" title="Mobile">📱</button>
                        <button class="tbtn ${previewMode === 'tablet' ? 'active' : ''}" onclick="setPreviewMode('tablet')" title="Tablet">📟</button>
                        <button class="tbtn ${previewMode === 'desktop' ? 'active' : ''}" onclick="setPreviewMode('desktop')" title="Desktop">💻</button>
                    </div>
                    
                    <div style="margin-left:auto; display:flex; gap:5px;">
                        <button class="btn btn-s btn-sm" onclick="clearAllTemplates()" title="Clear history">🗑️ Clear</button>
                    </div>
                </div>
                
                <!-- MAIN GRID - 3 COLUMNS -->
                <div style="display:grid; grid-template-columns:1.5fr 2fr 1fr; gap:20px; height:calc(100% - 80px);">
                    
                    <!-- COLUMN 1: INPUT & SETTINGS -->
                    <div style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
                        <h3 style="margin-bottom:15px; font-family:var(--fd);">🎯 Describe Your Dream Template</h3>
                        
                        <div style="margin-bottom:15px;">
                            <textarea id="templatePrompt" rows="6" style="width:100%; padding:12px; background:var(--s2); border:1px solid var(--br); color:var(--tx); border-radius:var(--r2); font-family:var(--fn); resize:none;" placeholder="Be specific! Example: Create a modern SaaS landing page for a project management tool called 'TaskFlow' with hero section, 4 features, pricing table, testimonials, and contact form. Use blue and white colors. Make it look like Stripe's website."></textarea>
                        </div>
                        
                        <!-- QUICK PRESETS -->
                        <div style="margin-bottom:15px;">
                            <span class="section-label">📋 Quick Presets</span>
                            <div style="display:flex; gap:5px; flex-wrap:wrap; margin-top:5px;">
                                <button class="btn btn-g btn-sm" onclick="loadPreset('saas')">SaaS</button>
                                <button class="btn btn-g btn-sm" onclick="loadPreset('portfolio')">Portfolio</button>
                                <button class="btn btn-g btn-sm" onclick="loadPreset('ecommerce')">E-Commerce</button>
                                <button class="btn btn-g btn-sm" onclick="loadPreset('agency')">Agency</button>
                                <button class="btn btn-g btn-sm" onclick="loadPreset('blog')">Blog</button>
                                <button class="btn btn-g btn-sm" onclick="loadPreset('dashboard')">Dashboard</button>
                                <button class="btn btn-g btn-sm" onclick="loadPreset('landing')">Landing</button>
                            </div>
                        </div>
                        
                        <!-- ADVANCED SETTINGS -->
                        <div style="background:var(--s2); border-radius:var(--r2); padding:15px; margin-bottom:15px;">
                            <h4 style="margin-bottom:10px; font-size:14px;">⚙️ Advanced Settings</h4>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                                <div>
                                    <span class="section-label">Primary Color</span>
                                    <div style="display:flex; gap:5px; align-items:center;">
                                        <div class="color-well" style="width:30px; height:30px; background:${BASE};">
                                            <input type="color" id="templatePrimaryColor" value="${BASE}" onchange="updateColorPreview()">
                                        </div>
                                        <input type="text" id="primaryHex" value="${BASE}" class="inp mono" style="width:80px;">
                                    </div>
                                </div>
                                <div>
                                    <span class="section-label">Secondary Color</span>
                                    <div style="display:flex; gap:5px; align-items:center;">
                                        <div class="color-well" style="width:30px; height:30px; background:${SCHEMES?.complementary?.[1] || '#2C3E50'};">
                                            <input type="color" id="templateSecondaryColor" value="${SCHEMES?.complementary?.[1] || '#2C3E50'}" onchange="updateColorPreview()">
                                        </div>
                                        <input type="text" id="secondaryHex" value="${SCHEMES?.complementary?.[1] || '#2C3E50'}" class="inp mono" style="width:80px;">
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                                <div>
                                    <span class="section-label">Accent Color</span>
                                    <div style="display:flex; gap:5px; align-items:center;">
                                        <div class="color-well" style="width:30px; height:30px; background:${SCHEMES?.triadic?.[1] || '#FF6B6B'};">
                                            <input type="color" id="templateAccentColor" value="${SCHEMES?.triadic?.[1] || '#FF6B6B'}" onchange="updateColorPreview()">
                                        </div>
                                        <input type="text" id="accentHex" value="${SCHEMES?.triadic?.[1] || '#FF6B6B'}" class="inp mono" style="width:80px;">
                                    </div>
                                </div>
                                <div>
                                    <span class="section-label">Font Style</span>
                                    <select id="fontStyle" class="sel">
                                        <option value="modern">Modern (Inter)</option>
                                        <option value="classic">Classic (Georgia)</option>
                                        <option value="tech">Tech (Roboto)</option>
                                        <option value="elegant">Elegant (Playfair)</option>
                                        <option value="playful">Playful (Comic Sans)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div style="display:flex; gap:10px; margin-top:10px;">
                                <label style="display:flex; align-items:center; gap:5px;">
                                    <input type="checkbox" id="darkMode" checked> 🌙 Dark Mode Support
                                </label>
                                <label style="display:flex; align-items:center; gap:5px;">
                                    <input type="checkbox" id="animations" checked> ✨ Animations
                                </label>
                                <label style="display:flex; align-items:center; gap:5px;">
                                    <input type="checkbox" id="responsive" checked> 📱 Fully Responsive
                                </label>
                            </div>
                        </div>
                        
                        <!-- GENERATE BUTTONS -->
                        <div style="display:flex; gap:10px; margin-bottom:15px;">
                            <button class="btn btn-p" onclick="generateUltimateTemplate()" style="flex:2; padding:15px;">
                                🚀 GENERATE ULTIMATE TEMPLATE
                            </button>
                            <button class="btn btn-s" onclick="enhanceTemplate()" title="Enhance current template">
                                ✨ Enhance
                            </button>
                            <button class="btn btn-s" onclick="regenerateTemplate()" title="Regenerate">
                                🔄 Regenerate
                            </button>
                        </div>
                        
                        <!-- GENERATED CODE SECTION -->
                        <div style="flex:1; overflow:hidden; display:flex; flex-direction:column; margin-top:10px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                                <span class="section-label">📄 Generated Code (HTML/CSS/JS)</span>
                                <div>
                                    <button class="btn btn-g btn-sm" onclick="copyTemplateCode()" title="Copy to clipboard">📋 Copy</button>
                                    <button class="btn btn-g btn-sm" onclick="downloadTemplateCode()" title="Download HTML">⬇ Download</button>
                                    <button class="btn btn-g btn-sm" onclick="saveTemplate()" title="Save to collection">💾 Save</button>
                                </div>
                            </div>
                            <pre id="generatedCodeDisplay" style="background:var(--bg2); border:1px solid var(--br); border-radius:var(--r2); padding:15px; overflow:auto; flex:1; font-family:var(--fm); font-size:12px; line-height:1.5; white-space:pre-wrap;">Click GENERATE to create an amazing template...</pre>
                        </div>
                    </div>
                    
                    <!-- COLUMN 2: LIVE PREVIEW -->
                    <div style="display:flex; flex-direction:column; height:100%; overflow:hidden;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                            <h3 style="font-family:var(--fd);">👁️ Live Preview</h3>
                            <div style="display:flex; gap:5px;">
                                <button class="btn btn-g btn-sm" onclick="refreshPreview()" title="Refresh preview">🔄</button>
                                <button class="btn btn-g btn-sm" onclick="openInNewTab()" title="Open in new tab">↗️</button>
                            </div>
                        </div>
                        
                        <!-- PREVIEW FRAME WITH DEVICE MOCKUP -->
                        <div id="previewContainer" style="flex:1; overflow:auto; background:white; border-radius:var(--r2); border:1px solid var(--br); padding:20px; transition:all 0.3s; display:flex; align-items:center; justify-content:center;">
                            <iframe id="livePreviewFrame" style="width:100%; height:100%; border:none; background:white; border-radius:var(--r2); box-shadow:0 10px 30px rgba(0,0,0,0.1);" srcdoc="<html><body style='font-family:sans-serif; display:flex; align-items:center; justify-content:center; height:100%; color:#666;'><div style='text-align:center;'><h2>✨ AI Template Studio</h2><p>Describe your dream template and click GENERATE</p><p style='color:#999; margin-top:20px;'>The preview will appear here instantly</p></div></body></html>"></iframe>
                        </div>
                        
                        <!-- QUICK STATS -->
                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px; margin-top:10px;">
                            <div class="card" style="padding:8px; text-align:center;">
                                <span class="badge ba">Lines</span>
                                <div id="codeLines">0</div>
                            </div>
                            <div class="card" style="padding:8px; text-align:center;">
                                <span class="badge bg">Size</span>
                                <div id="codeSize">0 KB</div>
                            </div>
                            <div class="card" style="padding:8px; text-align:center;">
                                <span class="badge bb">Components</span>
                                <div id="componentCount">0</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- COLUMN 3: SAVED TEMPLATES & HISTORY -->
                    <div style="display:flex; flex-direction:column; height:100%; overflow:hidden; border-left:1px solid var(--br); padding-left:20px;">
                        <h3 style="margin-bottom:15px; font-family:var(--fd);">💾 Saved Templates</h3>
                        
                        <!-- TABS -->
                        <div style="display:flex; border-bottom:1px solid var(--br); margin-bottom:15px;">
                            <button class="tab active" onclick="switchTemplateTab('saved', this)">📚 Saved</button>
                            <button class="tab" onclick="switchTemplateTab('history', this)">⏱️ History</button>
                            <button class="tab" onclick="switchTemplateTab('featured', this)">🌟 Featured</button>
                        </div>
                        
                        <!-- SAVED TEMPLATES LIST -->
                        <div id="savedTemplatesList" style="flex:1; overflow-y:auto; display:block;">
                            <!-- Will be populated by JavaScript -->
                        </div>
                        
                        <!-- HISTORY LIST (hidden by default) -->
                        <div id="historyTemplatesList" style="flex:1; overflow-y:auto; display:none;">
                            <!-- Will be populated by JavaScript -->
                        </div>
                        
                        <!-- FEATURED LIST (hidden by default) -->
                        <div id="featuredTemplatesList" style="flex:1; overflow-y:auto; display:none;">
                            <div class="coll-card" style="margin-bottom:10px;" onclick="loadFeaturedTemplate('saas')">
                                <div class="coll-swatches" style="height:30px;">
                                    <div style="flex:1; background:#4A90E2;"></div>
                                    <div style="flex:1; background:#2C3E50;"></div>
                                    <div style="flex:1; background:#FF6B6B;"></div>
                                </div>
                                <div class="coll-meta">
                                    <div class="coll-name">SaaS Pro Template</div>
                                    <div style="font-size:10px; color:var(--tx2);">Modern, 5 sections, responsive</div>
                                </div>
                            </div>
                            <div class="coll-card" style="margin-bottom:10px;" onclick="loadFeaturedTemplate('portfolio')">
                                <div class="coll-swatches" style="height:30px;">
                                    <div style="flex:1; background:#333;"></div>
                                    <div style="flex:1; background:#666;"></div>
                                    <div style="flex:1; background:#FFD700;"></div>
                                </div>
                                <div class="coll-meta">
                                    <div class="coll-name">Portfolio Creative</div>
                                    <div style="font-size:10px; color:var(--tx2);">Minimal, gallery, dark mode</div>
                                </div>
                            </div>
                            <div class="coll-card" style="margin-bottom:10px;" onclick="loadFeaturedTemplate('ecommerce')">
                                <div class="coll-swatches" style="height:30px;">
                                    <div style="flex:1; background:#FF6B6B;"></div>
                                    <div style="flex:1; background:#4ECDC4;"></div>
                                    <div style="flex:1; background:#45B7D1;"></div>
                                </div>
                                <div class="coll-meta">
                                    <div class="coll-name">Shopify Style</div>
                                    <div style="font-size:10px; color:var(--tx2);">Product grid, cart, reviews</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- COLLECTION STATS -->
                        <div style="margin-top:15px; padding:10px; background:var(--s2); border-radius:var(--r2);">
                            <div style="display:flex; justify-content:space-between;">
                                <span>📊 Total Templates:</span>
                                <span id="totalTemplates">${savedTemplates.length}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-top:5px;">
                                <span>⭐ Most Used:</span>
                                <span id="mostUsed">SaaS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    setTimeout(() => {
        const modal = document.getElementById('templateGeneratorModal');
        if (modal) {
            modal.classList.add('open');
            loadSavedTemplatesList();
            updateColorPreview();
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                }
            });
        }
    }, 100);
}

// ============================================
// LOAD PRESET PROMPTS
// ============================================

function loadPreset(type) {
    const presets = {
        saas: `Create a modern SaaS landing page for "CloudFlow" with:
- Hero section: "Scale Your Business with CloudFlow" with CTA button
- 4 feature cards with icons (Automation, Analytics, Security, Support)
- Pricing table with 3 tiers (Starter $29, Pro $79, Enterprise $199)
- Testimonials from 3 customers with photos
- FAQ accordion with 5 questions
- Contact form with name, email, message
- Footer with links and social media
Make it professional with blue gradient, fully responsive, with smooth animations.`,
        
        portfolio: `Create a creative portfolio for "Alex Rivera" photographer with:
- Full-screen hero with name and tagline "Capturing Moments"
- Gallery grid of 8 portfolio items with hover effects
- About section with bio and studio photo
- Services offered (Wedding, Portrait, Event, Commercial)
- Testimonials from 4 clients
- Contact form and Instagram feed preview
- Smooth scroll and lightbox for images
Make it minimalist with lots of whitespace and elegant typography.`,
        
        ecommerce: `Create an e-commerce product page for "UrbanStyle" clothing with:
- Header with logo, search, cart icon (with item count)
- Product image gallery with zoom on hover
- Product details: "Premium Hoodie" $89.99 with size selector (S, M, L, XL)
- Color options (Black, Gray, Navy)
- Add to cart button with quantity selector
- Product description, features, and care instructions
- Reviews section with 4 reviews and rating stars
- Related products grid with 4 items
- Recently viewed section
Make it modern with clean typography and smooth transitions.`,
        
        agency: `Create a bold agency website for "Digital Minds" with:
- Sticky header with logo and navigation (Work, Services, About, Contact)
- Hero with animated headline "We Build Brands That Matter"
- Services grid with 6 services (Branding, Web Design, Development, SEO, Marketing, Content)
- Case studies showcase with 3 projects (image, title, results)
- Team section with 6 members (photo, name, role, social)
- Client logos strip with 8 logos
- Contact form with project brief
- Footer with location map
Make it creative with purple accents and bold typography.`,
        
        blog: `Create a modern blog "TechDaily" with:
- Header with logo, categories (AI, Dev, Design, Business), search
- Featured post with large image, title, excerpt, read time
- Blog grid with 6 posts (image, category, title, date, author)
- Sidebar with popular posts, categories, newsletter
- Comments section on single post view
- Related posts at bottom
- Dark/light mode toggle
- Smooth infinite scroll loading
Make it clean and readable with good typography.`,
        
        dashboard: `Create an analytics dashboard "DataPulse" with:
- Sidebar navigation (Dashboard, Analytics, Reports, Settings, Users)
- Header with search, notifications, user profile
- 6 metric cards with trend indicators (Revenue, Users, Sessions, Bounce Rate, Conversion, Sales)
- Line chart for traffic overview (mock)
- Pie chart for traffic sources
- Recent orders table with 8 rows (ID, Customer, Amount, Status)
- Quick actions section
- Dark mode by default
Make it modern with glass morphism effects.`,
        
        landing: `Create a high-converting landing page for "LaunchPad" with:
- Hero section: "Launch Your Product in Days" with CTA
- Social proof with client logos (6 companies)
- 3 key benefits with icons
- How it works in 4 steps
- Features grid with 6 features
- Pricing comparison table
- FAQ section with 6 questions
- Urgency timer with countdown
- Footer with links
Make it conversion-focused with orange accent colors.`
    };
    
    document.getElementById('templatePrompt').value = presets[type] || presets.saas;
}

// ============================================
// SWITCH TEMPLATE TABS
// ============================================

function switchTemplateTab(tab, btn) {
    document.querySelectorAll('#templateGeneratorModal .tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    document.getElementById('savedTemplatesList').style.display = tab === 'saved' ? 'block' : 'none';
    document.getElementById('historyTemplatesList').style.display = tab === 'history' ? 'block' : 'none';
    document.getElementById('featuredTemplatesList').style.display = tab === 'featured' ? 'block' : 'none';
    
    if (tab === 'saved') loadSavedTemplatesList();
    if (tab === 'history') loadHistoryTemplatesList();
}

// ============================================
// LOAD SAVED TEMPLATES
// ============================================

function loadSavedTemplatesList() {
    const list = document.getElementById('savedTemplatesList');
    if (!list) return;
    
    savedTemplates = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    
    if (savedTemplates.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:40px; color:var(--tx2);">💾 No saved templates yet.<br>Generate and click 💾 Save</div>';
        return;
    }
    
    list.innerHTML = savedTemplates.map((tmpl, index) => `
        <div class="coll-card" style="margin-bottom:10px; position:relative;" onclick="loadTemplate(${index})">
            <div class="coll-swatches" style="height:30px;">
                <div style="flex:1; background:${tmpl.primary || '#4A90E2'};"></div>
                <div style="flex:1; background:${tmpl.secondary || '#2C3E50'};"></div>
                <div style="flex:1; background:${tmpl.accent || '#FF6B6B'};"></div>
            </div>
            <div class="coll-meta">
                <div class="coll-name">${tmpl.name || 'Untitled'}</div>
                <div style="font-size:10px; color:var(--tx2);">${tmpl.date || new Date().toLocaleDateString()} · ${tmpl.type || 'Custom'}</div>
            </div>
            <div style="position:absolute; top:5px; right:5px; display:flex; gap:2px;">
                <button class="btn btn-g btn-sm" style="padding:2px 5px;" onclick="event.stopPropagation(); deleteTemplate(${index})">✕</button>
            </div>
        </div>
    `).join('');
    
    document.getElementById('totalTemplates').textContent = savedTemplates.length;
}

// ============================================
// LOAD HISTORY TEMPLATES
// ============================================

function loadHistoryTemplatesList() {
    const list = document.getElementById('historyTemplatesList');
    if (!list) return;
    
    templateHistory = JSON.parse(localStorage.getItem('templateHistory') || '[]');
    
    if (templateHistory.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding:40px; color:var(--tx2);">⏱️ No history yet.<br>Generate templates to see them here.</div>';
        return;
    }
    
    list.innerHTML = templateHistory.slice(0, 10).map((tmpl, index) => `
        <div class="coll-card" style="margin-bottom:10px;" onclick="loadTemplateFromHistory(${index})">
            <div class="coll-meta">
                <div class="coll-name">${tmpl.name || 'Generated Template'}</div>
                <div style="font-size:10px; color:var(--tx2);">${tmpl.date || 'Just now'} · ${tmpl.type || 'Custom'}</div>
            </div>
        </div>
    `).join('');
}

// ============================================
// ULTIMATE TEMPLATE GENERATOR
// ============================================

function generateUltimateTemplate() {
    const prompt = document.getElementById('templatePrompt').value;
    const model = document.getElementById('aiModelSelect').value;
    const quality = document.getElementById('qualitySelect').value;
    const fontStyle = document.getElementById('fontStyle').value;
    const darkMode = document.getElementById('darkMode').checked;
    const animations = document.getElementById('animations').checked;
    const responsive = document.getElementById('responsive').checked;
    
    // Get colors
    const primary = document.getElementById('primaryHex').value || BASE;
    const secondary = document.getElementById('secondaryHex').value || (SCHEMES?.complementary?.[1] || '#2C3E50');
    const accent = document.getElementById('accentHex').value || (SCHEMES?.triadic?.[1] || '#FF6B6B');
    
    if (!prompt) {
        toast('Please describe your template', 'er');
        return;
    }
    
    toast('🎨 Generating ULTIMATE template...', 'in');
    
    // Show loading animation
    document.getElementById('generatedCodeDisplay').textContent = '/* Generating your template...\n   This may take a few seconds */';
    
    setTimeout(() => {
        // Generate template based on settings
        const template = generateUltimateHTML(prompt, primary, secondary, accent, fontStyle, darkMode, animations, responsive, quality);
        
        generatedTemplateCode = template;
        document.getElementById('generatedCodeDisplay').textContent = template;
        updateLivePreview(template);
        updateTemplateStats(template);
        
        // Add to history
        addToHistory(prompt, primary, secondary, accent);
        
        toast('✅ Ultimate template generated!', 'ok');
    }, 1000);
}

// ============================================
// GENERATE PROFESSIONAL HERO TEXT (NO PROMPT LEAKAGE!)
// ============================================

function getHeroText(prompt, productName) {
    const promptLower = prompt.toLowerCase();
    
    // Professional hero lines based on template type
    if (promptLower.includes('saas') || promptLower.includes('software')) {
        return "Streamline your workflow and boost productivity with our powerful platform.";
    }
    if (promptLower.includes('portfolio') || promptLower.includes('photographer')) {
        return "Showcase your creative work with stunning galleries and elegant design.";
    }
    if (promptLower.includes('ecommerce') || promptLower.includes('shop')) {
        return "Beautiful products, seamless shopping experience, happy customers.";
    }
    if (promptLower.includes('agency') || promptLower.includes('creative')) {
        return "We build brands that matter. Let's create something amazing together.";
    }
    if (promptLower.includes('blog') || promptLower.includes('magazine')) {
        return "Stories that inspire, ideas that matter. Read our latest articles.";
    }
    if (promptLower.includes('dashboard') || promptLower.includes('analytics')) {
        return "Make data-driven decisions with real-time insights and beautiful visualizations.";
    }
    if (promptLower.includes('restaurant') || promptLower.includes('cafe')) {
        return "Exceptional dining experiences crafted with passion and the finest ingredients.";
    }
    if (promptLower.includes('fitness') || promptLower.includes('gym')) {
        return "Transform your health with personalized workouts and expert guidance.";
    }
    if (promptLower.includes('real estate') || promptLower.includes('property')) {
        return "Find your dream home with our curated collection of premium properties.";
    }
    if (promptLower.includes('education') || promptLower.includes('course')) {
        return "Unlock your potential with expert-led courses and hands-on learning.";
    }
    if (promptLower.includes('health') || promptLower.includes('medical')) {
        return "Your health journey starts here. Compassionate care, exceptional results.";
    }
    if (promptLower.includes('travel') || promptLower.includes('hotel')) {
        return "Discover unforgettable experiences. Your next adventure awaits.";
    }
    if (promptLower.includes('fashion') || promptLower.includes('style')) {
        return "Express your unique style with our curated collection of fashion.";
    }
    
    // Default professional hero text
    return `Transform your ideas into reality with ${productName}'s powerful platform.`;
}

// ============================================
// GENERATE ULTIMATE HTML
// ============================================

function generateUltimateHTML(prompt, primary, secondary, accent, fontStyle, darkMode, animations, responsive, quality) {
    const currentYear = new Date().getFullYear();
    const templateId = Date.now();
    
    // Font mappings
    const fonts = {
        modern: { family: 'Inter, system-ui, sans-serif', headings: '700' },
        classic: { family: 'Georgia, serif', headings: '600' },
        tech: { family: 'Roboto, sans-serif', headings: '500' },
        elegant: { family: 'Playfair Display, serif', headings: '700' },
        playful: { family: 'Comic Sans MS, cursive', headings: '700' }
    };
    
    const font = fonts[fontStyle] || fonts.modern;
    
    // Parse prompt for keywords
    const promptLower = prompt.toLowerCase();
    const hasPricing = promptLower.includes('pricing') || promptLower.includes('price');
    const hasContact = promptLower.includes('contact') || promptLower.includes('form');
    const hasFeatures = promptLower.includes('feature') || promptLower.includes('card');
    const hasTestimonials = promptLower.includes('testimonial') || promptLower.includes('review');
    const hasTeam = promptLower.includes('team') || promptLower.includes('member');
    const hasGallery = promptLower.includes('gallery') || promptLower.includes('portfolio');
    const hasBlog = promptLower.includes('blog') || promptLower.includes('post');
    const hasFAQ = promptLower.includes('faq') || promptLower.includes('question');
    
    // Extract product name - look for quoted text or "called X" or "named X"
const nameMatch = prompt.match(/"([^"]+)"/) || 
                  prompt.match(/'([^']+)'/) || 
                  prompt.match(/called\s+([A-Z][a-zA-Z]+)/) ||
                  prompt.match(/named\s+([A-Z][a-zA-Z]+)/) ||
                  prompt.match(/for\s+([A-Z][a-zA-Z]+)/);
         const productName = nameMatch ? nameMatch[1] : 'YourProduct';
    
    // Quality settings
    const detailLevel = quality === 'draft' ? 'basic' : quality === 'premium' ? 'detailed' : 'standard';
    const extraSections = quality === 'enterprise' ? true : false;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productName} - AI Generated Template</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: ${font.family};
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
            ${darkMode ? 'transition: background 0.3s, color 0.3s;' : ''}
        }
        
        ${darkMode ? `
        @media (prefers-color-scheme: dark) {
            body {
                background: #1a1a1a;
                color: #f0f0f0;
            }
            .card, .feature-card, .pricing-card, .testimonial-card {
                background: #2d2d2d;
                border-color: #404040;
            }
        }` : ''}
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Color variables */
        :root {
            --primary: ${primary};
            --secondary: ${secondary};
            --accent: ${accent};
            --bg-light: #f8f9fa;
            --bg-dark: #1a1a1a;
            --text-light: #333;
            --text-dark: #f0f0f0;
            --border-radius: 8px;
            --box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        /* Header */
        header {
            background: var(--primary);
            color: white;
            padding: 1rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 20px rgba(0,0,0,0.15);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: ${font.headings};
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            opacity: 0.9;
            transition: opacity 0.2s;
            font-weight: 500;
        }
        
        .nav-links a:hover {
            opacity: 1;
        }
        
        .nav-links a.active {
            border-bottom: 2px solid white;
            padding-bottom: 4px;
        }
        
        ${animations ? `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .hero, .section {
            animation: fadeInUp 0.6s ease-out;
        }` : ''}
        
        /* Hero Section */
        .hero {
            padding: 6rem 0;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 0L60 30L30 60L0 30L30 0Z" fill="rgba(255,255,255,0.02)"/></svg>');
            opacity: 0.3;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: ${font.headings};
            margin-bottom: 1rem;
            position: relative;
        }
        
        .hero p {
            font-size: 1.3rem;
            max-width: 700px;
            margin: 0 auto 2rem;
            opacity: 0.95;
        }
        
        .btn {
            background: var(--accent);
            color: white;
            padding: 0.8rem 2rem;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            margin: 0 0.5rem;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }
        
        .btn-outline {
            background: transparent;
            border: 2px solid white;
        }
        
        .btn-outline:hover {
            background: white;
            color: var(--primary);
        }
        
        /* Features Section */
        .features {
            padding: 5rem 0;
            background: var(--bg-light);
        }
        
        .features h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: ${font.headings};
            margin-bottom: 3rem;
            color: var(--primary);
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(${hasFeatures ? 4 : 3}, 1fr);
            gap: 2rem;
        }
        
        .feature-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 2rem;
            text-align: center;
            box-shadow: var(--box-shadow);
            transition: transform 0.3s, box-shadow 0.3s;
            border: 1px solid rgba(0,0,0,0.05);
        }
        
        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
            border-color: var(--accent);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .feature-card h3 {
            color: var(--primary);
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        /* Pricing Section */
        ${hasPricing ? `
        .pricing {
            padding: 5rem 0;
            background: white;
        }
        
        .pricing h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: ${font.headings};
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .pricing-sub {
            text-align: center;
            color: #666;
            margin-bottom: 3rem;
        }
        
        .pricing-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .pricing-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 2.5rem 2rem;
            text-align: center;
            box-shadow: var(--box-shadow);
            position: relative;
            transition: transform 0.3s;
            border: 1px solid rgba(0,0,0,0.05);
        }
        
        .pricing-card:hover {
            transform: scale(1.05);
        }
        
        .pricing-card.popular {
            border: 2px solid var(--accent);
            transform: scale(1.05);
            z-index: 2;
        }
        
        .popular-badge {
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent);
            color: white;
            padding: 0.25rem 1.5rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .pricing-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .price {
            font-size: 3rem;
            font-weight: ${font.headings};
            color: var(--secondary);
            margin-bottom: 1rem;
        }
        
        .price span {
            font-size: 1rem;
            color: #999;
        }
        
        .pricing-card ul {
            list-style: none;
            margin: 2rem 0;
        }
        
        .pricing-card li {
            padding: 0.5rem 0;
            color: #666;
        }
        
        .pricing-card .btn {
            width: 100%;
        }
        ` : ''}
        
        /* Testimonials */
        ${hasTestimonials ? `
        .testimonials {
            padding: 5rem 0;
            background: var(--bg-light);
        }
        
        .testimonials h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: ${font.headings};
            margin-bottom: 3rem;
            color: var(--primary);
        }
        
        .testimonial-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }
        
        .testimonial-card {
            background: white;
            border-radius: var(--border-radius);
            padding: 2rem;
            box-shadow: var(--box-shadow);
            position: relative;
        }
        
        .testimonial-card::before {
            content: '"';
            font-size: 4rem;
            color: var(--primary);
            opacity: 0.2;
            position: absolute;
            top: 0;
            left: 1rem;
            font-family: serif;
        }
        
        .testimonial-card p {
            font-style: italic;
            margin: 1rem 0 1.5rem;
            color: #555;
            line-height: 1.8;
        }
        
        .testimonial-author {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
        }
        
        .author-info h4 {
            color: var(--primary);
            margin-bottom: 0.25rem;
        }
        
        .author-info p {
            margin: 0;
            font-size: 0.9rem;
            color: #777;
        }
        ` : ''}
        
        /* Contact Form */
        ${hasContact ? `
        .contact {
            padding: 5rem 0;
            background: white;
        }
        
        .contact h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: ${font.headings};
            margin-bottom: 3rem;
            color: var(--primary);
        }
        
        .contact-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        
        .contact-info {
            padding: 2rem;
        }
        
        .contact-info h3 {
            color: var(--primary);
            margin-bottom: 1rem;
        }
        
        .contact-info p {
            color: #666;
            margin-bottom: 1.5rem;
            line-height: 1.8;
        }
        
        .contact-details {
            margin-top: 2rem;
        }
        
        .contact-detail {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .contact-icon {
            width: 40px;
            height: 40px;
            background: var(--bg-light);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.8rem;
            border: 2px solid #e0e0e0;
            border-radius: var(--border-radius);
            font-family: inherit;
            font-size: 1rem;
            transition: border-color 0.2s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--primary);
        }
        
        .contact .btn {
            width: 100%;
            padding: 1rem;
        }
        ` : ''}
        
        /* Team Section */
        ${hasTeam ? `
        .team {
            padding: 5rem 0;
            background: white;
        }
        
        .team h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: ${font.headings};
            margin-bottom: 3rem;
            color: var(--primary);
        }
        
        .team-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }
        
        .team-card {
            text-align: center;
        }
        
        .team-photo {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
        }
        
        .team-card h3 {
            color: var(--primary);
            margin-bottom: 0.5rem;
        }
        
        .team-card p {
            color: #666;
            font-size: 0.9rem;
        }
        ` : ''}
        
        /* FAQ Section */
        ${hasFAQ ? `
        .faq {
            padding: 5rem 0;
            background: var(--bg-light);
        }
        
        .faq h2 {
            text-align: center;
            font-size: 2.5rem;
            font-weight: ${font.headings};
            margin-bottom: 3rem;
            color: var(--primary);
        }
        
        .faq-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .faq-item {
            background: white;
            border-radius: var(--border-radius);
            margin-bottom: 1rem;
            padding: 1rem 1.5rem;
            cursor: pointer;
            border: 1px solid #e0e0e0;
        }
        
        .faq-question {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            color: #333;
        }
        
        .faq-answer {
            display: none;
            padding-top: 1rem;
            color: #666;
            line-height: 1.8;
        }
        
        .faq-item.active .faq-answer {
            display: block;
        }
        
        .faq-item.active .faq-question {
            color: var(--primary);
        }
        ` : ''}
        
        /* Footer */
        footer {
            background: var(--primary);
            color: white;
            padding: 3rem 0;
            margin-top: 2rem;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2rem;
        }
        
        .footer-col h4 {
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .footer-col ul {
            list-style: none;
        }
        
        .footer-col ul li {
            margin-bottom: 0.5rem;
        }
        
        .footer-col ul li a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: color 0.2s;
        }
        
        .footer-col ul li a:hover {
            color: white;
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            margin-top: 2rem;
            border-top: 1px solid rgba(255,255,255,0.1);
            color: rgba(255,255,255,0.6);
        }
        
        /* Responsive Design */
        ${responsive ? `
        @media (max-width: 1024px) {
            .feature-grid {
                grid-template-columns: repeat(2, 1fr) !important;
            }
            .pricing-grid,
            .testimonial-grid,
            .team-grid,
            .footer-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .feature-grid,
            .pricing-grid,
            .testimonial-grid,
            .team-grid,
            .footer-grid,
            .contact-container {
                grid-template-columns: 1fr !important;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .btn {
                display: block;
                margin: 1rem auto;
                max-width: 250px;
            }
        }
        
        @media (max-width: 480px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .section {
                padding: 3rem 0;
            }
        }
        ` : ''}
        
        /* Loading Animation */
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">${productName}</div>
                <div class="nav-links">
                    <a href="#" class="active">Home</a>
                    ${hasFeatures ? '<a href="#features">Features</a>' : ''}
                    ${hasPricing ? '<a href="#pricing">Pricing</a>' : ''}
                    ${hasTeam ? '<a href="#team">Team</a>' : ''}
                    ${hasContact ? '<a href="#contact">Contact</a>' : ''}
                </div>
            </nav>
        </div>
    </header>
    
    <section class="hero">
        <div class="container">
            <h1>Welcome to ${productName}</h1>
            <p>${getHeroText(prompt, productName)}</p>
            <div>
                <a href="#" class="btn">Get Started</a>
                <a href="#" class="btn btn-outline">Learn More</a>
            </div>
        </div>
    </section>
    
    ${hasFeatures ? `
    <section id="features" class="features">
        <div class="container">
            <h2>Key Features</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Lightning Fast</h3>
                    <p>Experience blazing fast performance with our optimized platform.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure by Default</h3>
                    <p>Enterprise-grade security built into every layer.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Advanced Analytics</h3>
                    <p>Make data-driven decisions with powerful insights.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Real-time Updates</h3>
                    <p>Stay synchronized with live data synchronization.</p>
                </div>
            </div>
        </div>
    </section>
    ` : ''}
    
    ${hasPricing ? `
    <section id="pricing" class="pricing">
        <div class="container">
            <h2>Simple, Transparent Pricing</h2>
            <p class="pricing-sub">Choose the plan that fits your needs</p>
            <div class="pricing-grid">
                <div class="pricing-card">
                    <h3>Starter</h3>
                    <div class="price">$29<span>/mo</span></div>
                    <ul>
                        <li>✓ 5 Projects</li>
                        <li>✓ 10GB Storage</li>
                        <li>✓ Basic Analytics</li>
                        <li>✗ Priority Support</li>
                    </ul>
                    <a href="#" class="btn">Choose Plan</a>
                </div>
                <div class="pricing-card popular">
                    <div class="popular-badge">MOST POPULAR</div>
                    <h3>Professional</h3>
                    <div class="price">$79<span>/mo</span></div>
                    <ul>
                        <li>✓ Unlimited Projects</li>
                        <li>✓ 50GB Storage</li>
                        <li>✓ Advanced Analytics</li>
                        <li>✓ Priority Support</li>
                    </ul>
                    <a href="#" class="btn">Choose Plan</a>
                </div>
                <div class="pricing-card">
                    <h3>Enterprise</h3>
                    <div class="price">$199<span>/mo</span></div>
                    <ul>
                        <li>✓ Unlimited Everything</li>
                        <li>✓ Custom Solutions</li>
                        <li>✓ 24/7 Phone Support</li>
                        <li>✓ SLA Guarantee</li>
                    </ul>
                    <a href="#" class="btn">Contact Sales</a>
                </div>
            </div>
        </div>
    </section>
    ` : ''}
    
    ${hasTestimonials ? `
    <section class="testimonials">
        <div class="container">
            <h2>What Our Customers Say</h2>
            <div class="testimonial-grid">
                <div class="testimonial-card">
                    <p>"This platform has completely transformed how we work. The features are incredible and the support team is amazing."</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">S</div>
                        <div class="author-info">
                            <h4>Sarah Johnson</h4>
                            <p>CEO, TechStart</p>
                        </div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <p>"We've tried many solutions, but this is by far the best. The ROI has been incredible for our business."</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">M</div>
                        <div class="author-info">
                            <h4>Michael Chen</h4>
                            <p>CTO, InnovateLab</p>
                        </div>
                    </div>
                </div>
                <div class="testimonial-card">
                    <p>"The customer service is outstanding. They went above and beyond to help us integrate perfectly."</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">R</div>
                        <div class="author-info">
                            <h4>Rachel Martinez</h4>
                            <p>Product Manager, DesignHub</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    ` : ''}
    
    ${hasContact ? `
    <section id="contact" class="contact">
        <div class="container">
            <h2>Get in Touch</h2>
            <div class="contact-container">
                <div class="contact-info">
                    <h3>Let's talk about your project</h3>
                    <p>Have questions? We're here to help. Send us a message and we'll respond within 24 hours.</p>
                    <div class="contact-details">
                        <div class="contact-detail">
                            <div class="contact-icon">📍</div>
                            <span>123 Business Ave, Suite 100<br>San Francisco, CA 94107</span>
                        </div>
                        <div class="contact-detail">
                            <div class="contact-icon">📞</div>
                            <span>+1 (555) 123-4567</span>
                        </div>
                        <div class="contact-detail">
                            <div class="contact-icon">✉️</div>
                            <span>hello@${productName.toLowerCase()}.com</span>
                        </div>
                    </div>
                </div>
                <form class="contact-form">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" id="name" placeholder="John Doe" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" placeholder="john@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" rows="5" placeholder="Tell us about your project..." required></textarea>
                    </div>
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>
    </section>
    ` : ''}
    
    ${hasTeam ? `
    <section id="team" class="team">
        <div class="container">
            <h2>Meet Our Team</h2>
            <div class="team-grid">
                <div class="team-card">
                    <div class="team-photo">JD</div>
                    <h3>John Doe</h3>
                    <p>Founder & CEO</p>
                </div>
                <div class="team-card">
                    <div class="team-photo">JS</div>
                    <h3>Jane Smith</h3>
                    <p>Creative Director</p>
                </div>
                <div class="team-card">
                    <div class="team-photo">MW</div>
                    <h3>Mike Wilson</h3>
                    <p>Lead Developer</p>
                </div>
                <div class="team-card">
                    <div class="team-photo">AB</div>
                    <h3>Anna Brown</h3>
                    <p>Marketing Head</p>
                </div>
            </div>
        </div>
    </section>
    ` : ''}
    
    ${hasFAQ ? `
    <section class="faq">
        <div class="container">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">
                        What is ${productName}?
                        <span>▼</span>
                    </div>
                    <div class="faq-answer">
                        ${productName} is a powerful platform designed to help businesses streamline their workflows and achieve better results.
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        How much does it cost?
                        <span>▼</span>
                    </div>
                    <div class="faq-answer">
                        We offer flexible pricing plans starting at $29/month. Check our pricing section for detailed information.
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        Is there a free trial?
                        <span>▼</span>
                    </div>
                    <div class="faq-answer">
                        Yes! We offer a 14-day free trial with full access to all features. No credit card required.
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        What kind of support do you offer?
                        <span>▼</span>
                    </div>
                    <div class="faq-answer">
                        All plans include email support. Pro and Enterprise plans include priority support and phone assistance.
                    </div>
                </div>
            </div>
        </div>
    </section>
    ` : ''}
    
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <h4>${productName}</h4>
                    <ul>
                        <li><a href="#">About Us</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Press</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Product</h4>
                    <ul>
                        <li><a href="#">Features</a></li>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Integrations</a></li>
                        <li><a href="#">API</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Resources</h4>
                    <ul>
                        <li><a href="#">Documentation</a></li>
                        <li><a href="#">Guides</a></li>
                        <li><a href="#">Support</a></li>
                        <li><a href="#">Status</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <ul>
                        <li><a href="#">Privacy</a></li>
                        <li><a href="#">Terms</a></li>
                        <li><a href="#">Security</a></li>
                        <li><a href="#">Cookies</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${currentYear} ${productName}. All rights reserved. Generated with PaletteForge AI.</p>
            </div>
        </div>
    </footer>
    
    <script>
        // FAQ Toggle
        document.querySelectorAll('.faq-item').forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });
        
        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Mobile Menu Toggle (add your own implementation)
        console.log('Template loaded successfully');
    </script>
</body>
</html>`;
}

// ============================================
// UPDATE TEMPLATE STATS
// ============================================

function updateTemplateStats(code) {
    const lines = code.split('\n').length;
    const size = (code.length / 1024).toFixed(1);
    const components = (code.match(/<section/g) || []).length;
    
    document.getElementById('codeLines').textContent = lines;
    document.getElementById('codeSize').textContent = size + ' KB';
    document.getElementById('componentCount').textContent = components;
}

// ============================================
// UPDATE LIVE PREVIEW
// ============================================

function updateLivePreview(code) {
    const frame = document.getElementById('livePreviewFrame');
    if (frame) {
        frame.srcdoc = code;
    }
}

// ============================================
// SET PREVIEW MODE
// ============================================

function setPreviewMode(mode) {
    previewMode = mode;
    
    document.querySelectorAll('#templateGeneratorModal .tbtn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    const container = document.getElementById('previewContainer');
    const widths = { mobile: '375px', tablet: '768px', desktop: '100%' };
    
    container.style.maxWidth = widths[mode];
    container.style.margin = mode === 'desktop' ? '0' : '0 auto';
}

// ============================================
// REFRESH PREVIEW
// ============================================

function refreshPreview() {
    if (generatedTemplateCode) {
        updateLivePreview(generatedTemplateCode);
        toast('Preview refreshed', 'ok');
    }
}

// ============================================
// OPEN IN NEW TAB
// ============================================

function openInNewTab() {
    if (!generatedTemplateCode) {
        toast('Generate a template first', 'er');
        return;
    }
    
    const newWindow = window.open();
    newWindow.document.write(generatedTemplateCode);
}

// ============================================
// UPDATE COLOR PREVIEW
// ============================================

function updateColorPreview() {
    const primary = document.getElementById('primaryHex').value;
    const secondary = document.getElementById('secondaryHex').value;
    const accent = document.getElementById('accentHex').value;
    
    document.querySelectorAll('#templateGeneratorModal .color-well').forEach((well, i) => {
        if (i === 0) well.style.background = primary;
        if (i === 1) well.style.background = secondary;
        if (i === 2) well.style.background = accent;
    });
}

// ============================================
// SAVE TEMPLATE
// ============================================

function saveTemplate() {
    if (!generatedTemplateCode) {
        toast('Generate a template first', 'er');
        return;
    }
    
    const name = prompt('Enter a name for this template:', 'My Template ' + (savedTemplates.length + 1));
    if (!name) return;
    
    const template = {
        id: Date.now(),
        name: name,
        code: generatedTemplateCode,
        primary: document.getElementById('primaryHex').value,
        secondary: document.getElementById('secondaryHex').value,
        accent: document.getElementById('accentHex').value,
        date: new Date().toLocaleDateString(),
        type: document.getElementById('templateType').value
    };
    
    savedTemplates.unshift(template);
    localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    
    loadSavedTemplatesList();
    toast('💾 Template saved!', 'ok');
}

// ============================================
// LOAD TEMPLATE
// ============================================

function loadTemplate(index) {
    const template = savedTemplates[index];
    if (!template) return;
    
    generatedTemplateCode = template.code;
    document.getElementById('generatedCodeDisplay').textContent = template.code;
    updateLivePreview(template.code);
    
    document.getElementById('primaryHex').value = template.primary || BASE;
    document.getElementById('secondaryHex').value = template.secondary || '#2C3E50';
    document.getElementById('accentHex').value = template.accent || '#FF6B6B';
    
    updateColorPreview();
    toast('📂 Template loaded', 'ok');
}

// ============================================
// DELETE TEMPLATE
// ============================================

function deleteTemplate(index) {
    if (confirm('Delete this template?')) {
        savedTemplates.splice(index, 1);
        localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
        loadSavedTemplatesList();
        toast('🗑️ Template deleted', 'ok');
    }
}

// ============================================
// ADD TO HISTORY
// ============================================

function addToHistory(prompt, primary, secondary, accent) {
    const history = {
        id: Date.now(),
        name: prompt.slice(0, 50) + '...',
        prompt: prompt,
        primary: primary,
        secondary: secondary,
        accent: accent,
        date: new Date().toLocaleString(),
        type: document.getElementById('templateType').value
    };
    
    templateHistory.unshift(history);
    templateHistory = templateHistory.slice(0, 20); // Keep last 20
    localStorage.setItem('templateHistory', JSON.stringify(templateHistory));
}

// ============================================
// LOAD FEATURED TEMPLATE
// ============================================

function loadFeaturedTemplate(type) {
    loadPreset(type);
    generateUltimateTemplate();
}

// ============================================
// ENHANCE TEMPLATE
// ============================================

function enhanceTemplate() {
    if (!generatedTemplateCode) {
        toast('Generate a template first', 'er');
        return;
    }
    
    toast('✨ Enhancing template...', 'in');
    
    setTimeout(() => {
        // Add some enhancements to existing code
        let enhanced = generatedTemplateCode;
        
        // Add animation classes if not present
        if (!enhanced.includes('@keyframes fadeIn')) {
            enhanced = enhanced.replace('</style>', `
        /* Enhanced animations */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .feature-card, .pricing-card, .testimonial-card {
            animation: fadeIn 0.6s ease-out forwards;
            animation-delay: calc(var(--index, 0) * 0.1s);
        }
        </style>`);
        }
        
        generatedTemplateCode = enhanced;
        document.getElementById('generatedCodeDisplay').textContent = enhanced;
        updateLivePreview(enhanced);
        
        toast('✨ Template enhanced!', 'ok');
    }, 500);
}

// ============================================
// REGENERATE TEMPLATE
// ============================================

function regenerateTemplate() {
    generateUltimateTemplate();
}

// ============================================
// CLEAR ALL TEMPLATES
// ============================================

function clearAllTemplates() {
    if (confirm('Clear all saved templates and history?')) {
        savedTemplates = [];
        templateHistory = [];
        localStorage.setItem('savedTemplates', '[]');
        localStorage.setItem('templateHistory', '[]');
        loadSavedTemplatesList();
        loadHistoryTemplatesList();
        toast('🗑️ All cleared', 'ok');
    }
}

// ============================================
// COPY TEMPLATE CODE
// ============================================

function copyTemplateCode() {
    if (!generatedTemplateCode) {
        toast('Generate a template first', 'er');
        return;
    }
    
    navigator.clipboard.writeText(generatedTemplateCode).then(() => {
        toast('📋 Template code copied!', 'ok');
    });
}

// ============================================
// DOWNLOAD TEMPLATE CODE
// ============================================

function downloadTemplateCode() {
    if (!generatedTemplateCode) {
        toast('Generate a template first', 'er');
        return;
    }
    
    const blob = new Blob([generatedTemplateCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'paletteforge-ultimate-template.html';
    a.click();
    URL.revokeObjectURL(url);
    toast('⬇ Template downloaded!', 'ok');
}