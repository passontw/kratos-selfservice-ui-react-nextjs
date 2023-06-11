import styled from "styled-components"

// [left] login menu
export const StyledMenuLine = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .text {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;

    &:after {
      position: absolute;
      content: "";
      height: 2px;
      background-color: #a5a5a9;
      width: calc(50% - 92px - 12px);
      top: 50%;
      right: 0px;
      margin-left: 12px;
    }

    &:before {
      position: absolute;
      content: "";
      height: 2px;
      background-color: #a5a5a9;
      width: calc(50% - 92px - 12px);
      top: 50%;
      left: 0px;
      margin-right: 12px;
    }
  }
`
export const StyledFooter = styled.footer`
  border-top: 1px solid #37374f;
  width: calc(100% - 32px);
  padding: 20px 0px 20px 32px;
  position: absolute;
  bottom: 0px;
  left: 0px;
  @media only screen and (min-width: 600px) {
    border-top: 1px solid transparent;
  }
  .mobie {
    @media only screen and (min-width: 600px) {
      display: none;
    }
  }
`
export const StyledCopyright = styled.span`
  color: #7e7e89;
  font-family: "Open Sans";
  font-size: 14px;
`
export const StyledMenuWrapper = styled.div`
  padding: 80px 20px 150px 20px;
  @media only screen and (min-width: 600px) {
    padding: 80px 80px 40px 80px;
  }
  @media only screen and (max-width: 600px) {
    padding-top: 35px;
  }
`

// [right] login main Terms of Use Privacy Policy
export const StyledWrapper = styled.div`
  display: none;
  @media only screen and (min-width: 600px) {
    display: inline-block;
    position: relative;
    width: 100%;
  }
`
export const StyledTagPc = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 65px - 65px);
  font-family: open sans;
  position: relative;

  @media only screen and (min-width: 600px) {
    padding: 0px 65px 0px;
  }
`
export const StyledNav = styled.div`
  display: none;
  @media only screen and (min-width: 600px) {
    display: inline-block;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
`
export const StyledLink = styled.a`
  font-family: "Open Sans";
  font-size: 14px;
  line-height: 20px;
  color: #c0c0c0 !important;
  cursor: pointer;
  &:visited {
    color: #c0c0c0 !important;
  }
`
export const StyledLine = styled.span`
  display: inline-block;
  width: 1px;
  height: 12px;
  padding-right: 16px;
  margin-right: 16px;
  border-right: 1px solid #c0c0c0;
`
export const StyledTagPcWrapper = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 48px;
`

// mobile tag (Master Control, Stormplay, Master Control)
export const StyledTagWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 64px 0px 60px;
  > :not(:first-child) {
    margin-left: 20px;
  }
  @media only screen and (min-width: 600px) {
    display: none;
  }

  /* hide scrollbar but allow scrolling */
  -ms-overflow-style: none; /* for Internet Explorer, Edge */
  scrollbar-width: none; /* for Firefox */
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none; /* for Chrome, Safari, and Opera */
  }
`
export const StyledTags = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Open Sans";
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  background: #37374f;
  border-radius: 30px;
  padding: 0px 20px;
  cursor: pointer;
`

export const StyledLinkColor = styled.a`
  &:link,
  &:visited,
  &:hover,
  &:active {
    color: #ca4ae8;
  }
`
// DefaultInput
export const StyledDefaultInput = styled.div`
  position: relative;
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #37374F inset !important;
    -webkit-text-fill-color: white !important;
  }
  input {
    padding: ${(props) =>
      props.isInputLabel ? "12px 16px 12px 82px" : "12px 16px"};
  }
`
export const StyledDefaultLabel = styled.label`
  font-family: "Open Sans";
  font-weight: 400;
  font-size: 13px;
  line-height: 20px;
  position: absolute;
  pointer-events: none;
  left: 16px;
  top: 22px;
  transform: translate(0%, -50%);
  color: #717197;
`
export const StyledPasswordIcon = styled.span`
  display: inline-block;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  position: absolute;
  right: 16px;
  top: 24px;
  transform: translate(0%, -50%);
  cursor: pointer;
`
