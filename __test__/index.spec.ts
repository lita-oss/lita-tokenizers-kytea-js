import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import test from 'ava'

import { KyTea } from '../index'

const require = createRequire(import.meta.url)
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const hasLocalWasm =
  existsSync(join(rootDir, 'package-template.wasm32-wasi.wasm')) ||
  existsSync(join(rootDir, 'package-template.wasm32-wasi.debug.wasm'))

test('KyTea exposes the native version as a static method', (t) => {
  t.is(KyTea.version(), '0.4.8')
})

test('@napi-rs/wasm-runtime is resolvable for the generated WASI loader', (t) => {
  t.notThrows(() => require.resolve('@napi-rs/wasm-runtime'))
})

const testWasiBinding = hasLocalWasm ? test : test.skip

testWasiBinding('generated WASI binding loads from a local wasm artifact', (t) => {
  const binding = require(join(rootDir, 'package-template.wasi.cjs')) as {
    KyTea: { version: () => string }
  }
  t.is(binding.KyTea.version(), '0.4.8')
})
