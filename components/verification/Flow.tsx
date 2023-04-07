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
import { Component, FormEvent } from "react"
import { NodeInput } from "../../pkg"
import { NodeInputHidden } from "../../pkg/ui/NodeInputHidden"
import { NodeInputSubmit } from "../../pkg/ui/NodeInputSubmit"
import { NodeAnchor } from "../../pkg/ui/NodeAnchor"

import { Messages } from "./Messages"
import EmailNode from "./EmailNode";
import VerificationCodeNode from "./VerificationCodeNode"

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
  return {} as T
}

type State<T> = {
  values: T
  isLoading: boolean
}

const VerificationCodeNodes = (props = {}) => {
  const {isLoading, values, nodes, setValue, handleSubmit} = props;
  const [codeNode, codeHiddenNode, submitNode, emailNode, csrfTokenNode] = nodes

  return (
    <>
      <VerificationCodeNode
        dispatchSubmit={handleSubmit}
        value={values[getNodeId(codeNode)]}
        setValue={setValue(codeNode)}
        node={codeNode}
        disabled={isLoading}
        attributes={codeNode.attributes}
      />
      <NodeInputHidden 
        value={values[getNodeId(codeHiddenNode)]}
        node={codeHiddenNode}
        disabled={isLoading}
        attributes={codeHiddenNode.attributes}
      />
      <NodeInputSubmit
        value={values[getNodeId(submitNode)]}
        node={submitNode}
        disabled={isLoading}
        attributes={submitNode.attributes}
        setValue={setValue(submitNode)}
        dispatchSubmit={handleSubmit}
        />
      <NodeInput
        dispatchSubmit={handleSubmit}
        value={values[getNodeId(emailNode)]}
        setValue={setValue(emailNode)}
        node={emailNode}
        disabled={isLoading}
        attributes={emailNode.attributes}
      />
      <NodeInputHidden 
        value={values[getNodeId(csrfTokenNode)]}
        node={csrfTokenNode}
        disabled={isLoading}
        attributes={csrfTokenNode.attributes}
      />
    </>
  );
};

const VerificationNodes = (props = {}) => {
  const {isLoading, values, nodes, setValue, handleSubmit} = props;
  const [csrfTokenNode, emailNode, submitNode] = nodes
  return (
    <>
      <NodeInputHidden 
        value={values[getNodeId(csrfTokenNode)]}
        node={csrfTokenNode}
        disabled={isLoading}
        attributes={csrfTokenNode.attributes}
      />
      <EmailNode
        dispatchSubmit={handleSubmit}
        value={values[getNodeId(emailNode)]}
        setValue={setValue(emailNode)}
        node={emailNode}
        disabled={isLoading}
        attributes={emailNode.attributes}
      />
      <NodeInputSubmit
      value={values[getNodeId(submitNode)]}
      node={submitNode}
      disabled={isLoading}
      setValue={setValue(submitNode)}
      attributes={submitNode.attributes}
      dispatchSubmit={handleSubmit}
      />
    </>
  );
}

const VerificationMessageNodes = (props = {}) => {
  const {isLoading, values, nodes} = props;
  const [csrfTokenNode, anchorNode] = nodes

  return (
    <>
      <NodeInputHidden 
        value={values[getNodeId(csrfTokenNode)]}
        node={csrfTokenNode}
        disabled={isLoading}
        attributes={csrfTokenNode.attributes}
      />
      <NodeAnchor node={anchorNode} attributes={anchorNode.attributes} />
    </>
  );
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

    return this.props.onSubmit(this.state.values).finally(() => {
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
      return null;
    }

    const getVerificationNode = (nodes) => {
      if (nodes.length === 3) return (<VerificationNodes
        isLoading={isLoading}
        values={values}
        nodes={nodes}
        setState={this.setState}
        setValue={(node) => (value) =>
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
        handleSubmit={this.handleSubmit}
      />);
      if (nodes.length === 5) return (
        <VerificationCodeNodes
              isLoading={isLoading}
              values={values}
              nodes={nodes}
              setState={this.setState}
              setValue={(node) => (value) =>
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
              handleSubmit={this.handleSubmit}
            />
      );
      return <VerificationMessageNodes nodes={nodes} values={values} isLoading={isLoading} />;
    }
    return (
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={this.handleSubmit}
      >
        {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null}
        {getVerificationNode(nodes)}
      </form>
    )
  }
}
