# Sample deliverables — build sources

The PDFs linked from the site live in `assets/samples/`. They are generated from the
HTML files here with WeasyPrint (one page each, A4):

```sh
weasyprint samples-src/sample-ledger.html assets/samples/jaiza-sample-ledger.pdf
weasyprint samples-src/sample-certificate.html assets/samples/jaiza-sample-certificate.pdf
```

Fonts used (all free/OFL): Fraunces (variable TTF), Inter, IBM Plex Mono.
On this machine they are installed in `~/.local/share/fonts`; on a fresh machine fetch
Fraunces from github.com/google/fonts (`ofl/fraunces/Fraunces[SOFT,WONK,opsz,wght].ttf`
+ italic) and IBM Plex Mono from `ofl/ibmplexmono`.

All data in both documents is **fictional** (sample entity "Meridian Systems (Pvt) Ltd",
ref `JZ-2026-0000-S`) and clearly marked SAMPLE — replace nothing here with real client
data.
