import { createTheme, ThemeProvider, styled } from '@mui/material/styles';


export const themeOptions = createTheme({
    palette: {
      type: 'light',
      primary: {
        main: '#939876',
      },
      secondary: {
        main: '#8883a2',
      },
      error: {
        main: '#a29883',
      },
      warning: {
        main: '#8da283',
      },
      info: {
        main: '#839da2',
      },
      success: {
        main: '#5F5B71',
      },
      custom:{
        main:'#5F5B71',
      },
      background: {
        default: '#fff7ed',
      },
    },
    typography: {
      h1: {
        fontFamily: `'Lora', serif`,
      },
      h2: {
        fontFamily: `'Lora', serif`,
      },
      h3: {
        fontFamily: `'Lora', serif`,
      },
      h4: {
        fontFamily: `'Lora', serif`,
      },
      h5: {
        fontFamily: `'Lora', serif`,
      },
      h6: {
        fontFamily: `'Lora', serif`,
      },
      subtitle1: {
        fontFamily: 'Open Sans',
      },
      subtitle2: {
        fontFamily: 'Open Sans',
        fontWeight: 500,
        lineHeight: 1.6,
      },
      body1: {
        fontFamily: 'Lato',
      },
      body2: {
        fontFamily: 'Lato',
      },
      button: {
        fontFamily: 'Source Sans Pro',
      },
      overline: {
        fontFamily: 'Source Sans Pro',
        letterSpacing: '0.04em',
      },
      caption: {
        fontFamily: 'Lato',
      },
      fontFamily: 'Lato',
    },
  });