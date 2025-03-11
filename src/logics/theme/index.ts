import { getThemeColors, generateColors } from '../../../build/config/themeConfig'

import { replaceStyleVariables } from 'vite-plugin-theme/es/client'
import { mixLighten, mixDarken, tinycolor } from 'vite-plugin-theme/es/colorUtils'
import { setCssVar } from './util'

export async function changeTheme(color: string) {

  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
    color,
  })

  setCssVar('--vxe-ui-font-primary-color', color)
  setCssVar('--erp-primary-color', color)

  return await replaceStyleVariables({
    colorVariables: [...getThemeColors(color), ...colors],
  })
}
