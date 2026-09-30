import os from 'node:os';
import path from 'node:path';
import type { RegistryConfig } from './types.js';

export const REGISTRIES: RegistryConfig = {
  npm: {
    home: 'https://www.npmjs.org',
    registry: 'https://registry.npmjs.org/',
  },
  yarn: {
    home: 'https://yarnpkg.com',
    registry: 'https://registry.yarnpkg.com/',
  },
  tencent: {
    home: 'https://mirrors.tencent.com/npm/',
    registry: 'https://mirrors.tencent.com/npm/',
  },
  cnpm: {
    home: 'https://cnpmjs.org',
    registry: 'https://r.cnpmjs.org/',
  },
  taobao: {
    home: 'https://npmmirror.com',
    registry: 'https://registry.npmmirror.com/',
  },
  npmMirror: {
    home: 'https://skimdb.npmjs.com/',
    registry: 'https://skimdb.npmjs.com/registry/',
  },
  huawei: {
    home: 'https://www.huaweicloud.com/special/npm-jingxiang.html',
    registry: 'https://repo.huaweicloud.com/repository/npm/',
  },
};

export const HOME = 'home';
export const AUTH = '_auth';
export const EMAIL = 'email';
export const REGISTRY = 'registry';
export const REPOSITORY = 'repository';
export const ALWAYS_AUTH = 'always-auth';
export const REGISTRY_ATTRS = [REGISTRY, HOME, AUTH, ALWAYS_AUTH];
export const NRMRC = path.join(os.homedir(), '.nrmrc');
export const NPMRC = path.join(os.homedir(), '.npmrc');

/**
 * Keys that are safe to write to ~/.npmrc at the top level.
 * Anything else (especially _auth, always-auth, email, repository, home)
 * must NOT be written at the top level — npm applies those as scoped
 * `//host/path/:_auth=...` entries, not globals. See:
 * https://docs.npmjs.com/cli/v10/configuring-npm/npmrc
 */
export const NPMRC_ALLOWED_TOP_LEVEL_KEYS = new Set<string>([
  REGISTRY,
  // scope entries look like `@scope:registry`; they are written by
  // onSetScope and must be allowed through.
]);

/**
 * Build the scoped `_auth` key for a registry URL, e.g.
 *   https://registry.example.com/  →  //registry.example.com/:_auth
 * which is the npm-canonical form for scoped basic-auth credentials.
 */
export function scopedAuthKey(registryUrl: string): string {
  let host = '';
  try {
    host = new URL(registryUrl).host;
  } catch {
    // best-effort fallback: strip protocol by hand
    host = registryUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
  return `//${host}/:_auth`;
}
