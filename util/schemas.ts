import * as yup from "yup"

export const passwordSchema = yup
  .string()
  .min(8, "Need at least 8 characters")
  .matches(/^(?=.*\d)/, "Need at least 1 number")
  .matches(/^([a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
  .required("This field is required, please fill it out.")

export const updatePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Need at least 8 characters")
    .matches(/^(?=.*\d)/, "Need at least 1 number")
    .matches(/^([a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
    .required("This field is required, please fill it out."),
  confirmPassword: yup
    .string()
    .min(8, "Need at least 8 characters")
    .matches(/^(?=.*\d)/, "Need at least 1 number")
    .matches(/^([a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
    .when("password", (password, field) => {
      if (password[0] === undefined) {
        return field.required("This field is required, please fill it out.")
      } else {
        return password
          ? field
              .required("This field is required, please fill it out.")
              .oneOf([yup.ref("password")], "Password doesn't match")
          : field
      }
    }),
})
export const loginFormSchema = yup.object().shape({
  identifier: yup
    .string()
    .email("Invalid email format, please check and try again.")
    .required("This field is required, please fill it out."),
  password: passwordSchema,
})

export const registrationFormSchema = yup.object().shape({
  "traits.email": yup
    .string()
    .email("Invalid email format, please check and try again.")
    .required("This field is required, please fill it out."),
  "traits.name": yup
    .string()
    .required("This field is required, please fill it out."),
  password: passwordSchema,
})
