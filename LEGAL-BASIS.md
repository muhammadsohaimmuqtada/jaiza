# Jaiza — Legal & Regulatory Basis

**Date:** 2026-11-05 · **Purpose:** the single document that answers "under what law and
regulation is this work done?" — both for (A) the technical assessment of this website/repo
and (B) Jaiza's paid audits of client companies. Written before any client engagement so the
basis is on record from day 1.

---

## A. Legal basis for assessing THIS website/repo (the work in this repo)

The site assessment (AUDIT.md, session 2 fixes, security headers) is a **self-assessment of
our own property** — no third-party data is touched, so no client-data law is triggered. The
frameworks we apply to ourselves, and cite:

| Layer | Instrument | Why it applies here |
|---|---|---|
| Secure coding | **OWASP Top 10 (2021) + OWASP ASVS v5** | XSS (we escape all dynamic HTML), injection, security-misconfiguration (headers) |
| SDLC | **NIST SP 800-218 (SSDF)** | CI validation, secrets scan, no network calls in client-side code |
| Web security headers | **OWASP Secure Headers Project** | CSP, XFO, nosniff, Referrer-Policy, Permissions-Policy (vercel.json) |
| Transport | **TLS 1.3 / HSTS** (Vercel-enforced, verified live) | `strict-transport-security: max-age=63072000; includeSubDomains; preload` |
| Vulnerability disclosure | **ISO/IEC 29147** + our `SECURITY.md` + `.well-known/security.txt` | How outsiders report issues to us |
| Pakistan cybercrime | **PECA 2016 (as amended)** | Governs unauthorized access to *our* systems; our own testing is authorized (own property) |
| Copyright | **Copyright Ordinance 1962 (PK)** | We only audit/fix our own code and assets |
| Contract | none needed | Self-work, no third party |

**Bottom line for A:** assessing our own site is lawful self-work under Pakistani law; we hold
ourselves to OWASP ASVS / NIST SSDF / OWASP Secure Headers as the *standard*, and PECA 2016
defines the boundary we must not cross when testing *others*.

---

## B. Legal basis for Jaiza's PAID audits of client companies

This is the part that matters commercially. Each engagement is governed by:

### 1. The engagement contract (primary instrument)
- **Contract Act 1872 (PK)** — offer/acceptance/consideration; our engagement letter + NDA +
  liability cap are contracts under this Act.
- **Companies Act 2017 (SECP)** — Jaiza must be a registered Pvt Ltd to sign B2B contracts
  and invoice; clients verify us via SECP eZfile.
- **Electronic Transactions Ordinance 2002 (ETO) + Electronic Signature Rules** — makes our
  **signed certificate of review a valid electronic record** in Pakistan; for US/UK/Gulf
  clients, e-signatures are valid under **US E-SIGN Act / UETA** and **EU eIDAS Regulation
  910/2014** (a "qualified" e-sign + **RFC 3161 timestamp** gives it presumption of validity).
- **Stamp duty** — engagement letters may need stamping per provincial Stamp Act; budget for
  it in the lawyer review.

### 2. Data protection & privacy (what we may access during an audit)
| Jurisdiction | Law | Practical effect on the audit |
|---|---|---|
| Pakistan | **Personal Data Protection Bill** (pending; MoITT) + PECA 2016 data offenses | Design to GDPR-equivalent standard now; client consent + NDA required before touching their data |
| EU/UK clients | **GDPR / UK GDPR + Data Protection Act 2018** | DPA with client, DPIA before new data flows, 72h breach notice, SCCs for any transfer |
| UAE | **PDPL (Federal Decree-Law 45/2021)** | Consent + purpose limitation for Gulf clients |
| Saudi Arabia | **PDPL (as amended 2023)** | Same for KSA clients |
| US | State laws (CCPA/CPRA, VCDPA…) + contractual SOC 2 addenda | No statutory "audit right" — access is purely contractual |
| Card data | **PCI DSS v4.0** | Raw PANs never touch our servers — card-statement parsing stays **client-side** (scan.js) or tokenized → SAQ A posture, out of PCI scope |

### 3. Sector & tax (running the business in PK)
- **Income Tax Ordinance 2001 + Sales Tax Act 1990 (FBR)** — NTN + sales tax registration;
  verify FY2026-27 IT-export incentives (PSEB-registered exporters get concessions).
- **PSEB registration** — required to claim IT-export benefits and appear in the exporter
  directory we use for outreach.
- **SBP regulations** — only if we touch payments; we don't store PANs (see PCI row).
- **Professional liability** — engagement letter caps liability; cyber/PI insurance
  (~₨50–100k/yr) once revenue exists.

### 4. AI-specific (the certificate's subject matter)
- **EU AI Act (Regulation 2024/1689)** — enforcement from **Aug 2026**; our certificate helps
  clients meet transparency/governance duties for B2B SaaS. We never train on client data.
- **NIST AI RMF 1.0** + **ISO/IEC 42001** — the governance frameworks our certificate attests
  against.

### 5. Standards we certify clients against (not laws, but contractually demanded)
- **ISO/IEC 27001:2022** (ISMS), **SOC 2 Type II** (AICPA TSC) — the #1 enterprise gate in
  US/UK RFPs.
- **CSA Cloud Controls Matrix v4 + CAIQ**, **Shared Assessments SIG Lite** — pre-filled
  answers for vendor questionnaires.
- **FinOps FOCUS** spec — ledger schema alignment.

---

## C. What this means operationally (day-1 checklist)

1. Register **Pvt Ltd (SECP eZfile)** + **PSEB** + **NTN/FBR** before first invoice.
2. One **Pakistani lawyer review** (~₨10–20k) of: engagement letter, NDA, DPA, liability cap,
   e-signature method (licensed CA + RFC 3161 timestamp for certificates).
3. Publish on the site: **Privacy Policy, Terms, DPA, Subprocessor list, Security
   whitepaper, SLA, breach-notice procedure, retention/deletion policy** — required by
   GDPR clients and expected by every enterprise procurement team.
4. Keep the **client-side-only** posture of scan.js — it is what keeps us out of PCI DSS
   scope and is a selling point ("your card data never leaves your browser").
5. Never sign **unlimited-liability** clauses; cap at fees paid.
6. For each audit, the **engagement letter + NDA + client consent** are the legal basis for
   access; the certificate is a valid e-record under ETO 2002 / eIDAS / E-SIGN.

## D. Disclaimer

This document is a working map prepared by the founder with AI assistance, **not legal
advice**. The one paid lawyer review (₨10–20k, in BOOTSTRAP-PLAN.md) is the step that turns
this into enforceable documents. Pakistani counsel for corporate/IT/tax; EU counsel for the
GDPR DPA when the first EU client signs.
