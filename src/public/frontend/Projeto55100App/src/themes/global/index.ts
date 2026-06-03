import { THEME } from '../../config/constants'
import type { GlobalTheme, ThemeName } from './types'
import themePurple from './themePurple'
import themeDark   from './themeDark'
import themeLight  from './themeLight'
import themeGreen  from './themeGreen'
import themeBlue   from './themeBlue'
import themeRed    from './themeRed'

export type { GlobalTheme, ThemeName }

const themes: Record<ThemeName, GlobalTheme> = {
  Purple: themePurple,
  Dark:   themeDark,
  Light:  themeLight,
  Green:  themeGreen,
  Blue:   themeBlue,
  Red:    themeRed,
}

export function getActiveTheme(): GlobalTheme {
  return themes[THEME as ThemeName] ?? themePurple
}
