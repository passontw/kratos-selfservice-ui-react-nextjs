import {
  StyledBirthdayMonth,
  StyledBirthdayWrap,
  StyledBirthdayYear,
  StyledEditButton,
  StyledFieldSpacer,
  StyledFieldTitle,
  StyledForm,
  StyledImageText,
  StyledImageTitle,
  StyledImageUpload,
  StyledProfileDeco,
  StyledProfileImage,
  StyledProfileImageWrap,
  StyledSideInputs,
  StyledSideWrap,
  StyledSubmitArea,
  StyledSubmitButton,
} from "../../styles/pages/profile.styles"
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
import { Component, FormEvent, MouseEvent } from "react"

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

  /**
   * Removes ory's node from the list and returns it by itself so that you can use
   * in a specialized manner.
   * @param name - name of the attribute, found under node.attributes.name
   * @param nodes - the list of initialized nodes, passed in order to retain the pointers
   * @returns
   */
  spliceNode = (name: string, nodes: UiNode) => {
    // acquire profileNode
    const node = nodes?.find((node) => node.attributes.name === name)
    console.log(`@profile ${name} node:`, node, " from:", nodes)
    const nodeId = node && (getNodeId(node) as keyof Values)
    // remove it from the other nodes to sperate its view from the rest of the form
    nodes.splice(nodes.indexOf(node), 1)
    return { node, nodeId }
  }

  render() {
    const { hideGlobalMessages, flow } = this.props
    const { values, isLoading } = this.state

    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes()
    // console.log("@profile nodes:", nodes)

    // acquire profileNode
    const { node: profileNode, nodeId: profileNodeId } = this.spliceNode(
      "traits.avatar",
      nodes,
    )

    // acquire emailNode
    const { node: emailNode, nodeId: emailNodeId } = this.spliceNode(
      "traits.email",
      nodes,
    )

    // acquire loginVerificationNode
    const { node: loginVerificationNode, nodeId: loginVerificationNodeId } =
      this.spliceNode("traits.loginVerification", nodes)

    // acquire genderNode
    const { node: genderNode, nodeId: genderNodeId } = this.spliceNode(
      "traits.gender",
      nodes,
    )

    // acquire birthdayMonth
    const { node: birthdayMonthNode, nodeId: birthdayMonthNodeId } =
      this.spliceNode("traits.birthdayMonth", nodes)

    // acquire birthdayYear
    const { node: birthdayYearNode, nodeId: birthdayYearNodeId } =
      this.spliceNode("traits.birthdayYear", nodes)

    // acquire method (submit button)
    const { node: methodNode, nodeId: methodNodeId } = this.spliceNode(
      "method",
      nodes,
    )

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
        {/* custom ui do not display messages*/}
        {/* {!hideGlobalMessages ? <Messages messages={flow.ui.messages} /> : null} */}

        <StyledForm>
          <StyledImageUpload>
            {/* TODO - in production when there is DB and backend server
            this requires uploading local image to S3  */}
            {/* TODO - UNCOMMENT THIS AND WORK ON COMBINING UPLOAD UI
            WITH THIS IMAGE UPLOAD INPUT */}
            {/* Actual Form Data is passed to this node: */}
            {/* {profileNode && (
              <Node
                disabled={isLoading}
                node={profileNode}
                value={values[profileNodeId]}
                dispatchSubmit={this.handleSubmit}
                setValue={(value) =>
                  new Promise((resolve) => {
                    this.setState(
                      (state) => ({
                        ...state,
                        values: {
                          ...state.values,
                          [getNodeId(profileNode)]: value,
                        },
                      }),
                      resolve,
                    )
                  })
                }
              />
            )} */}

            {/* Temporary placeholder, need to merge with the input above
            when there is actual image upload */}
            {console.log("@profile flow:", flow)}

            <StyledProfileImageWrap>
              <StyledProfileImage src={"/images/profile-pic.png"} />
              <StyledEditButton src={"/images/edit-icon.png"} />
            </StyledProfileImageWrap>

            <StyledImageTitle>{flow?.identity.traits.email}</StyledImageTitle>
            <StyledImageText>
              Joined since {flow?.identity.created_at.split("T")[0]}
            </StyledImageText>
          </StyledImageUpload>

          <StyledSideWrap>
            <StyledProfileDeco src={"/images/purple-deco.png"} />
            <StyledSideInputs>
              {nodes.map((node, k) => {
                // console.log(node)
                const id = getNodeId(node) as keyof Values
                // if (this.props.noEmail && node.meta.label?.text === "E-Mail") return
                // if (node.meta.label?.text === "E-Mail") return

                return (
                  <>
                    <StyledFieldTitle
                      topSpacing={node.attributes.name === "traits.phone"}
                    >
                      {node.attributes.name === "traits.name"
                        ? "Username"
                        : node.attributes.name === "traits.phone"
                        ? "Phone"
                        : ""}
                    </StyledFieldTitle>

                    <Node
                      key={`${id}-${k}`}
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
                  </>
                )
              })}

              {/* gender node */}
              <StyledFieldSpacer>
                <StyledFieldTitle>Gender</StyledFieldTitle>
                {genderNode && (
                  <Node
                    disabled={isLoading}
                    node={genderNode}
                    value={values[genderNodeId]}
                    dispatchSubmit={this.handleSubmit}
                    setValue={(value) =>
                      new Promise((resolve) => {
                        this.setState(
                          (state) => ({
                            ...state,
                            values: {
                              ...state.values,
                              [getNodeId(genderNode)]: value,
                            },
                          }),
                          resolve,
                        )
                      })
                    }
                  />
                )}
              </StyledFieldSpacer>

              <StyledFieldSpacer>
                {/* Birthday Section */}
                <StyledFieldTitle>Date of Birth</StyledFieldTitle>

                <StyledBirthdayWrap>
                  {/* birthdayMonth node */}
                  <StyledBirthdayMonth>
                    {birthdayMonthNode && (
                      <Node
                        disabled={isLoading}
                        node={birthdayMonthNode}
                        value={values[birthdayMonthNodeId]}
                        dispatchSubmit={this.handleSubmit}
                        setValue={(value) =>
                          new Promise((resolve) => {
                            this.setState(
                              (state) => ({
                                ...state,
                                values: {
                                  ...state.values,
                                  [getNodeId(birthdayMonthNode)]: value,
                                },
                              }),
                              resolve,
                            )
                          })
                        }
                      />
                    )}
                  </StyledBirthdayMonth>

                  {/* birthdayYear node */}
                  <StyledBirthdayYear>
                    {birthdayYearNode && (
                      <Node
                        disabled={isLoading}
                        node={birthdayYearNode}
                        value={values[birthdayYearNodeId]}
                        dispatchSubmit={this.handleSubmit}
                        setValue={(value) =>
                          new Promise((resolve) => {
                            this.setState(
                              (state) => ({
                                ...state,
                                values: {
                                  ...state.values,
                                  [getNodeId(birthdayYearNode)]: value,
                                },
                              }),
                              resolve,
                            )
                          })
                        }
                      />
                    )}
                  </StyledBirthdayYear>
                </StyledBirthdayWrap>
              </StyledFieldSpacer>

              {/* method node (submit button) */}
              {methodNode && (
                <StyledSubmitArea>
                  <StyledSubmitButton>
                    <Node
                      disabled={isLoading}
                      node={methodNode}
                      value={values[methodNodeId]}
                      dispatchSubmit={this.handleSubmit}
                      setValue={(value) =>
                        new Promise((resolve) => {
                          this.setState(
                            (state) => ({
                              ...state,
                              values: {
                                ...state.values,
                                [getNodeId(methodNode)]: value,
                              },
                            }),
                            resolve,
                          )
                        })
                      }
                    />
                  </StyledSubmitButton>
                </StyledSubmitArea>
              )}
            </StyledSideInputs>
          </StyledSideWrap>
        </StyledForm>
      </form>
    )
  }
}
