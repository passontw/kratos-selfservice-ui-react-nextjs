import * as yup from "yup"

export const passwordSchema = yup
  .string()
  .min(8, "Need at least 8 characters")
  .matches(/^(?=.*\d)/, "Need at least 1 number")
  .matches(/^([a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
  .required("Required")

export const updatePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Need at least 8 characters")
    .matches(/^(?=.*\d)/, "Need at least 1 number")
    .matches(/^([a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
    .required("Required"),
  confirmPassword: yup
    .string()
    .min(8, "Need at least 8 characters")
    .matches(/^(?=.*\d)/, "Need at least 1 number")
    .matches(/^([a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
    .when("password", (password, field) => {
      if (password[0] === undefined) {
        return field.required("Required")
      } else {
        return password
          ? field
              .required("Required")
              .oneOf([yup.ref("password")], "Password doesn't match")
          : field
      }
    }),
})
export const loginFormSchema = yup.object().shape({
  identifier: yup.string().email().required("email can not be empty."),
  password: passwordSchema,
})

export const registrationFormSchema = yup.object().shape({
  "traits.email": yup.string().email().required("email can not be empty."),
  "traits.name": yup.string().required("name can not be empty."),
  password: passwordSchema,
})
