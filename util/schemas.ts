import * as yup from "yup"

export const passwordSchema = yup
  .string()
  .min(8, "Need at least 8 characters")
  .matches(/(?=.*\d)/, "Need at least 1 number")
  .matches(/([^a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
  .required("password can not be empty.")

export const recoveryFormSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Required"),
})

export const updatePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .matches(/([^a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
    .matches(/(?=.*\d)/, "Need at least 1 number")
    .required("password can not be empty.")
    .min(8, "Need at least 8 characters"),
  confirmPassword: yup
    .string()
    .matches(/([^a-zA-Z]+)\w*$/, "Need at least 1 alphabet letter")
    .matches(/(?=.*\d)/, "Need at least 1 number")
    .min(8, "Need at least 8 characters")
    .when("password", (password, field) => {
      if (password[0] === undefined) {
        return field.required("password can not be empty.")
      } else {
        return password
          ? field
              .oneOf([yup.ref("password")], "Password doesn't match")
          : field
      }
    }),
})

export const loginFormSchema = yup.object().shape({
  identifier: yup
    .string()
    .email("Invalid email format")
    .required("email can not be empty."),
  password: passwordSchema,
})

export const registrationFormSchema = yup.object().shape({
  "traits.email": yup
    .string()
    .email("Invalid email format")
    .required("email can not be empty."),
  "traits.name": yup
    .string()
    .required("name can not be empty."),
  password: passwordSchema,
})
