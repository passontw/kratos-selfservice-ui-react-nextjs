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
import { Component, FormEvent, MouseEvent } from "react"

import CropImageModal from "../../components/Modal/CropImageModal"
import ory from "../../pkg/sdk"
import { convertDateString } from "../../util/formatter"

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
  cropImageOpen: boolean
  imageSrc: string
  pic: string
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
      cropImageOpen: false,
      imageSrc: "",
      pic: "",
    }
  }

  componentDidUpdate(nextProps, nextState) {
    // console.log("nextProps", nextProps)
    // console.log("nextState", nextState)

    ory.toSession().then(async ({ data }) => {
      console.log("@data", data)
      const user = data?.identity?.traits || {}

      try {
        if (!user) return
        const responseJson = await fetch("/api/image/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
          }),
        })
        const response = await responseJson.json()
        if (response) {
          console.log("File get successfully", response)
          if (response.file === nextState.pic) return
          this.setState((state) => ({
            ...state,
            pic: response.file,
          }))
        } else {
          console.error("File get failed")
        }
      } catch (error) {
        console.error("Error get file:", error)
      }
    })
  }

  componentDidMount() {
    this.initializeValues(this.filterNodes())
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
    return flow.ui.nodes.filter((node) => {
      const { group, attributes } = node
      if (!only) {
        return true
      }
      if (attributes.name === "traits.location") return false
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
    // nodes.splice(nodes.indexOf(node), 1)
    return { node, nodeId }
  }

  handleOpenCropImage = () => {
    this.setState((state) => ({ ...state, cropImageOpen: true }))
  }
  handleCloseCropImage = () => {
    this.setState((state) => ({ ...state, cropImageOpen: false, imageSrc: "" }))
  }

  handleOpenFile = () => {
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".png,.jpg,.jpeg"
    // 觸發檔案選擇對話框
    fileInput.click()

    const handleFileChange = (event: any) => {
      const self = this
      const fileObj = event.target.files && event.target.files[0]
      if (!fileObj) {
        return
      }

      const acceptList = ["png", "jpg", "jpeg"]
      const extension = fileObj.type.split("/")[1]
      if (!acceptList.includes(extension)) {
        alert("wrong filename extension")
        return
      }

      const reader = new FileReader()
      reader.addEventListener("load", (f) => {
        // check image natural size
        const image = new Image()
        image.src = reader.result?.toString() ?? ""
        image.onload = function () {
          // if (image.naturalWidth < 150 || image.naturalHeight < 150) {
          //   alert("wrong size")
          //   return
          // }
          self.setState((state) => ({
            ...state,
            imageSrc: reader.result?.toString() ?? "",
          }))
          // setImageSrc(reader.result?.toString() ?? '');
          self.handleOpenCropImage()
          // event.target.value = ""
        }
      })
      reader.readAsDataURL(fileObj)
    }
    // 監聽選擇檔案事件
    fileInput.addEventListener("change", (event) => {
      const selectedFile = event.target.files[0] // 取得選擇的檔案
      handleFileChange(event)
      console.log("Selected file:", selectedFile)
    })
  }

  render() {
    const { hideGlobalMessages, flow, lang } = this.props
    const { values, isLoading, cropImageOpen, imageSrc, pic } = this.state

    // Filter the nodes - only show the ones we want
    const nodes = this.filterNodes()

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
      flow.ui.nodes,
    )

    if (!flow) {
      // No flow was set yet? It's probably still loading...
      //
      // Nodes have only one element? It is probably just the CSRF Token
      // and the filter did not match any elements!
      return null
    }

    console.log("pic", pic)
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

            <StyledProfileImageWrap>
              {/* <StyledProfileImage src={"/images/profile-demo.jpg"} style={{
                height: "168px",
                width: "168px",
                borderRadius: "50%",
              }}/> */}
              {pic ? (
                <Box
                  sx={{
                    borderRadius: "50%",
                    overflow: "hidden",
                  }}
                >
                  <StyledProfileImage src={pic} />
                </Box>
              ) : (
                <StyledProfileImage src={"/images/profile-pic.png"} />
              )}

              <StyledEditButton
                src={"/images/edit-icon.png"}
                onClick={() => {
                  this.handleOpenFile()
                  // this.handleOpenCropImage
                }}
              />
            </StyledProfileImageWrap>
            <CropImageModal
              open={cropImageOpen}
              handleClose={this.handleCloseCropImage}
              imageSrc={imageSrc}
              aspect={1 / 1}
              radius="50%"
              minWidth={150}
              maxWidth={480}
            />
            <StyledImageTitle>{flow?.identity.traits.email}</StyledImageTitle>
            <StyledImageText>
              {`${lang?.joinedSince} `}
              {convertDateString(flow?.identity.created_at.split("T")[0])}
            </StyledImageText>
          </StyledImageUpload>

          <StyledSideWrap>
            <StyledProfileDeco src={"/images/purple-deco.png"} />
            <StyledSideInputs>
              {nodes.map((node, k) => {
                // console.log(node)
                const id = getNodeId(node) as keyof Values
                if (node.attributes.type === "submit") return null
                if (
                  [
                    "traits.loginVerification",
                    "traits.source",
                    "traits.avatar",
                    "traits.email",
                    "traits.gender",
                    "traits.birthdayMonth",
                    "traits.birthdayYear",
                  ].includes(node.attributes.name)
                ) {
                  return null
                }

                return (
                  <>
                    <StyledFieldTitle
                      topSpacing={node.attributes.name === "traits.phone"}
                    >
                      {node.attributes.name === "traits.name"
                        ? lang?.username
                        : node.attributes.name === "traits.phone"
                        ? lang?.phone
                        : ""}
                    </StyledFieldTitle>
                    <Node
                      key={`${id}-${k}`}
                      disabled={isLoading}
                      node={node}
                      value={values[id]}
                      dispatchSubmit={this.handleSubmit}
                      lang={lang}
                      setValue={(value) => {
                        return new Promise((resolve) => {
                          this.setState((state) => {
                            return {
                              ...state,
                              values: {
                                ...state.values,
                                [getNodeId(node)]: value,
                              },
                            }
                          }, resolve)
                        })
                      }}
                    />
                  </>
                )
              })}

              {/* gender node */}
              <StyledFieldSpacer>
                {/* <StyledFieldTitle>Gender</StyledFieldTitle> */}
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
                <StyledFieldTitle>{lang?.birthday}</StyledFieldTitle>
                <StyledBirthdayWrap>
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
