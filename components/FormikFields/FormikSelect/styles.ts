/* eslint-disable no-nested-ternary */
import { styled } from "@mui/system"
import { GroupBase, StylesConfig } from "react-select"

import { SelectOption } from "../../../types/general"

interface StyledSelectProps {
  width?: string | number
  label?: string
  disabled?: boolean
  keepBorder?: boolean
}

const StyledSelect = styled("div")<StyledSelectProps>(
  ({ width, label, disabled, keepBorder }) => ({
    fontSize: "12px",
    width,
    maxWidth: width,
    border: keepBorder ? "1px solid #38383F" : "none",
    borderRadius: keepBorder ? "6px" : "0",
    display: label ? "flex" : "initial",
    "&:hover": {
      cursor: disabled ? "not-allowed" : "pointer",
    },
    "&>:nth-of-type(2)": {
      flex: label ? 1 : "initial",
    },
  }),
)

const SelectLabel = styled("div", {
  shouldForwardProp: (prop) => prop !== "error",
})<{ error?: boolean }>(({ error }) => ({
  fontSize: "12px",
  color: "#000",
  padding: "10px 16px",
  borderRadius: "4px 0 0 4px",
  backgroundColor: "#000",
  // conditional styles
  ...(error && {
    backgroundColor: "rgba(255, 62, 73, 0.1)",
  }),
}))

const customStyles: StylesConfig<
  SelectOption,
  boolean,
  GroupBase<SelectOption>
> = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#38383F" : "#1E1E28",
    alignSelf: "center",
    borderRadius: "4px",
    color: state.isSelected ? "#FFF" : "#FFF",
    display: "flex",
    alignItems: "center",
    height: 32,
    // boxShadow: 'inset 0px -1px 0px #F0F0F0',
    padding: "8px 12px",
    fontSize: 12,
    cursor: "pointer",
    transition: "0.25s",
    "&:hover": {
      backgroundColor: state.isSelected ? "#38383F" : "#38383F",
    },
    "&:focus": {
      backgroundColor: "#38383F",
    },
    "&:active": {
      color: "#CA4AE8",
      backgroundColor: "#1E1E28",
    },
  }),
  menu: (provided, state) => ({
    marginTop: 2,
    zIndex: 1,
    position: "absolute", // make scrollbar start at the top when scroll appears
    backgroundColor: "transparent",
    borderRadius: 12,
    width: "100%",
    bottom: state.menuPlacement === "top" ? "40px" : "auto",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: state.selectProps.isDisabled ? "WHITE" : "WHITE",
    "&:hover": {
      cursor: state.selectProps.isDisabled ? "not-allowed" : "pointer",
    },
  }),
  menuList: () => ({
    maxHeight: 300,
    borderRadius: 12,
    padding: 5,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1E1E28",
    overflow: "auto",
    "::-webkit-scrollbar": {
      width: 5,
      height: 0,
    },
    "::-webkit-scrollbar-track": {
      borderRadius: 4,
      backgroundColor: "WHITE",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#ACABAC",
      borderRadius: 4,
    },
  }),
  control: (provided, state) => ({
    // none of react-select's styles are passed to <Control />
    padding: "0px 15px 0px 8px",
    backgroundColor: state.selectProps["aria-invalid"]
      ? "rgba(255, 62, 73, 0.1)"
      : state.selectProps["aria-labelledby"]
      ? "#2B2B33"
      : "#37374F",
    height: state.selectProps.isMulti
      ? "fit-content"
      : state.selectProps.className === "size-lg"
      ? 56
      : state.selectProps.className === "size-md"
      ? 42
      : state.selectProps.className === "size-sm"
      ? 32
      : "fit-content",
    minHeight: state.selectProps.isMulti
      ? state.selectProps.className === "size-lg"
        ? 56
        : state.selectProps.className === "size-md"
        ? 42
        : state.selectProps.className === "size-sm"
        ? 32
        : 42
      : "fit-content",
    display: "flex",
    alignItems: "center",
    borderRadius: state.selectProps["aria-label"] ? "0 4px 4px 0" : "6px",
    fontSize: 14,
    margin: "auto",
    // border: `1px solid ${
    //   state.selectProps["aria-invalid"] ? "#FF3E49" : "#38383F"
    // }`,
    // change styles below if you want effect on hover or focus
    "&:hover": {
      borderColor: state.selectProps["aria-invalid"] ? "#FF3E49" : "#4B4B53",
      cursor: state.selectProps.isDisabled ? "not-allowed" : "pointer",
    },
    "&:focus-within": {
      borderColor: state.selectProps["aria-invalid"] ? "#FF3E49" : "#4B4B53",
    },
    transition: "border-color 0.2s ease-in-out",
  }),
  dropdownIndicator: (provided, state) => ({
    display: "flex",
    width: "fit-content",
    color: state.selectProps.isDisabled ? "WHITE" : "WHITE",
    transition: "all .2s ease",
    transform:
      state.selectProps.menuPlacement === "top" && !state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : state.selectProps.menuPlacement === "top" &&
          state.selectProps.menuIsOpen
        ? "rotate(0deg)"
        : state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "none",
  }),
  placeholder: (provided, state) => ({
    gridArea: "1/1",
    color: state.selectProps.isDisabled ? "WHITE" : "WHITE",
  }),
  indicatorsContainer: () => ({
    width: 20,
  }),
  input: () => ({
    gridArea: "1/1",
    color: "WHITE",
    cursor: "pointer",
    // if you want to hide the caret
    caretColor: "transparent",
    "&:hover": {
      cursor: "pointer",
    },
  }),
  multiValueRemove: (base, state) => ({
    ...base,
    display: state.selectProps.isDisabled ? "none" : "flex",
  }),
}

export { customStyles, SelectLabel, StyledSelect }
