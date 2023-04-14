import "../styles/globals.css"
import "@fontsource/open-sans"
import "@fontsource/teko"

import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { createTheme, ThemeProvider  } from '@mui/system';
import { CssBaseline } from '@mui/material'
import Box from "@mui/material/Box"

import PopupLayout from "../components/Layout/PopupLayout"
import store from "../state/store"

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 375,
      sm: 600,
      md: 1280,
      lg: 1440,
      xl: 1920
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-testid="app-react">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {/* <CssBaseline /> */}
          <PopupLayout>
            <div className="background-wrapper">
              <div className="overlay-image"></div>
            </div>
            <Box display="flex" position='relative'>
              <Component {...pageProps} />
            </Box>
            <ToastContainer />
          </PopupLayout>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default MyApp
