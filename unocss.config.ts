import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    [
      'btn',
      'px-4 py-1 text-white rounded-full inline-flex items-center justify-center cursor-pointer disabled:cursor-default disabled:opacity-50',
    ],
    ['btn-primary', 'bg-primary-dark hover:bg-primary-light'],
    [
      'btn-secondary',
      'bg-primary-dark dark:bg-opacity-100 !dark:bg-white hover:bg-primary-light bg-opacity-10 text-primary-dark hover:bg-opacity-25 ',
    ],
    ['btn-destructive', 'bg-red-dark hover:bg-red-light'],
    ['btn-lg', 'h-48px '],
    ['btn-sm', 'h-40px'],
    ['heading', 'font-bold'],
    ['heading-xl', 'text-24px leading-30px'],
    ['heading-lg', 'text-18px leading-23px'],
    ['heading-md', 'text-15px leading-19px'],
    ['heading-sm', 'text-12px leading-15px tracking-2.4px'],
    ['paragraph', 'text-left'],
    ['paragraph-lg', 'text-13px leading-23px font-medium'],
    ['paragraph-sm', 'text-12px leading-15px font-bold'],
  ],
  rules: [],
  theme: {
    colors: {
      primary: {
        light: '#A7A4FF',
        dark: '#645FC7',
      },
      black: {
        darker: '#000112',
        dark: '#20212C',
        medium: '#2B2C37',
        light: '#3E3F4E',
      },
      gray: {
        dark: '#828FA3',
        medium: '#E4EBFA',
        light: '#F4F7FD',
      },
      red: {
        light: '#FF9898',
        dark: '#EA5655',
      },
      white: '#FFFFFF',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),

    presetWebFonts({
      provider: 'google',
      fonts: {
        jakarta: [
          {
            name: 'Plus Jakarta Sans',
            weights: ['400', '700'],
            italic: true,
          },
          {
            name: 'sans-serif',
            provider: 'none',
          },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
