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
import { Button } from "@ory/themes"
import isEmpty from "lodash/isEmpty"
import queryString from "query-string"
import { Component, FormEvent, MouseEvent } from "react"

import Apple from "../../public/images/login_icons/Apple"
import Google from "../../public/images/login_icons/Google"
import { StyledMenuLine } from "../../styles/share"

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
  // hide social login options
  hideSocialLogin?: boolean
  code?: string
  lang?: any
}

function emptyState<T>() {
  return {} as T
}

type State<T> = {
  values: T
  isLoading: boolean
}

export class Flow<T extends Values> extends Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props)
    this.state = {
      values: emptyState(),
      isLoading: false,
    }
  }

  componentDidMount() {
    this.initializeValues(this.filterNodes())
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.code !== this.props.code) {
      this.setCodeValue(this.props.code)
    }
  }

  setCodeValue = async (code: string | undefined) => {
    const nodeId = "code"
    const node = this.getNodeById(nodeId)

    if (node) {
      await this.handleSetValue(node, code)
    }
  }

  getNodeById = (nodeId: keyof Values): UiNode | undefined => {
    const nodes = this.filterNodes()
    return nodes.find((node) => getNodeId(node) === nodeId)
  }

  handleSetValue = async (node: UiNode, value: any) => {
    const id = getNodeId(node) as keyof Values

    return new Promise((resolve) => {
      this.setState(
        (state) => ({
          ...state,
          values: {
            ...state.values,
            [id]: value,
          },
        }),
        resolve,
      )
    })
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
    const nodes = flow?.ui?.nodes || []
    return nodes.filter(({ group }) => {
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
        // alert(method.value)
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
        this.setState((state) => {
          return {
            ...state,
            isLoading: false,
          }
        })
      })
  }

  render() {
    const { hideGlobalMessages, flow, router, lang } = this.props
    const { values, isLoading } = this.state

    // Filter the nodes - only show the ones we want
    let nodes = this.filterNodes()

    if (!flow) {
      // No flow was set yet? It's probably still loading...
      //
      // Nodes have only one element? It is probably just the CSRF Token
      // and the filter did not match any elements!
      return null
    }

    if (router?.pathname === "/registration") {
      const list = ["Name", "E-Mail", "Password", "Sign up"]
      nodes = nodes
        .map((item) => item)
        .sort(
          (a, b) =>
            list.indexOf(a.meta.label?.text) - list.indexOf(b.meta.label?.text),
        )
    }

    const getShowGlobalMessages = () => {
      if (hideGlobalMessages) return false
      if (!isEmpty(flow?.ui?.messages)) return true
      if (window.location.pathname === "/recovery") {
        const [message] = flow.ui.messages
        if (message.text?.includes("Email account")) {
          return true
        }
        return true
      }
      return false
    }

    const showGlobalMessages = getShowGlobalMessages()
    const isLoginPath = router?.pathname === "/login"
    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={this.handleSubmit}
      >
        {nodes.map((node, k) => {
          console.log("@filterNodes node:", node)

          // list excludedFields
          const excludedFields = {
            registration: [
              "traits.phone",
              "traits.birthdayYear",
              "traits.birthdayMonth",
              "traits.gender",
            ],
          }

          // grab the pathname remove the slash and type it to be a key of excludedFields
          const pathname = window.location.pathname.substring(
            window.location.pathname.lastIndexOf("/") + 1,
          ) as keyof typeof excludedFields

          // filter all nodes that are in the excludedFields belonging to this path route
          if (excludedFields[pathname]?.includes(node.attributes.name)) return

          const id = getNodeId(node) as keyof Values
          return (
            <span
              key={`${id}-${k}`}
              className={
                node?.meta?.label?.text === "Submit" ? "targetDestination" : ""
              }
            >
              <Node
                className={
                  node?.meta?.label?.text === "Submit"
                    ? "targetDestination"
                    : ""
                }
                disabled={isLoading}
                node={node}
                value={
                  getNodeId(node) === "code" ? this.props.code : values[id]
                }
                lang={lang}
                dispatchSubmit={this.handleSubmit}
                setValue={(value) =>
                  new Promise((resolve) => {
                    this.setState(
                      (state) => ({
                        ...state,
                        values: {
                          ...state.values,
                          [getNodeId(node)]:
                            getNodeId(node) === "code"
                              ? this.props.code
                              : value,
                          // [getNodeId(node)]: value,
                        },
                      }),
                      resolve,
                    )
                  })
                }
                validationMsgs={flow.ui.messages}
              />
            </span>
          )
        })}
        {showGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
        {!this.props.hideSocialLogin && (
          <Box
            mt="8px"
            mb="38px"
            color="#A5A5A9"
            fontSize="14px"
            fontFamily="open sans"
            display="flex"
            justifyContent="center"
            gap="4px"
          >
            <Box>
              {this.props.router?.pathname === "/login"
                ? `${lang?.noAccount}?`
                : `${lang?.alreadyHaveAcct}`}
            </Box>

            <Box
              color="#CA4AE8"
              sx={{
                cursor: "pointer",
                ":hover": {
                  filter: "brightness(1.5)",
                },
              }}
              onClick={() => {
                const { router, flow } = this.props
                if (isLoginPath) {
                  if (isEmpty(flow?.oauth2_login_request)) {
                    return router.push("/registration")
                  }
                  const queryStr =
                    flow?.oauth2_login_request.request_url.split("?")[1]
                  const oauth2Query = queryString.parse(queryStr)
                  return router.push(
                    `/registration?return_to=${oauth2Query.return_to}`,
                  )
                }
                return router.push("/login")
              }}
            >
              {isLoginPath ? ` ${lang?.signUp}` : ` ${lang?.login}`}
            </Box>
          </Box>
        )}
        {!this.props.hideSocialLogin && (
          <Box
            color="#A5A5A9"
            fontSize="14px"
            fontFamily="open sans"
            display="flex"
            justifyContent="center"
          >
            <StyledMenuLine>
              <Box className="text">
                <Box
                  height="19px"
                  width="fit-content"
                  zIndex={1}
                  bgcolor="#1D1D28"
                  padding="0 10px"
                >
                  {this.props.router?.pathname === "/login"
                    ? lang?.loginOtherAccount
                    : lang?.signupOtherAcct}
                </Box>
              </Box>
            </StyledMenuLine>
          </Box>
        )}
        {!this.props.hideSocialLogin && (
          <Box
            display="flex"
            gap="24px"
            justifyContent="center"
            my="24px"
            height="44px"
          >
            <Button
              name="provider"
              value="google"
              disabled={false}
              type="submit"
              style={{
                padding: "0px",
                margin: "0px",
                bordeRadius: "0px",
                borderWidth: "0px",
                borderStyle: "none",
                borderColor: "transparent",
                backgroundColor: "transparent",
              }}
            >
              <Google />
            </Button>
            <Button
              name="provider"
              value="apple"
              disabled={false}
              type="submit"
              style={{
                padding: "0px",
                margin: "0px",
                bordeRadius: "0px",
                borderWidth: "0px",
                borderStyle: "none",
                borderColor: "transparent",
                backgroundColor: "transparent",
              }}
            >
              <Apple />
            </Button>
          </Box>
        )}
      </form>
    )
  }
}
