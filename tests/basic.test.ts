import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils-edge'

describe('example', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('..', import.meta.url)),
    server: true,
  })

  it('Renders Hello Nuxt', async () => {
    const html = await $fetch('/')
    expect(html).toContain(`<html  lang="en" data-head-attrs="lang">`)
  })
})
