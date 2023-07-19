import { Box } from "@mui/material"
import { getNodeId } from "@ory/integrations/ui"
import { TextInput } from "@ory/themes"
import { useTranslation } from "next-i18next"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"

import RadioGroup from "../../components/RadioGroup"
import Select from "../../components/Select"
import CodeInput from "../../components/verification/CodeInput"
import VerificationInput from "../../components/verification/VerificationInput"
import Eye from "../../public/images/eyes"
import {
  selectActiveNav,
  selectActiveStage,
} from "../../state/store/slice/layoutSlice"
import { selectIsInputChanging } from "../../state/store/slice/verificationSlice"
import {
  StyledDefaultInput,
  StyledDefaultLabel,
  StyledPasswordIcon,
} from "../../styles/share"
import { Navs, Stage } from "../../types/enum"
import { SelectOption } from "../../types/general"

import { NodeInputProps } from "./helpers"

export function NodeInputDefault<T>(props: NodeInputProps) {
  const isInputChanging = useSelector(selectIsInputChanging)
  const router = useRouter()
  const nav = useSelector(selectActiveNav)
  const activeStage = useSelector(selectActiveStage)
  const { node, attributes, value, setValue, disabled, validationMsgs, lang } =
    props
  const { t } = useTranslation()

  // lifted state for input control
  const [code, setCode] = useState(Array(6).fill(""))
  const [isTouched, setIsTouched] = useState(false)
  // const [isInputChanging, setIsInputChanging] = useState(false)
  const [inputBlurred, setInputBlurred] = useState(false)
  const [validationError, setValidationError] = useState("")

  const codeInputControlProps = {
    code,
    setCode,
    isTouched,
    setIsTouched,
    // isInputChanging,
    // setIsInputChanging,
    inputBlurred,
    setInputBlurred,
    validationError,
    setValidationError,
  }

  const label =
    node.meta.label?.text === "ID"
      ? lang?.email
      : node.meta.label?.text === "Name" || node.meta.label?.text === "Username"
      ? lang?.username
      : node.meta.label?.text === "E-Mail" || node.meta.label?.text === "Email"
      ? lang?.email
      : node.meta.label?.text === "Password"
      ? lang?.password
      : node.meta.label?.text
  const [isError, setIsError] = useState(node.messages.length > 0)
  const [inputType, setInputType] = useState(attributes.type)

  useEffect(() => {
    setIsError(node.messages.length > 0)
  }, [node.messages.length])

  const isInputLabel = useMemo(() => {
    const list = ["/login", "/registration"]
    return list.includes(router.pathname)
  }, [router.pathname])

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.

  const handleEye = () => {
    inputType === "password" ? setInputType("text") : setInputType("password")
  }

  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }

  const translateDisplayText = (text: string) => {
    if (text.includes("field is required")) {
      return t("error-field_required")
    } else if (text.includes("Invalid email format")) {
      return t("error-field_invalid_email_format")
    } else if (text.includes("at least 8 characters")) {
      return t("error-less8chars")
    } else if (text.includes("at least 1 alphabet")) {
      return t("error-at_least_1alpha")
    } else if (text.includes("at least 1 number")) {
      return t("error-at_least_1num")
    } else if (text.includes("account already exists")) {
      return t("error-email_existed")
    } else {
      return text
    }
  }

  const genderRadios = [
    {
      label: t("gender-male") || "Male",
      value: 1,
    },
    {
      label: t("gender-female") || "Female",
      value: 2,
    },
    {
      label: t("gender-undisclosed") || "Undisclosed",
      value: 3,
    },
  ]
  const [gender, setGender] = useState(
    attributes.name === "traits.gender" && value
      ? value
      : genderRadios[2].value,
  )

  const [selectValue, setSelectValue] = useState(undefined)
  const [selectValue2, setSelectValue2] = useState(1)

  const [defaultSelectValue, setDefaultSelectValue] = useState(
    genderRadios.find((g) => g.value === parseInt(gender)),
  )

  useEffect(() => {
    if (value && attributes.name === "traits.gender") {
      setGender(value ? value : 3)

      setDefaultSelectValue(
        value
          ? genderRadios.find((g) => g.value === parseInt(value))
          : genderRadios[2],
      )
      setSelectValue(1)
    }
    if (value !== undefined && attributes.name === "traits.gender") {
      setSelectValue2(undefined)
    }
  }, [value])

  const accountError =
    validationMsgs &&
    (validationMsgs[0]?.text.includes("Email account") ||
      validationMsgs[0]?.text.includes("The provided credentials are invalid"))

  const getVerifyCodeConditions = () => {
    if (
      nav === Navs.VERIFICATION &&
      activeStage === Stage.NONE &&
      getNodeId(node) === "code"
    )
      return true
    if (activeStage === Stage.DELETE_ACCOUNT) return true
    if (activeStage === Stage.VERIFY_CODE && nav !== Navs.LOGIN) return true

    return false
  }
  const verifyCodeConditions = getVerifyCodeConditions()
  // const verifyCodeConditions2 = activeStage === Stage.DELETE_ACCOUNT
  // Render a generic text input field.

  // routes where the old design of validation needs to be removed
  const isRouteAllowed =
    !window.location.href.includes("verification?") &&
    !window.location.href.includes("account?") &&
    !window.location.href.includes("recovery?")
  // && !window.location.pathname.includes("/login")

  const locale = router.locale
  const inputPaddingLeft =
    locale === "ru"
      ? 140
      : (locale === "fr" || locale === "nl" || locale === "pl") &&
        window.location.pathname.includes("/login")
      ? 100
      : (locale === "fr" ||
          locale === "nl" ||
          locale === "pl" ||
          locale === "pt_BR" ||
          locale === "id") &&
        window.location.pathname.includes("/registration")
      ? 140
      : window.location.pathname.includes("/registration")
      ? 100
      : 82

  const codeMargin =
    nav === Navs.ACCOUNT
      ? "24px 0 0 0"
      : nav === Navs.VERIFICATION || nav === Navs.RECOVERY
      ? "0 0 38px 0"
      : "unset"

  return (
    <>
      {verifyCodeConditions && (
        // Old stable version
        // <VerificationInput />
        // new version with added validation
        <Box m={codeMargin}>
          <CodeInput
            show={attributes.name}
            validationMsgs={node.messages}
            {...codeInputControlProps}
          />
        </Box>
      )}
      {/* {verifyCodeConditions2 && <VerificationInput />} */}
      <StyledDefaultInput isInputLabel={isInputLabel}>
        {isInputLabel && (
          <StyledDefaultLabel isError={isError}>{label}</StyledDefaultLabel>
        )}
        {console.log(attributes.name)}
        {console.log(label)}
        {!isInputChanging && (
          <TextInput
            className="my-text-input"
            style={{
              display:
                attributes.name === "code" ||
                attributes.name === "traits.gender"
                  ? "none"
                  : "unset",
              border:
                isError || accountError
                  ? "1px solid #F24867"
                  : "8px solid #37374F",
              backgroundColor: "#37374F",
              height: "44px",
              color: "#fff",
              caretColor: "#fff",
              borderRadius: "8px",
              padding: isInputLabel
                ? `0px 50px 0px ${inputPaddingLeft}px`
                : "12px 50px 12px 16px",
              margin: "0px",
              fontFamily: "Open Sans",
            }}
            placeholder={
              isInputLabel
                ? ""
                : (nav === Navs.SETTINGS || nav === Navs.CHANGEPASSWORD) &&
                  attributes.name === "password"
                ? lang?.enterNewPw || "Enter new password"
                : attributes.name === "traits.phone"
                ? lang?.phone || "phone"
                : label
            }
            // title={node.meta.label?.text}
            onClick={onClick}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation()
                e.preventDefault()
              }
            }}
            type={inputType === "email" ? "text" : inputType}
            name={attributes.name}
            value={value}
            disabled={attributes.disabled || disabled}
            help={node.messages.length > 0}
            state={
              node.messages.find(({ type }) => type === "error")
                ? "error"
                : undefined
            }
            subtitle={
              isRouteAllowed ? (
                <>
                  {node.messages.map(({ type, text = "", id }, k) => {
                    let displayText = text
                    if (text.includes("is missing")) {
                      displayText =
                        "This field is required, please fill it out."
                    }
                    if (text.includes("is not valid")) {
                      displayText =
                        "Invalid email format, please check and try again."
                    }
                    return (
                      <span
                        key={`${id}-${k}`}
                        data-testid={`ui/message/${id}`}
                        style={{
                          color: "#F24867",
                          fontSize: "13px",
                          fontFamily: "Open Sans",
                        }}
                      >
                        {translateDisplayText(displayText)}
                      </span>
                    )
                  })}
                </>
              ) : (
                <></>
              )
            }
          />
        )}
        {attributes.type === "password" && (
          <StyledPasswordIcon isError={isError}>
            <Eye setInputType={handleEye} />
          </StyledPasswordIcon>
        )}
      </StyledDefaultInput>
      {attributes.name === "password" && nav === "LOGIN" && (
        <Box
          width="fit-content"
          color="#CA4AE8"
          fontSize="16px"
          position="relative"
          fontFamily="Open Sans"
          sx={{
            cursor: "pointer",
            ":hover": {
              filter: "brightness(1.5)",
            },
          }}
          onClick={() => {
            router.push("/recovery")
          }}
        >
          {`${lang?.forgotPw}`}
        </Box>
      )}
      {attributes.name === "password" && nav === "REGISTER" && !isError && (
        <span
          style={{
            color: "#7E7E89",
            fontSize: "13px",
            fontFamily: "Open Sans",
          }}
        >
          {lang?.signUpPwHint}
        </span>
      )}
      {nav === Navs.PROFILE && attributes.name === "traits.gender" && (
        <Box color="#FFF" ml="3px" position="relative">
          <Box
            display={{
              xs: "none",
              sm: "inline-block",
            }}
          >
            <RadioGroup
              value={gender}
              label={t("gender") || "Gender"}
              onChange={(e) => {
                setGender(e.target.value)
                setValue(e.target.value)
              }}
              radios={genderRadios}
              direction="row"
              custom
            />
          </Box>
          <Box
            display={{
              sm: "none",
              xs: "inline-block",
            }}
          >
            {selectValue && (
              <Select
                title={t("gender") || "Gender"}
                defaultValue={defaultSelectValue}
                options={genderRadios}
                width={"calc(100vw)"}
                onChange={(selectedOption: SelectOption) => {
                  setGender(parseInt(selectedOption.value))
                  setValue(parseInt(selectedOption.value))
                }}
              />
            )}
            {selectValue2 && (
              <Select
                title={t("gender") || "Gender"}
                defaultValue={defaultSelectValue}
                options={genderRadios}
                width={"calc(100vw)"}
                onChange={(selectedOption: SelectOption) => {
                  setGender(parseInt(selectedOption.value))
                  setValue(parseInt(selectedOption.value))
                }}
              />
            )}
          </Box>
        </Box>
      )}
    </>
  )
}
