import "../styles/globals.css"
import "@fontsource/open-sans"
import "@fontsource/teko"
import Box from "@mui/material/Box"
import { theme, globalStyles, ThemeProps } from "@ory/themes"
import type { AppProps } from "next/app"
import { Provider, useSelector } from "react-redux"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { ThemeProvider } from "styled-components"
import { createGlobalStyle } from "styled-components"

import AppsList from "../components/AppsList"
import PopupLayout from "../components/Layout/PopupLayout"
import store from "../state/store"
import { selectActiveNav } from "../state/store/slice/layoutSlice"
import { Navs } from "../types/enum"

const GlobalStyle = createGlobalStyle((props: ThemeProps) =>
  globalStyles(props),
)

function MyApp({ Component, pageProps }: AppProps) {
  const activeNav = useSelector(selectActiveNav)

  return (
    <div data-testid="app-react">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PopupLayout>
            <div className="background-wrapper">
              <div className="overlay-image"></div>
            </div>
            <Box display="flex">
              <Component {...pageProps} />
              {activeNav !== Navs.SETTINGS && <AppsList />}
            </Box>
            <ToastContainer />
          </PopupLayout>
        </ThemeProvider>
      </Provider>
    </div>
  )
}

export default MyApp
