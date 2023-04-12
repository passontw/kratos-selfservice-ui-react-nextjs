import { Box } from "@mui/material"
import { TextInput } from "@ory/themes"
import { useEffect, useState } from "react"
import styled from 'styled-components'
import { NodeInputProps } from "./helpers"
import Eye from "../../public/images/eyes"
import { useRouter } from 'next/router'


const StyledDefaultInput = styled.div`
  position: relative;
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #37374F inset !important;
    -webkit-text-fill-color: white !important;
  }


  input {
    padding: 12px 16px 12px 82px;
  } 
}
`
const StyledDefaultLabel = styled.label`
font-family: 'Open Sans';
font-weight: 400;
font-size: 13px;
line-height: 20px;
position: absolute;
pointer-events: none;
left: 16px;
top:  ${ props => props?.isError ? '40%' : '45%' };
transform: translate( 0%, -50% );
color: #717197;
`;

const StyledPasswordIcon = styled.span`
  display: inline-block;  
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  position: absolute;
  right: 16px;
  top:  ${props => props?.isError ? '40%' : '45%' };
  transform: translate(0%, -50%);
  cursor: pointer;
`

export function NodeInputDefault<T>(props: NodeInputProps) {
  const router = useRouter()
  const { node, attributes, value = "", setValue, disabled } = props
  const [isError, setIsError] = useState(node.messages.length > 0)
  console.log('router', router);
  const path = router.pathname

  useEffect(() => {
    setIsError(node.messages.length > 0)
  }, [node.messages.length])
  
  useEffect(()=>{
    console.log('props', props)
  },[props])

  // Some attributes have dynamic JavaScript - this is for example required for WebAuthn.

  const onClick = () => {
    // This section is only used for WebAuthn. The script is loaded via a <script> node
    // and the functions are available on the global window level. Unfortunately, there
    // is currently no better way than executing eval / function here at this moment.
    if (attributes.onclick) {
      const run = new Function(attributes.onclick)
      run()
    }
  }
  
  const SelectComponent = () => {
    
  }


  // Render a generic text input field.
  return (
    <StyledDefaultInput>
      <StyledDefaultLabel isError={isError}>{node.meta.label?.text}</StyledDefaultLabel>
      <TextInput
        className="my-text-input"
        style={{
          border: isError ? "1px solid #F24867" : "none",
          backgroundColor: "#37374F",
          height: "44px",
          color: "#fff",
          caretColor: "#fff",
          borderRadius: "8px",
        }}
        // placeholder={node.meta.label?.text}
        // title={node.meta.label?.text}
        onClick={onClick}
        onChange={(e) => {
          setValue(e.target.value)
        }}
        type={attributes.type}
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
          <>
            {node.messages.map(({ type, text, id }, k) => {
              let displayText = text
              if (text.includes("is missing")) {
                // const field = text.split(" ")[1]
                displayText = "This field is required, please fill it out."
              }
              return (
                <span
                  key={`${id}-${k}`}
                  data-testid={`ui/message/${id}`}
                  style={{ color: "#F24867", fontSize: "13px" }}
                >
                  {displayText}
                </span>
              )
            })}
          </>
        }
      />
      {
        attributes.type === 'password' &&       
        <StyledPasswordIcon isError={isError} >
          <Eye/>
        </StyledPasswordIcon>
      }

    </StyledDefaultInput>
  )
}
