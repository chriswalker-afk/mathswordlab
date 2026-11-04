# Maths Words Lab

**Maths Words Lab** is a self-contained mathematics vocabulary practice website with course-based term banks and games.

- **New website:** https://words.mrwalkermaths.com/
- **Original website:** https://mathswordslab.netlify.app/
- **Source repository:** https://github.com/chriswalker-afk/mathswordlab

## GitHub Pages

The website consists of one standalone `index.html` with embedded CSS and JavaScript. No Netlify Functions, external app scripts, stylesheets, images, or server-side backend are required.

To activate the custom domain after this PR merges:

1. Open [Settings → Pages](https://github.com/chriswalker-afk/mathswordlab/settings/pages).
2. Select **Deploy from a branch**, set **main / (root)**, and save.
3. Save the **Custom domain** as `words.mrwalkermaths.com`.
4. When available, enable **Enforce HTTPS** and open https://words.mrwalkermaths.com/ .

Cloudflare DNS has already been configured as a **DNS-only CNAME** from `words.mrwalkermaths.com` to `chriswalker-afk.github.io`.

## Migration provenance and verification

On **4 November 2026**, the complete HTML application was fetched from the live Netlify website and imported. Only two host-specific items were removed:

- The Netlify-injected HUD/dashboard script, which cannot load on GitHub Pages.
- An obsolete HTML comment stating that the site was hosted on Netlify.

The GitHub HTML was compared byte-for-byte against the Netlify response **after removing those two items**. The normalized HTML was identical (SHA-256: `89b4c7b57a41d58a604ed391cd7db429955ba7e1732368e2692740bfdbda1fe7`). The comparison was executed in GitHub Actions and passed. Automated tests also check the standalone HTML structure and embedded JavaScript syntax.

Keep the original Netlify deployment online while reviewing the GitHub Pages version.

## Student progress

Browser local storage is separate for each website origin. Student progress or preferences saved on `mathswordslab.netlify.app` **will not automatically appear** on `words.mrwalkermaths.com`. Preserve any existing progress before retiring the old domain.
