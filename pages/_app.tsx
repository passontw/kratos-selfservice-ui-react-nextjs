import "../styles/globals.css"
import "@fontsource/open-sans"
import "@fontsource/teko"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import { globalStyles, ThemeProps } from "@ory/themes"
import { appWithTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import type { AppProps } from "next/app"
import "react-image-crop/src/ReactCrop.scss"
import { Provider } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { createGlobalStyle } from "styled-components"

import PopupLayout from "../components/Layout/PopupLayout"
import store from "../state/store"
import { useI18nConfig } from "../util/i18n-config"

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

if (process.env.NODE_ENV === "production") {
  console = {
    log: () => {},
    warn: () => {},
    error: () => {},
    info: () => {},
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const lang = useI18nConfig()
  const PagePropsWithI18n = { ...pageProps, lang }
  return (
    <div data-testid="app-react">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PopupLayout lang={lang}>
            <div className="main-container">
              <div className="background-wrapper">
                <div className="overlay-image"></div>
              </div>
              <Component {...PagePropsWithI18n} />
            </div>
            <ToastContainer />
          </PopupLayout>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default appWithTranslation(MyApp)

export async function getStaticProps({ locale }: any) {
  return {
    props: { ...(await serverSideTranslations(locale, ["common"])) },
  }
}
