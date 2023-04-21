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
  UiNodeGroupEnum,
  UiTextTypeEnum,
} from "@ory/client"
import { getNodeId, isUiNodeInputAttributes } from "@ory/integrations/ui"
import { Component, FormEvent, MouseEvent, createRef, RefObject } from "react"

import { Node } from "../../pkg/ui/Node"
import { setDialog, setMfaModalOpen } from "../../state/store/slice/layoutSlice"

import { Messages } from "./Messages"
import MfaModal from "./MfaModal"

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
  // modal is open or not
  modalOpen?: boolean
  // state of mfa
  // mfaState: boolean
  // dispatch function
  dispatch?: any
}

function emptyState<T>() {
  return {} as T
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
      isLoading: false,
    }
  }

  componentDidMount() {
    this.initializeValues(this.filterNodes())
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (prevProps.flow !== this.props.flow) {
      // Flow has changed, reload the values!
      this.initializeValues(this.filterNodes())
    }
    if (this.props.modalOpen) {
      console.log("flow", this.props.flow)
      this.props.dispatch(
        setDialog({
          title: `2-Step Verification`,
          titleHeight: "58px",
          width: 480,
          height: 268,
          center: true,
          children: (
            <MfaModal
              email={this.props.flow.identity.traits.email}
              submit={(e) => this.handleSubmit(e, true)}
            />
          ),
        }),
      )
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
  handleSubmit = (
    event: FormEvent<HTMLFormElement> | MouseEvent,
    isModal?: boolean,
  ) => {
    // Prevent all native handlers
    event.stopPropagation()
    event.preventDefault()

    if (isModal) {
      const clickProfileBtn = document.querySelector(".profile >button")
      clickProfileBtn.click()
    }

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
    const { hideGlobalMessages, flow } = this.props
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

    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={this.handleSubmit}
      >
        {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
        {nodes.map((node, k) => {
          const id = getNodeId(node) as keyof Values
          const isShow =
            node.attributes.name === "csrf_token" ||
            node.attributes.name === "traits.loginVerification" ||
            node.attributes.type === "submit"
          const isSubmitBtn = node.attributes.name === "method"
          if (isSubmitBtn) {
            console.log("@modal submit Btn", node)
          }

          return (
            <span key={`${id}-${k}`} style={isShow ? {} : { display: "none" }}>
              <Node
                disabled={isLoading}
                node={node}
                value={values[id]}
                dispatchSubmit={this.handleSubmit}
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
            </span>
          )
        })}
      </form>
    )
  }
}
