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
    padding : 80px 20px 150px 20px;
    @media only screen and (min-width: 600px) {
      padding : 80px 80px 0px 80px;
    }
`

// [right] login main Terms of ServicePrivacy Policy
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
  @media only screen and (min-width: 600px) {
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
`
export const StyledLink = styled.a`
  font-family: "Open Sans";
  font-size: 14px;
  line-height: 20px;
  color: #c0c0c0;
  cursor: pointer;
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
&:link, &:visited, &:hover, &:active {
  color: #CA4AE8;
}
`