import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    // you can optionally set Nuxt-specific environment options
    environmentOptions: {
      nuxt: {
        // rootDir: fileURLToPath(new URL('./playground', import.meta.url)),
        domEnvironment: 'happy-dom', // 'happy-dom' (default) or 'jsdom'
        // overrides: {
        //   // other Nuxt config you want to pass
        // }
      }
    }
  },
  resolve: {
    alias: {
      // CJS ではなく ESM を明示して選ばせる
      '@vue/test-utils': '@vue/test-utils/dist/vue-test-utils.mjs',
    },
  },
  // SSR 時に外部化されると Node 側の解決（= CJS 寄り）になりがち
  ssr: {
    noExternal: ['@vue/test-utils'],
  },
})