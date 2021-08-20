#!/usr/bin/env node
/* eslint-env node */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import swc from '@swc/core'
import fg from 'fast-glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packageRoot = path.resolve(
  __dirname,
  '../../../../packages/graphql-server'
)

const configFile = path.join(packageRoot, '.swcrc')
const srcRoot = path.resolve(packageRoot, 'src')

console.log('Building ', packageRoot)
console.time('...Done. Took')

const code = fg.sync('**/*.ts', {
  cwd: srcRoot,
  ignore: ['**/*.test.ts', '**/__tests__/**', '**/__mocks__/**', '**/*.d.ts'],
})
for (const srcPath of code) {
  const dest = path.join(packageRoot, 'dist', srcPath)
  const result = swc.transformFileSync(path.join(srcRoot, srcPath), {
    sourceMaps: 'inline',
    cwd: srcRoot,
    configFile,
    outputPath: dest,
  })
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest.replace(/\.(ts|tsx)$/, '.js'), result.code)
}

console.timeEnd('...Done. Took')
