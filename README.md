# GPT-6-Astra for VLN

Project website for **GPT-6-Astra Lights Up Embodied Navigation: Evaluation in Zero-Shot Vision-and-Language Navigation in Continuous Environments**.

- Website: https://daiguangzhao.github.io/gpt-6-astra-for-vln/
- arXiv: https://arxiv.org/abs/2609.29861
- Updated report: `assets/technical-report-v2.pdf` (25 September 2026)

This is a static website served by GitHub Pages from `main` / repository root. No build step, package installation, external fonts, or API keys are needed.

To preview locally, run `python3 -m http.server 8767` in this directory.

`index.html` contains the paper summary, static comparison table, and citation. `styles.css` contains responsive styles. `script.js` adds section navigation, figure enlargement, method filtering, the EP42 observation viewer, and citation copying. All images and the downloadable PDF are local assets from the updated report. `data.json` contains the displayed comparison rows and observation metadata.

The web results and PDF reflect the updated V2 analysis. The arXiv page currently hosts the initial 24 September release. Earlier workflow-study results and media are kept on the separate V1 website.

The page draws layout inspiration from the MIP project page and the earlier GPT-6-Astra navigation project website. Figures and quantitative claims are sourced from this report; MIP is credited for the underlying harness-based evaluation setup.
