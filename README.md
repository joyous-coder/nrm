# @joyous-coder/nrm

> Drop-in fork of [Pana/nrm](https://github.com/Pana/nrm) that fixes the
> `~/.npmrc` pollution bug: `nrm use <name>` no longer leaks `_auth`,
> `always-auth`, `email`, `repository`, or `home` to the top level of your
> `~/.npmrc`.

## Install

```bash
npm install -g @joyous-coder/nrm
```

> **Note:** this is a **scoped** package. Install as `@joyous-coder/nrm`,
> not `nrm` (which is the original). The CLI binary is still called `nrm`,
> so `nrm use taobao` works exactly the same after install.

## What's fixed

### Before (upstream bug)

If your `~/.nrmrc` had a registry entry with auth:

```ini
[myregistry]
registry = https://registry.example.com/
_auth = "c2VjcmV0OnBhc3N3b3Jk"
```

then `nrm use myregistry` would write **all** of these into your `~/.npmrc`:

```ini
registry = https://registry.example.com/
home = https://www.example.com          ← leaked (registry-internal)
always-auth = true                      ← leaked (registry-internal)
_auth = "c2VjcmV0OnBhc3N3b3Jk"          ← leaked as a GLOBAL field (bug)
email = you@example.com                 ← leaked
```

This polluted npm config with a global `_auth` that didn't belong there,
and could shadow your real `//host/:_authToken=...` entries.

### After (this fork)

`nrm use <name>` now writes **only** `registry` (and any existing
`@scope:registry` entries) to `~/.npmrc`. All other registry-internal
fields stay where they belong — in `~/.nrmrc`.

If you do need to publish auth (`nrm login`), it's now written to the
correct scoped form: `//host/path/:_auth=...`, not the top level.

## Usage

This is a drop-in fork — every command works identically to upstream.
See the upstream [Pana/nrm README](https://github.com/Pana/nrm) for full
usage reference.

```bash
nrm ls
nrm use taobao
nrm add myregistry https://registry.example.com/
nrm login myregistry -u alice -p secret
nrm test
```

## Changes vs upstream

| Area | Change |
| --- | --- |
| `src/constants.ts` | Added `NPMRC_ALLOWED_TOP_LEVEL_KEYS` whitelist and `scopedAuthKey()` helper |
| `src/helpers.ts` | Added `filterNpmrcAllowed()` — the single chokepoint that decides what may enter `~/.npmrc` |
| `src/actions.ts` | `onUse` / `onLogin` / `onSetAttribute` / `onSetScope` all funnel through the whitelist; `onLogin` now writes `_auth` to the scoped form |
| `tests/cli.test.ts` | 4 new regression tests covering the leak, scope entries, and the public built-in registries |

All upstream functionality is preserved.

## Credits

- Original project: [Pana/nrm](https://github.com/Pana/nrm) — by
  [@Pana](https://github.com/Pana) and contributors
- This fork: [@joyous-coder/nrm](https://github.com/joyous-coder/nrm)

## License

MIT — same as upstream.
