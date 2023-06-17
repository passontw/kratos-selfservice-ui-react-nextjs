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
import { appWithTranslation, useTranslation } from "next-i18next"

import PopupLayout from "../components/Layout/PopupLayout"
import store from "../state/store"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

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
  const { t } = useTranslation('common')
  const lang = {
    cancel: t('cancel'),
  }
  return (
    <div data-testid="app-react">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PopupLayout lang={lang}>
            <div className="main-container">
              {/* <div className="background-wrapper">
                <div className="overlay-image"></div>
              </div> */}
              <Component {...pageProps} />
            </div>
            <ToastContainer />
          </PopupLayout>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default appWithTranslation(MyApp)

export async function getStaticProps({ locale } : any) {
  return {
    props: {...(await serverSideTranslations(locale, ['common']))},
  }
}
