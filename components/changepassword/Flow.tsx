import Box from "@mui/material/Box"
import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
  UiNode,
} from "@ory/client"
import { getNodeId } from "@ory/integrations/ui"
import { isUiNodeInputAttributes } from "@ory/integrations/ui"
import { TextInput } from "@ory/themes"
import isEmpty from "lodash/isEmpty"
import { Component, FormEvent } from "react"

import { NodeInputDefault } from "../../pkg/ui/NodeInputDefault"
import { NodeInputHidden } from "../../pkg/ui/NodeInputHidden"
import { NodeInputSubmit } from "../../pkg/ui/NodeInputSubmit"
import Eye from "../../public/images/eyes"
import { StyledDefaultInput, StyledPasswordIcon } from "../../styles/share"
import { showToast } from "../Toast"

import { Messages } from "./Messages"

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
}

function emptyState<T>() {
  return {
    method: "password",
  } as T
}

type State<T> = {
  values: T
  isLoading: boolean
}

export default class Flow<T extends Values> extends Component<
  Props<T>,
  State<T>
> {
  constructor(props: Props<T>) {
    super(props)
    this.state = {
      values: emptyState(),
      confirmPassword: "",
      isLoading: false,
      type: "password",
    }
  }

  componentDidMount() {
    this.initializeValues(this.filterNodes())
  }

  componentDidUpdate(prevProps: Props<T>) {
    const oidcGroup = this.props.flow.ui.nodes.filter(
      (item) => item.group === "oidc" && item.attributes.name === "unlink",
    )
    if (prevProps.flow !== this.props.flow) {
      // Flow has changed, reload the values!
      this.initializeValues(this.filterNodes())
      // if (oidcGroup.type === "") {
      //   showToast("Password changed.")
      // }
      if (oidcGroup.length > 0 && this.props.flow?.state === "success") {
        showToast(`${oidcGroup[0].meta.label?.text}`)
        return
      }

      if (this.props.flow?.state === "success") {
        showToast("Password changed.")
      }
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
  handleSubmit = (e: MouseEvent | FormEvent) => {
    // Prevent all native handlers
    e.stopPropagation()
    e.preventDefault()

    // Prevent double submission!
    if (this.state.isLoading) {
      return Promise.resolve()
    }

    this.setState((state) => ({
      ...state,
      isLoading: true,
    }))

    return this.props
      .onSubmit(this.state.values, this.state.confirmPassword)
      .finally(() => {
        // We wait for reconciliation and update the state after 50ms
        // Done submitting - update loading status
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }))
      })
  }

  handleEye = () => {
    let type = this.state.type === "password" ? "text" : "password"
    this.setState((state) => ({ ...state, type: type }))
  }

  render() {
    const { hideGlobalMessages, flow, confirmPasswordError } = this.props
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

    const [csrfTokenNode, passwordNode, submitNode] = nodes

    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={this.handleSubmit}
      >
        {/* {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null} */}
        <NodeInputHidden
          value={values[getNodeId(csrfTokenNode)]}
          node={csrfTokenNode}
          disabled={isLoading}
          attributes={csrfTokenNode.attributes}
        />
        <Box color="#717197" fontSize="14px" fontFamily="open sans">
          New Password *
        </Box>
        <NodeInputDefault
          value={values[getNodeId(passwordNode)]}
          node={passwordNode}
          disabled={isLoading}
          setValue={(value) =>
            new Promise((resolve) => {
              this.setState(
                (state) => ({
                  ...state,
                  values: {
                    ...state.values,
                    [getNodeId(passwordNode)]: value,
                  },
                }),
                resolve,
              )
            })
          }
          attributes={passwordNode.attributes}
        />
        {!confirmPasswordError && (
          <Box color="#7E7E89" fontSize="13px" fontFamily="open sans">
            A number and combination of characters. (min 8 characters)
          </Box>
        )}
        <Box color="#717197" fontSize="14px" fontFamily="open sans" mt="24px">
          Confirm New Password *
        </Box>
        <StyledDefaultInput>
          <TextInput
            // title="Confirm New Password *"
            type={this.state.type}
            onChange={(e) => {
              this.setState((state) => ({
                ...state,
                confirmPassword: e.target.value,
              }))
            }}
            className="my-text-input"
            placeholder="Confirm new password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            state={isEmpty(confirmPasswordError) ? undefined : "error"}
            subtitle={
              <span
                style={{
                  color: "#F24867",
                  fontFamily: "open sans",
                  fontSize: "13px",
                }}
              >
                {confirmPasswordError}
              </span>
            }
            style={{
              display: "unset",
              border: confirmPasswordError ? "1px solid #F24867" : "none",
              backgroundColor: "#37374F",
              height: "44px",
              color: "#fff",
              caretColor: "#fff",
              borderRadius: "8px",
              padding: "12px 50px 12px 16px",
              margin: "0px",
              fontFamily: "open sans",
            }}
          />
          <StyledPasswordIcon isError={confirmPasswordError}>
            <Eye setInputType={this.handleEye} />
          </StyledPasswordIcon>
        </StyledDefaultInput>
        <Box position="relative" width={{xs:'100%', sm: '76px'}} mt="24px">
          <NodeInputSubmit
            value={values[getNodeId(submitNode)]}
            node={submitNode}
            disabled={isLoading}
            setValue={(value) =>
              new Promise((resolve) => {
                this.setState(
                  (state) => ({
                    ...state,
                    values: {
                      ...state.values,
                      [getNodeId(submitNode)]: value,
                    },
                  }),
                  resolve,
                )
              })
            }
            attributes={submitNode.attributes}
            dispatchSubmit={this.handleSubmit}
          />
        </Box>
      </form>
    )
  }
}
