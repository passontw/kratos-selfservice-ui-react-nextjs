import { Grid } from "@mui/material"
import Box from "@mui/material/Box"
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNode,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client"
import { getNodeId, isUiNodeInputAttributes } from "@ory/integrations/ui"
import React, { Component, FormEvent, MouseEvent } from "react"

import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"
import Switch from "../Switch"

import { Messages } from "./Messages"
import { Node } from "./Node"

export type Values = Partial<
  | UpdateLoginFlowBody
  | UpdateRegistrationFlowBody
  | UpdateRecoveryFlowBody
  | UpdateSettingsFlowBody
  | UpdateVerificationFlowBody
>

// interface ValuesCustomProps extends Values {
//   noEmail: boolean
// }

export type Methods =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "link"
  | "lookup_secret"

export type Props<T> = {
  // The flow
  flow?:
    | LoginFlow
    | RegistrationFlow
    | SettingsFlow
    | VerificationFlow
    | RecoveryFlow
  // Only show certain nodes. We will always render the default nodes for CSRF tokens.
  only?: Methods
  // Is triggered on submission
  onSubmit: (values: T) => Promise<void>
  // Do not show the global messages. Useful when rendering them elsewhere.
  hideGlobalMessages?: boolean
  lang?: any
}

function emptyState<T>() {
  return {} as T
}

type State<T> = {
  values: T
  isLoading: boolean
  overlayStyles: {
    padding: string
    innerPadding: string
    fontSize: string
    lineHeight: string
    height: string
    marginTop: string
  }
}

export class Flow<T extends Values> extends Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props)
    this.state = {
      values: emptyState(),
      isLoading: false,
      overlayStyles: {
        padding: "30",
        fontSize: "20",
        lineHeight: "42",
        innerPadding: "22",
        height: "90",
        marginTop: "30",
      },
    }
  }

  componentDidMount() {
    // init initial settings
    this.handleCalcPadding()
    // adjust settings on window re-size
    window.addEventListener("resize", this.handleCalcPadding)
  }

  componentWillUnmount() {
    // clear listener to prevent memory leak
    window.addEventListener("resize", this.handleCalcPadding)
  }

  handleCalcPadding = () => {
    const vw = window.innerWidth
    if (vw < 600) {
      this.setState({
        overlayStyles: {
          padding: "10",
          innerPadding: "18",
          fontSize: "16",
          lineHeight: "24",
          height: "60",
          marginTop: "18",
        },
      })
    } else {
      this.setState({
        overlayStyles: {
          padding: "30",
          innerPadding: "24",
          fontSize: "20",
          lineHeight: "42",
          height: "90",
          marginTop: "30",
        },
      })
    }
  }

  initializeValues = (nodes: Array<UiNode> = []) => {
    // Compute the values
    const values = emptyState<T>()
    nodes.forEach((node) => {
      // This only makes sense for text nodes
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === "button" ||
          node.attributes.type === "submit"
        ) {
          // In order to mimic real HTML forms, we need to skip setting the value
          // for buttons as the button value will (in normal HTML forms) only trigger
          // if the user clicks it.
          return
        }
        values[node.attributes.name as keyof Values] = node.attributes.value
        // console.log(values)
      }
    })

    // Set all the values!
    this.setState((state) => ({ ...state, values }))
  }

  filterNodes = (): Array<UiNode> => {
    const { flow, only } = this.props
    // console.log(flow)
    if (!flow) {
      return []
    }
    return flow.ui.nodes.filter(({ group }) => {
      if (!only) {
        return true
      }
      return group === "default" || group === only
    })
  }

  // Handles form submission
  handleSubmit = (event: FormEvent<HTMLFormElement> | MouseEvent) => {
    // Prevent all native handlers
    event.stopPropagation()
    event.preventDefault()

    // Prevent double submission!
    if (this.state.isLoading) {
      return Promise.resolve()
    }

    const form = event.currentTarget

    let body: T | undefined

    if (form && form instanceof HTMLFormElement) {
      const formData = new FormData(form)

      // map the entire form data to JSON for the request body
      body = Object.fromEntries(formData) as T

      const hasSubmitter = (evt: any): evt is { submitter: HTMLInputElement } =>
        "submitter" in evt

      // We need the method specified from the name and value of the submit button.
      // when multiple submit buttons are present, the clicked one's value is used.
      if (hasSubmitter(event.nativeEvent)) {
        const method = event.nativeEvent.submitter
        body = {
          ...body,
          ...{ [method.name]: method.value },
        }
      }
    }

    this.setState((state) => ({
      ...state,
      isLoading: true,
    }))

    return this.props
      .onSubmit({ ...body, ...this.state.values })
      .finally(() => {
        // We wait for reconciliation and update the state after 50ms
        // Done submitting - update loading status
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }))
      })
  }

  render() {
    const { hideGlobalMessages, flow, lang } = this.props
    const { values, isLoading } = this.state

    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes()
    if (!flow) {
      // No flow was set yet? It's probably still loading...
      //
      // Nodes have only one element? It is probably just the CSRF Token
      // and the filter did not match any elements!
      return null
    }

    const { overlayStyles } = this.state

    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={this.handleSubmit}
      >
        <Box minHeight={"130px"}>
          <Grid
            container
            spacing={{ xs: 2, sm: 4 }}
            // flexDirection={{ xs: "column-reverse", sm: "row-reverse" }}
            position={"relative"}
          >
            {/* {!hideGlobalMessages ? (
              <Messages messages={flow.ui.messages} />
            ) : null} */}

            <Grid
              className="overlay-accounts"
              container
              style={{
                position: "absolute",
                top: 0,
                left: `${overlayStyles.padding}px`,
                width: "100%",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ position: "relative", zIndex: 3 }}
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    backgroundColor: "rgb(39, 39, 53)",
                    opacity: 1,
                    fontFamily: "open sans",
                    height: `${overlayStyles.height}px`,
                    marginTop: `${overlayStyles.marginTop}px`,
                    width: `calc(100% - ${overlayStyles.padding}px)`,
                    borderRadius: "12px",
                    padding: `${overlayStyles.innerPadding}px`,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex" }}>
                      <Google />
                      <div
                        style={{
                          fontSize: `${overlayStyles.fontSize}px`,
                          color: "#fff",
                          marginLeft: "20px",
                          lineHeight: `${overlayStyles.lineHeight}px`,
                        }}
                      >
                        Google
                      </div>
                    </div>
                    <div
                      style={{
                        height: overlayStyles.padding,
                        width: "40px",
                        backgroundColor: "#272735",
                        opacity: 0.3,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Switch on={true} />
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                sx={{ position: "relative", zIndex: 3 }}
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    backgroundColor: "rgb(39, 39, 53)",
                    opacity: 1,
                    fontFamily: "open sans",
                    height: `${overlayStyles.height}px`,
                    marginTop: `${overlayStyles.marginTop}px`,
                    width: `calc(100% - ${overlayStyles.padding}px)`,
                    borderRadius: "12px",
                    padding: `${overlayStyles.innerPadding}px`,
                  }}
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex" }}>
                      <Apple />

                      <div
                        style={{
                          fontSize: `${overlayStyles.fontSize}px`,
                          color: "#fff",
                          marginLeft: "20px",
                          lineHeight: `${overlayStyles.lineHeight}px`,
                        }}
                      >
                        Apple
                      </div>
                    </div>
                    <div
                      style={{
                        height: overlayStyles.padding,
                        width: "40px",
                        backgroundColor: "#272735",
                        opacity: 0.3,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Switch on={true} />
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>

            {nodes.reverse().map((node, k) => {
              const excludedFields = {
                account: ["email"],
              }
              // const pathname = window.location.pathname.slice(
              //   1,
              // ) as keyof typeof excludedFields

              if (node.attributes.name.includes("email")) return
              const id = getNodeId(node) as keyof Values
              if (node.attributes.type == "hidden") {
                return (
                  <Node
                    key={`${id}-${k}`}
                    disabled={isLoading}
                    node={node}
                    value={values[id]}
                    dispatchSubmit={this.handleSubmit}
                    lang={lang}
                    setValue={(value) =>
                      new Promise((resolve) => {
                        this.setState(
                          (state) => ({
                            ...state,
                            values: {
                              ...state.values,
                              [getNodeId(node)]: value,
                            },
                          }),
                          resolve,
                        )
                      })
                    }
                  />
                )
              } else {
                console.log("@debugAccountLink node:", node)
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    sx={{
                      position: "relative",
                      zIndex: 4,

                      "& + &": { marginTop: { xs: "66px", sm: "0px" } },
                    }}
                  >
                    <div style={{ position: "relative", zIndex: 4 }}>
                      <Node
                        key={`${id}-${k}`}
                        disabled={isLoading}
                        node={node}
                        value={values[id]}
                        dispatchSubmit={this.handleSubmit}
                        // handleToast={this.props?.handleToast}
                        setValue={(value) =>
                          new Promise((resolve) => {
                            this.setState(
                              (state) => ({
                                ...state,
                                values: {
                                  ...state.values,
                                  [getNodeId(node)]: value,
                                },
                              }),
                              resolve,
                            )
                          })
                        }
                      />
                    </div>
                  </Grid>
                )
              }
              // if (this.props.noEmail && node.meta.label?.text === "E-Mail") return
              // if (node.meta.label?.text === "E-Mail") return
            })}
          </Grid>
        </Box>
      </form>
    )
  }
}
