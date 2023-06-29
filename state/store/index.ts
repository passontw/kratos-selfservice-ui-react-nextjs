import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"

import layoutReducer from "./slice/layoutSlice"
import verificationReducer from "./slice/verificationSlice"

export default configureStore({
  reducer: {
    layout: layoutReducer,
    verification: verificationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})
