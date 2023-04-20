import "../styles/globals.css"
// import "../styles/react-toastify.min.css"
import "@fontsource/open-sans"
import "@fontsource/teko"
import Box from "@mui/material/Box"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import { globalStyles, ThemeProps } from "@ory/themes"
import type { AppProps } from "next/app"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { createGlobalStyle } from "styled-components"

import AppsList from "../components/AppsList"
import PopupLayout from "../components/Layout/PopupLayout"
import store from "../state/store"

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props),
)

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1280,
      lg: 1440,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: ["Open Sans"].join(","),
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div data-testid="app-react">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PopupLayout>
            <Box display="flex" position="relative">
              <div className="background-wrapper">
                <div className="overlay-image"></div>
              </div>
              <Component {...pageProps} />
              <AppsList />
            </Box>
            <ToastContainer />
          </PopupLayout>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default MyApp
