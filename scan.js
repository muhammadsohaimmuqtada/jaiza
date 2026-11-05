/**
 * Jaiza | Free AI Spend Scan
 * Parses a CSV of expenses/card statements entirely in the browser.
 * No upload, no network calls, no storage.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---------- vendor list: keywords -> category ---------- */
    // Order matters: specific names before generic keywords.
    const VENDORS = [
        { name: 'GitHub Copilot',        cat: 'code',        seat: true,  keys: ['github copilot'] },
        { name: 'Cursor',                cat: 'code',        seat: true,  keys: ['cursor'] },
        { name: 'Replit',                cat: 'code',        seat: true,  keys: ['replit'] },
        { name: 'Codeium / Windsurf',    cat: 'code',        seat: true,  keys: ['codeium', 'windsurf'] },
        { name: 'Tabnine',               cat: 'code',        seat: true,  keys: ['tabnine'] },
        { name: 'v0 / Vercel AI',        cat: 'code',        seat: false, keys: ['v0.dev', 'v0 by vercel', 'vercel ai'] },
        { name: 'Bolt.new / Lovable',    cat: 'code',        seat: false, keys: ['bolt.new', 'lovable'] },
        { name: 'ChatGPT / OpenAI',      cat: 'chat',        seat: true,  keys: ['chatgpt', 'openai', 'gpt-', 'dall-e', 'sora', 'whisper'] },
        { name: 'Microsoft Copilot',     cat: 'chat',        seat: true,  keys: ['copilot', 'microsoft 365', 'office 365'] },
        { name: 'Claude / Anthropic',    cat: 'chat',        seat: true,  keys: ['anthropic', 'claude'] },
        { name: 'Google Gemini',         cat: 'chat',        seat: true,  keys: ['gemini', 'google ai', 'bard', 'notebooklm'] },
        { name: 'Perplexity',            cat: 'chat',        seat: true,  keys: ['perplexity'] },
        { name: 'Poe / You.com',         cat: 'chat',        seat: true,  keys: ['poe.com', 'you.com'] },
        { name: 'Midjourney',            cat: 'creative',    seat: false, keys: ['midjourney'] },
        { name: 'Leonardo.ai',           cat: 'creative',    seat: false, keys: ['leonardo'] },
        { name: 'Adobe Firefly',         cat: 'creative',    seat: false, keys: ['firefly', 'adobe'] },
        { name: 'Runway',                cat: 'creative',    seat: false, keys: ['runway', 'runwayml'] },
        { name: 'Pika / HeyGen / Synthesia', cat: 'creative', seat: false, keys: ['pika', 'heygen', 'synthesia'] },
        { name: 'ElevenLabs / Suno',     cat: 'creative',    seat: false, keys: ['elevenlabs', 'suno'] },
        { name: 'Stability / Replicate', cat: 'creative',    seat: false, keys: ['stability', 'stable diffusion', 'replicate'] },
        { name: 'Canva',                 cat: 'productivity', seat: true,  keys: ['canva'] },
        { name: 'Grammarly',             cat: 'productivity', seat: true,  keys: ['grammarly'] },
        { name: 'Notion AI',             cat: 'productivity', seat: true,  keys: ['notion ai', 'notion'] },
        { name: 'Jasper / Writesonic / Copy.ai', cat: 'productivity', seat: false, keys: ['jasper', 'writesonic', 'copy.ai'] },
        { name: 'Otter / Fireflies / Descript',   cat: 'productivity', seat: false, keys: ['otter.ai', 'fireflies', 'descript'] },
        { name: 'Zoom AI / Slack AI',    cat: 'productivity', seat: true,  keys: ['zoom ai', 'slack ai', 'teams ai'] },
        { name: 'AWS Bedrock / SageMaker', cat: 'infra',     seat: false, keys: ['bedrock', 'sagemaker', 'amazon q'] },
        { name: 'Azure OpenAI',          cat: 'infra',       seat: false, keys: ['azure openai', 'azure ai', 'openai.azure'] },
        { name: 'Google Cloud AI / Vertex', cat: 'infra',   seat: false, keys: ['vertex ai', 'google cloud ai', 'ai platform'] },
        { name: 'OpenRouter / Together / Groq', cat: 'infra', seat: false, keys: ['openrouter', 'together.ai', 'together ai', 'groq', 'hugging face', 'huggingface'] },
    ];

    const CATEGORY_LABEL = {
        chat: 'Chat assistant',
        code: 'Coding tool',
        creative: 'Creative / media',
        productivity: 'Productivity',
        infra: 'API / infrastructure',
    };

    const CURRENCY_SYMBOL = { '$': 'USD', '€': 'EUR', '£': 'GBP', '₨': 'PKR', 'rs': 'PKR', 'pkr': 'PKR', 'usd': 'USD', 'eur': 'EUR', 'gbp': 'GBP' };
    const RATE_TO_PKR = { PKR: 1, USD: null, EUR: null, GBP: null }; // filled from input

    /* ---------- element refs ---------- */
    const $ = (id) => document.getElementById(id);
    const dropzone = $('dropzone'), fileInput = $('fileInput'), pasteInput = $('pasteInput');
    const scanBtn = $('scanBtn'), scanError = $('scanError'), results = $('results');
    const fileCurrency = $('fileCurrency'), usdRate = $('usdRate');
    const idlePct = $('idlePct'), idlePctVal = $('idlePctVal');

    if (!dropzone || !scanBtn) return;

    idlePct.addEventListener('input', () => { idlePctVal.textContent = idlePct.value + '%'; });

    /* ---------- CSV parsing ---------- */
    function parseCSV(text) {
        const rows = [];
        let row = [], field = '', inQuotes = false;
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            if (inQuotes) {
                if (c === '"') {
                    if (text[i + 1] === '"') { field += '"'; i++; }
                    else inQuotes = false;
                } else field += c;
            } else if (c === '"') inQuotes = true;
            else if (c === ',') { row.push(field); field = ''; }
            else if (c === '\n' || c === '\r') {
                if (c === '\r' && text[i + 1] === '\n') i++;
                row.push(field); field = '';
                if (row.length > 1 || row[0].trim() !== '') rows.push(row);
                row = [];
            } else field += c;
        }
        if (field !== '' || row.length) { row.push(field); rows.push(row); }
        return rows.filter((r) => r.some((c) => c.trim() !== ''));
    }

    function parseAmount(raw) {
        if (raw == null) return null;
        let s = String(raw).trim().toLowerCase();
        if (!s) return null;
        let cur = null;
        for (const [sym, code] of Object.entries(CURRENCY_SYMBOL)) {
            if (s.includes(sym)) { cur = code; break; }
        }
        let neg = false;
        if (/^\(.*\)$/.test(s) || s.startsWith('-')) neg = true;
        s = s.replace(/[^0-9.,]/g, '');
        if (!s) return null;
        // 1,234.56 vs 1.234,56
        if (s.includes(',') && s.includes('.')) {
            if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
            else s = s.replace(/,/g, '');
        } else if (s.includes(',')) {
            const parts = s.split(',');
            s = parts.length === 2 && parts[1].length === 3 && parts[0].length <= 3
                ? s.replace(',', '.')   // 12,50 -> decimal
                : s.replace(/,/g, ''); // thousands
        }
        const n = parseFloat(s);
        if (!isFinite(n)) return null;
        return { value: neg ? -Math.abs(n) : n, currency: cur };
    }

    function parseDate(s) {
        if (!s) return null;
        s = String(s).trim();
        let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
        m = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
        if (m) {
            let a = +m[1], b = +m[2], y = +m[3];
            if (y < 100) y += 2000;
            if (a > 12) return new Date(y, b - 1, a);       // DD/MM
            return new Date(y, a - 1, b);                    // MM/DD
        }
        return null;
    }

    function detectColumns(rows) {
        const header = rows[0].map((c) => c.trim().toLowerCase());
        const descNames = ['description', 'desc', 'details', 'detail', 'narration', 'merchant', 'payee', 'name', 'title', 'memo', 'transaction'];
        const amountNames = ['amount', 'amt', 'debit', 'credit', 'charge', 'total', 'value', 'cost', 'price', 'paid'];
        const dateNames = ['date', 'txn date', 'transaction date', 'posted', 'time', 'day'];
        const curNames = ['currency', 'cur', 'ccy'];

        let descIdx = header.findIndex((h) => descNames.some((n) => h.includes(n)));
        let amountIdx = header.findIndex((h) => amountNames.some((n) => h.includes(n)));
        let dateIdx = header.findIndex((h) => dateNames.some((n) => h.includes(n)));
        let curIdx = header.findIndex((h) => curNames.some((n) => h.includes(n)));

        const data = rows.slice(1);
        const hasHeader = descIdx !== -1 || amountIdx !== -1;

        if (amountIdx === -1) {
            // pick the column with the most parseable amounts
            const width = Math.max(...rows.map((r) => r.length));
            let best = -1, bestCount = 0;
            for (let c = 0; c < width; c++) {
                let count = 0;
                for (const r of data) if (parseAmount(r[c]) !== null) count++;
                if (count > bestCount) { bestCount = count; best = c; }
            }
            amountIdx = best;
        }
        if (descIdx === -1) {
            const width = Math.max(...rows.map((r) => r.length));
            let best = 0, bestScore = -1;
            for (let c = 0; c < width; c++) {
                if (c === amountIdx) continue;
                let score = 0;
                for (const r of data) {
                    const v = (r[c] || '').trim();
                    if (v && parseAmount(v) === null && !parseDate(v)) score += v.length;
                }
                if (score > bestScore) { bestScore = score; best = c; }
            }
            descIdx = best;
        }
        if (dateIdx === -1) {
            const width = Math.max(...rows.map((r) => r.length));
            for (let c = 0; c < width; c++) {
                if (c === amountIdx || c === descIdx) continue;
                let count = 0;
                for (const r of data) if (parseDate(r[c])) count++;
                if (count >= Math.max(1, data.length * 0.5)) { dateIdx = c; break; }
            }
        }
        return { data: hasHeader ? data : rows, descIdx, amountIdx, dateIdx, curIdx };
    }

    function matchVendor(desc) {
        const d = desc.toLowerCase();
        for (const v of VENDORS) {
            for (const k of v.keys) {
                // short keys (<6 chars) must match on a word boundary to avoid
                // false positives (e.g. "cursor" inside "cursor blink")
                if (k.length < 6) {
                    const re = new RegExp('(^|[^a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)');
                    if (re.test(d)) return v;
                } else if (d.includes(k)) {
                    return v;
                }
            }
        }
        return null;
    }

    /* ---------- formatting ---------- */
    function fmtPKR(n) {
        const neg = n < 0 ? '-' : '';
        const abs = Math.abs(n);
        if (abs >= 1e6) return neg + '₨ ' + (abs / 1e6).toFixed(2) + 'M';
        if (abs >= 1e3) return neg + '₨ ' + Math.round(abs / 1e3) + 'k';
        return neg + '₨ ' + Math.round(abs).toLocaleString('en-PK');
    }

    function escapeHTML(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    /* ---------- the scan ---------- */
    let lastResult = null;

    function runScan(text) {
        scanError.hidden = true;
        results.hidden = true;
        lastResult = null;

        if (!text || !text.trim()) {
            return fail('Paste some lines or choose a file first.');
        }

        const rows = parseCSV(text);
        if (rows.length < 2) return fail('Could not find any rows — expected CSV lines like: date, description, amount');

        const { data, descIdx, amountIdx, dateIdx, curIdx } = detectColumns(rows);
        const defaultCur = fileCurrency.value;
        const usd = parseFloat(usdRate.value) || 278;
        const rates = { PKR: 1, USD: usd, EUR: usd * 1.16, GBP: usd * 1.32 };

        const byVendor = new Map(); // name -> {vendor, totalPKR, lines}
        let matched = 0, unmatched = 0, totalPKR = 0;
        const months = new Set();

        for (const r of data) {
            const amt = parseAmount(r[amountIdx]);
            if (!amt || amt.value <= 0) { if (amt && amt.value < 0) unmatched++; continue; }
            const desc = (r[descIdx] || '').trim();
            if (!desc) { unmatched++; continue; }
            let cur = amt.currency || (curIdx >= 0 ? (CURRENCY_SYMBOL[String(r[curIdx] || '').trim().toLowerCase()] || null) : null) || defaultCur;
            const rate = rates[cur] || 1;
            const pkr = amt.value * rate;

            if (dateIdx >= 0) {
                const d = parseDate(r[dateIdx]);
                if (d && !isNaN(d)) months.add(d.getFullYear() + '-' + (d.getMonth() + 1));
            }

            const v = matchVendor(desc);
            if (v) {
                matched++;
                totalPKR += pkr;
                if (!byVendor.has(v.name)) byVendor.set(v.name, { vendor: v, totalPKR: 0, lines: 0 });
                const e = byVendor.get(v.name);
                e.totalPKR += pkr;
                e.lines++;
            } else {
                unmatched++;
            }
        }

        if (!matched) {
            return fail('No known AI tools found in ' + data.length + ' lines (' + unmatched + ' unrecognized). Try a bank/card CSV that includes AI subscriptions.');
        }

        const monthCount = months.size >= 2 ? months.size : 1;
        const periodLabel = months.size >= 2 ? 'MONTHLY AVG · ' + months.size + ' MO' : (months.size === 1 ? 'THIS MONTH' : 'FILE TOTAL');
        const monthly = totalPKR / monthCount;

        // per-vendor monthly
        const vendors = [...byVendor.values()]
            .map((e) => ({ ...e, monthlyPKR: e.totalPKR / monthCount }))
            .sort((a, b) => b.monthlyPKR - a.monthlyPKR);

        // category overlap: within a category with >1 vendor, all but the largest are potential duplicates
        const byCat = new Map();
        for (const e of vendors) {
            if (!byCat.has(e.vendor.cat)) byCat.set(e.vendor.cat, []);
            byCat.get(e.vendor.cat).push(e);
        }
        let overlapPKR = 0;
        for (const list of byCat.values()) {
            if (list.length > 1) {
                const sorted = [...list].sort((a, b) => b.monthlyPKR - a.monthlyPKR);
                for (let i = 1; i < sorted.length; i++) overlapPKR += sorted[i].monthlyPKR;
            }
        }

        // idle-seat estimate applies to seat-based tools
        const seatMonthly = vendors.filter((e) => e.vendor.seat).reduce((s, e) => s + e.monthlyPKR, 0);
        const idle = (parseInt(idlePct.value, 10) || 0) / 100;
        const idlePKR = seatMonthly * idle;
        const recoverable = idlePKR + overlapPKR;

        lastResult = { vendors, monthly, monthCount, periodLabel, overlapPKR, idlePKR, recoverable, matched, unmatched, lines: data.length };
        render(lastResult);
    }

    function fail(msg) {
        scanError.textContent = msg;
        scanError.hidden = false;
    }

    function render(r) {
        $('periodLabel').textContent = r.periodLabel;
        $('totalBig').textContent = fmtPKR(r.monthly);
        $('totalLabel').textContent = '/ month — ' + r.vendors.length + ' AI tool' + (r.vendors.length > 1 ? 's' : '') + ' across ' + new Set(r.vendors.map((v) => v.vendor.cat)).size + ' categories';

        const bars = $('vendorBars');
        bars.innerHTML = '';
        for (const e of r.vendors) {
            const share = r.monthly > 0 ? (e.monthlyPKR / r.monthly) * 100 : 0;
            const div = document.createElement('div');
            div.className = 'scan-bar';
            div.innerHTML = '<span class="scan-bar-name">' + escapeHTML(e.vendor.name) + '</span>' +
                '<span class="scan-bar-track"><span class="scan-bar-fill" style="width:' + share.toFixed(1) + '%"></span></span>' +
                '<span class="scan-bar-amt">' + fmtPKR(e.monthlyPKR) + '</span>';
            bars.appendChild(div);
        }

        const rows = $('vendorRows');
        rows.innerHTML = '';
        for (const e of r.vendors) {
            const share = r.monthly > 0 ? Math.round((e.monthlyPKR / r.monthly) * 100) : 0;
            const div = document.createElement('div');
            div.className = 'row';
            div.innerHTML = '<span>' + escapeHTML(e.vendor.name) + '</span>' +
                '<span class="amt">' + fmtPKR(e.monthlyPKR) + '/mo</span>' +
                '<span class="lbl">' + (CATEGORY_LABEL[e.vendor.cat] || e.vendor.cat) + ' · ' + e.lines + ' line' + (e.lines > 1 ? 's' : '') + ' · ' + share + '% of AI spend</span>';
            rows.appendChild(div);
        }

        $('scanStats').innerHTML =
            '<div class="scan-stat"><b>' + r.matched + '</b><span>AI charges found</span></div>' +
            '<div class="scan-stat"><b>' + r.lines + '</b><span>lines scanned (' + r.unmatched + ' not AI)</span></div>' +
            '<div class="scan-stat"><b>' + fmtPKR(r.overlapPKR) + '</b><span>/mo in parallel tools</span></div>' +
            '<div class="scan-stat"><b>' + fmtPKR(r.idlePKR) + '</b><span>/mo est. idle seats</span></div>';

        $('recoveryLine').textContent = 'ESTIMATED RECOVERABLE · ' + fmtPKR(r.recoverable) + ' / MO · ' + fmtPKR(r.recoverable * 12) + ' / YR';

        results.hidden = false;
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /* ---------- export ---------- */
    $('exportBtn').addEventListener('click', () => {
        if (!lastResult) return;
        const lines = ['vendor,category,charges_found,monthly_pkr,share_pct'];
        for (const e of lastResult.vendors) {
            const share = lastResult.monthly > 0 ? ((e.monthlyPKR / lastResult.monthly) * 100).toFixed(1) : '0.0';
            lines.push([e.vendor.name, CATEGORY_LABEL[e.vendor.cat] || e.vendor.cat, e.lines, Math.round(e.monthlyPKR), share].join(','));
        }
        lines.push(['TOTAL', '', lastResult.matched, Math.round(lastResult.monthly), '100.0'].join(','));
        lines.push(['EST_RECOVERABLE_PER_MONTH_PKR', '', '', Math.round(lastResult.recoverable), ''].join(','));
        const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'jaiza-ai-spend-preview.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    /* ---------- sample data ---------- */
    const SAMPLE = [
        'date,description,amount,currency',
        '2026-08-02,CHATGPT.COM OPENAI,5600,PKR',
        '2026-08-02,GITHUB COPILOT,2780,PKR',
        '2026-08-03,CURSOR AI INC,5560,PKR',
        '2026-08-04,CLAUDE.AI ANTHROPIC,5600,PKR',
        '2026-08-05,MIDJOURNE.COM,8340,PKR',
        '2026-08-06,NOTION AI,2780,PKR',
        '2026-08-09,OPENAI API USAGE,41200,PKR',
        '2026-08-11,GRAMMARLY BUSINESS,7800,PKR',
        '2026-09-02,CHATGPT.COM OPENAI,5600,PKR',
        '2026-09-02,GITHUB COPILOT,2780,PKR',
        '2026-09-03,CURSOR AI INC,5560,PKR',
        '2026-09-04,CLAUDE.AI ANTHROPIC,5600,PKR',
        '2026-09-05,MIDJOURNE.COM,8340,PKR',
        '2026-09-06,NOTION AI,2780,PKR',
        '2026-09-09,OPENAI API USAGE,46800,PKR',
        '2026-09-11,GRAMMARLY BUSINESS,7800,PKR',
        '2026-10-02,CHATGPT.COM OPENAI,5600,PKR',
        '2026-10-02,GITHUB COPILOT,2780,PKR',
        '2026-10-03,CURSOR AI INC,5560,PKR',
        '2026-10-04,CLAUDE.AI ANTHROPIC,5600,PKR',
        '2026-10-05,MIDJOURNE.COM,8340,PKR',
        '2026-10-06,NOTION AI,2780,PKR',
        '2026-10-09,OPENAI API USAGE,52400,PKR',
        '2026-10-11,GRAMMARLY BUSINESS,7800,PKR',
        '2026-10-12,ACME CORP PAYROLL,-450000,PKR',
        '2026-10-13,RENT OFFICE DHA,180000,PKR'
    ].join('\n');

    const sampleBtn = $('sampleBtn');
    if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
            pasteInput.value = SAMPLE;
            runScan(SAMPLE);
        });
    }

    /* ---------- input wiring ---------- */
    scanBtn.addEventListener('click', () => runScan(pasteInput.value));

    fileInput.addEventListener('change', () => {
        const f = fileInput.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => { pasteInput.value = String(reader.result || ''); runScan(pasteInput.value); };
        reader.onerror = () => fail('Could not read that file.');
        reader.readAsText(f);
    });

    ['dragenter', 'dragover'].forEach((ev) => dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.add('drag');
    }));
    ['dragleave', 'drop'].forEach((ev) => dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag');
    }));
    dropzone.addEventListener('drop', (e) => {
        const f = e.dataTransfer.files && e.dataTransfer.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => { pasteInput.value = String(reader.result || ''); runScan(pasteInput.value); };
        reader.onerror = () => fail('Could not read that file.');
        reader.readAsText(f);
    });
});
