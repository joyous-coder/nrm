# GitHub Actions Setup

This fork uses **Trusted Publishing** (OIDC) to publish to npmjs.org without
a long-lived `NPM_TOKEN` secret. The publish is triggered by a GitHub
Release, runs the test suite, and (only if tests pass) pushes the tarball
to npmjs.org.

## One-time setup on npmjs.com

After the first push of `.github/workflows/publish.yml`:

1. Open https://www.npmjs.com/package/@joyous-coder/nrm → **Settings**
2. Go to **Publishing access** → **Trusted Publishers**
3. Click **Add a trusted publisher** → **GitHub**
4. Fill in:
   - **Owner:** `joyous-coder`
   - **Repository:** `nrm`
   - **Workflow filename:** `.github/workflows/publish.yml`
5. Click **Add**

After that, every GitHub Release you cut on this repo will trigger the
publish workflow, which will OIDC-authenticate to npmjs as you and run
`npm publish --provenance --access public`.

## Cutting a release

```bash
git checkout release
# 1. bump version in package.json
# 2. update README.md "Changes vs upstream" if needed
# 3. commit & push
git commit -am "chore(release): 2.1.2"
git push origin release

# 4. cut a GitHub Release tagged v2.1.2 (draft or pre-release are fine)
gh release create v2.1.2 --title "v2.1.2" --notes "- whatever changed"
```

The `release: types: [created]` trigger then runs `publish.yml`, which
calls `pnpm test` → `pnpm run build` → `npm publish --provenance`.

## Manual run

You can also trigger the workflow manually from the Actions tab via
**Run workflow**, optionally with a version override input. This is useful
for re-publishing without cutting a release.
