// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  fonts: [{
      provider: fontProviders.local(),
      name: "Pixel32",
      cssVariable: "--font-pixel32",
      options: {
      variants: [{
          src: ['./src/assets/Pixel32.v1.9.7.woff'],
          weight: 'normal',
          style: 'normal'
      }]
      }
  }],

  adapter: vercel()
});