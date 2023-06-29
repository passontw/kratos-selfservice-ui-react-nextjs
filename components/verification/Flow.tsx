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
import { Component, FormEvent, MouseEvent } from "react"
import { connect } from "react-redux"

import { setIsInputChanging } from "../../state/store/slice/verificationSlice"

import { Messages } from "./Messages"
import { Node } from "./Node"

export type Values = Partial<
  | UpdateLoginFlowBody
  | UpdateRegistrationFlowBody
  | UpdateRecoveryFlowBody
  | UpdateSettingsFlowBody
  | UpdateVerificationFlowBody
>

export type Methods =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "link"
  | "lookup_secret"

export type Props<T> = {
  flow?:
    | LoginFlow
    | RegistrationFlow
    | SettingsFlow
    | VerificationFlow
    | RecoveryFlow
  only?: Methods
  onSubmit: (values: T) => Promise<void>
  hideGlobalMessages?: boolean
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

const mapStateToProps = (state: any) => {
  // Map necessary state properties to component props
  return {
    isInputChanging: state.verification.isInputChanging,
  }
}

class MyFlow<T extends Values> extends Component<Props<T>, State<T>> {
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

  initializeValues = (nodes: Array<UiNode> = []) => {
    const values = emptyState<T>()
    nodes.forEach((node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        if (
          node.attributes.type === "button" ||
          node.attributes.type === "submit"
        ) {
          return
        }
        values[node.attributes.name as keyof Values] = node.attributes.value
      }
    })

    this.setState((state) => ({ ...state, values }))
  }

  filterNodes = (): Array<UiNode> => {
    const { flow, only } = this.props
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

  handleSubmit = (event: FormEvent<HTMLFormElement> | MouseEvent) => {
    // tell application that we are currently clearing "input is being changed" state
    // when we try submit the form
    this.props.dispatch(setIsInputChanging(false))
    event.stopPropagation()
    event.preventDefault()
    const isResendCode = event.nativeEvent.submitter.id === "resendcode"

    if (this.state.isLoading) {
      return Promise.resolve()
    }

    const form = event.currentTarget

    let body: T | undefined

    if (form && form instanceof HTMLFormElement) {
      const formData = new FormData(form)

      body = Object.fromEntries(formData) as T

      const hasSubmitter = (evt: any): evt is { submitter: HTMLInputElement } =>
        "submitter" in evt

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
      .onSubmit({ ...body, ...this.state.values }, isResendCode)
      .finally(() => {
        this.setState((state) => ({
          ...state,
          isLoading: false,
        }))
      })
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

  render() {
    const { hideGlobalMessages, flow, lang, type, returnTo, isInputChanging } =
      this.props
    const { values, isLoading } = this.state

    const nodes = this.filterNodes()

    if (!flow) {
      return null
    }

    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={(...args) => this.handleSubmit(...args)}
      >
        {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
        {nodes.map((node, k) => {
          const excludedFields = {
            // verification: ["email"],
          }

          const pathname = window.location.pathname.slice(
            1,
          ) as keyof typeof excludedFields

          if (excludedFields[pathname]?.includes(node.attributes.name)) return

          const id = getNodeId(node) as keyof Values

          return (
            <Node
              key={`${id}-${k}`}
              disabled={isLoading}
              node={node}
              value={getNodeId(node) === "code" ? this.props.code : values[id]}
              dispatchSubmit={this.handleSubmit}
              lang={lang}
              setValue={(value) => {
                return new Promise((resolve) => {
                  this.setState(
                    (state) => ({
                      ...state,
                      values: {
                        ...state.values,
                        [getNodeId(node)]:
                          getNodeId(node) === "code" ? this.props.code : value,
                      },
                    }),
                    resolve,
                  )
                })
              }}
            />
          )
        })}
      </form>
    )
  }
}

export const Flow = connect(mapStateToProps)(MyFlow)
