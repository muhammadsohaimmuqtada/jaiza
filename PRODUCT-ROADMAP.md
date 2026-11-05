# Jaiza — Product Development Roadmap, Legal & Standards Guide

Companion to AUDIT.md. Answers: if we turn the audit service into a product, how do we proceed,
what laws apply, which frameworks, which industry standards.

---

## 1. How to proceed

- **Phase 0 (now → mo 3):** keep selling the 10-day human audit; every engagement = product research.
  Recurring steps (CSV parsing, vendor matching, seat reconciliation, certificate drafting) = MVP backlog.
- **Phase 1 (mo 3–6) MVP — ledger automation:** multi-tenant web app; CSV/statement upload (keep a
  client-side option for card statements); vendor matching; currency conversion; duplicate-tool + idle-seat
  detection; CSV/PDF ledger export; auth + RBAC + audit log; certificate generator with public
  verification page (`verify…/JZ-YYYY-NNNN`).
- **Phase 2 (mo 6–12) enterprise readiness:** SSO/SAML, SCIM, DPA + subprocessor list, SOC 2 Type II,
  pen test, SLA, PK + EU data residency, APIs for QuickBooks/Xero/SAP and provider usage APIs
  (OpenAI/Anthropic/Azure usage endpoints).
- **Phase 3 (yr 2) audit agent:** read-only connectors — bank feeds, admin consoles (Google Workspace,
  M365, GitHub org), network egress agent. This is the moat.
- **Rule:** ship the ledger first (CFO buyer), certificate second (compliance buyer). Never both at once.

## 2. Laws & regulations

### Pakistan
| Area | Law / body | Action |
|---|---|---|
| Company | Companies Act 2017 (SECP) | Pvt Ltd; register with PSEB; consider STZA zone benefits |
| Tax | Income Tax Ordinance 2001, Sales Tax Act 1990 (FBR) | NTN + sales tax; verify current IT-export incentives for FY2026-27 |
| Cybercrime | PECA 2016 (as amended) | Covers unauthorized access/data offenses; drives agent design + breach handling |
| E-records / e-sign | Electronic Transactions Ordinance 2002 + E-Signature Rules | Certificates = valid e-records; use licensed CA / qualified e-sign + RFC 3161 timestamp |
| Data protection | Personal Data Protection Bill (verify current enforcement with MoITT) | Design to GDPR-equivalent standard regardless |
| Payments | SBP regs | Never store PANs — keep card-statement parsing client-side or tokenized (stay out of PCI scope) |
| Sector clients | SBP / SECP prudential regs | Their questionnaires set your security baseline |

### International (clients)
- **EU/UK:** GDPR / UK GDPR + DPA 2018 — DPA with clients, DPIAs, 72h breach notice, SCCs for transfers.
- **UAE:** PDPL (FDL 45/2021). **Saudi:** PDPL as amended 2023.
- **US:** state privacy laws (CCPA/CPRA, VCDPA…) + contractual SOC 2 / security addenda.
- **Card data:** PCI DSS v4.0 — design so raw PANs never hit your servers (SAQ A posture).
- **AI features:** EU AI Act (transparency duties for B2B SaaS), NIST AI RMF; **never train on client data** unless contracted.

### Legal artifacts from day 1
Privacy Policy · Terms of Service · DPA · Subprocessor list · Security whitepaper · SLA ·
Breach notification procedure · NDA template · Retention & deletion policy · Cookie consent.
Pakistani counsel for corporate/IT law; EU counsel for the GDPR DPA.

## 3. Frameworks & security standards

| Layer | Standard | Concrete actions |
|---|---|---|
| Secure coding | OWASP Top 10 (2021), OWASP ASVS v5 | Threat-model each feature; ASVS L2 as enterprise bar |
| SDLC | NIST SP 800-218 (SSDF) | Security reqs in backlog; code review; semgrep + gitleaks + Dependabot in CI; signed commits |
| Risk mgmt | NIST CSF 2.0, ISO/IEC 27001:2022 | Start ISMS now (9–18 mo to cert); clients ask at RFP stage |
| Attestation | SOC 2 Type II (TSC) | Budget year 1; #1 US/UK enterprise gate |
| Privacy | ISO/IEC 27701, GDPR DPIA | DPIA before any new data flow |
| AI governance | ISO/IEC 42001, NIST AI RMF | Model cards, evals, human-in-the-loop |
| Infra | CIS Controls v8 | MFA, least privilege, logging, backups, encryption |
| Crypto | TLS 1.3, AES-256 at rest, KMS envelope encryption, HSTS, CSP, SRI | Secrets never in repo (gitleaks) |

### Architecture defaults
- Next.js/React frontend · Node.js or FastAPI API · PostgreSQL with **row-level security** per org
- Vercel + managed Postgres (Neon/Supabase), or AWS/GCP with PK + EU regions
- SSO/SAML + SCIM (Okta/Entra ID), MFA mandatory, short-lived JWTs
- Data classification (financial = high), encryption at rest, client-side parsing option for card
  statements, retention/deletion jobs, full audit logging
- Dogfood: review every subprocessor's retention/training terms; publish subprocessor list

## 4. Industry standards for the category

- **FinOps Foundation FOCUS** spec — align ledger schema to cloud billing exports (AWS/Azure/GCP)
- **CSA Cloud Controls Matrix v4 + CAIQ** — pre-fill for enterprise security reviews
- **Shared Assessments SIG Lite** — for vendor questionnaires
- **ISO/IEC 27001 + SOC 2**; **ISO/IEC 42001** if AI features ship
- Certificate verification: public verify endpoint + signed PDF + QR + RFC 3161 timestamp

## 5. 12-month compliance roadmap

| Quarter | Milestones |
|---|---|
| Q1 | SECP/PSEB/tax setup; legal templates; MVP threat model; CI security scanning; MFA/SSO design |
| Q2 | MVP ships; DPIA; encryption + RLS; pen test #1; cyber-insurance policy |
| Q3 | SOC 2 Type I; ISO 27001 gap assessment; CAIQ pre-filled; EU residency option |
| Q4 | SOC 2 Type II report; pen test #2; ISO 27001 cert audit; EU AI Act readiness; annual self-audit of own stack |
