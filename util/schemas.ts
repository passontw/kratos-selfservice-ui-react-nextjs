import * as yup from "yup"

export const passwordSchema = yup
  .string()
  .min(8, "Your password must contain at least 8 characters")
  .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
  .matches(
    /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
    "Your password must contain at least 1 alphabet letter",
  )
  .required("password can not be empty.")

export const recoveryFormSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format, please check and try again.")
    .required("This field is required, please fill it out."),
})

export const changePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
      "Your password must contain at least 1 alphabet letter",
    )
    .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
    .required("This field is required, please fill it out.")
    .min(8, "Your password must contain at least 8 characters"),
  confirmPassword: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
      "Your password must contain at least 1 alphabet letter",
    )
    .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
    .min(8, "Your password must contain at least 8 characters")
    .when("password", (password, field) => {
      if (password[0] === undefined) {
        return field.required("This field is required, please fill it out.")
      } else {
        return password
          ? field.oneOf([yup.ref("password")], "Password doesn't match")
          : field
      }
    }),
})

export const updatePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
      "Your password must contain at least 1 alphabet letter",
    )
    .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
    .required("Required")
    .min(8, "Your password must contain at least 8 characters"),
  confirmPassword: yup
    .string()
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
      "Your password must contain at least 1 alphabet letter",
    )
    .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
    .min(8, "Your password must contain at least 8 characters")
    .when("password", (password, field) => {
      if (password[0] === undefined) {
        return field.required("Required")
      } else {
        return password
          ? field.oneOf([yup.ref("password")], "Password doesn't match")
          : field
      }
    }),
})

export const loginFormSchema = yup.object().shape({
  identifier: yup
    .string()
    .email("Invalid email format, please check and try again.")
    .required("This field is required, please fill it out."),
  password: yup
    .string()
    .min(8, "Your password must contain at least 8 characters")
    .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
      "Your password must contain at least 1 alphabet letter",
    )
    .required("This field is required, please fill it out."),
})

export const registrationFormSchema = yup.object().shape({
  "traits.email": yup
    .string()
    .email("Invalid email format, please check and try again.")
    .required("This field is required, please fill it out."),
  "traits.name": yup
    .string()
    .required("This field is required, please fill it out."),
  password: yup
    .string()
    .min(8, "Your password must contain at least 8 characters")
    .matches(/(?=.*\d)/, "Your password must contain at least 1 number")
    .matches(
      /^(?=.*[A-Za-z])[A-Za-z$@$!%*#?&]/,
      "Your password must contain at least 1 alphabet letter",
    )
    .required("This field is required, please fill it out."),
})
