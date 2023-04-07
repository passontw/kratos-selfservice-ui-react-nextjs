import * as yup from 'yup';

export const passwordSchema = yup
  .string()
  .length(8, 'Need at least 8 characters')
  .matches(
    /^([0-9]+)\w*$/,
    'Need at least 1 number'
  )
  .matches(
    /^([a-zA-Z]+)\w*$/,
    'Need at least 1 alphabet letter'
  )
  .required('密碼不可為空');

export const updatePasswordSchema = yup.object().shape({
  password: yup.string().required('密碼不可為空'),
  confirmPassword: yup.string().when('password', (password, field) =>
  password ? field.required().oneOf([yup.ref('password')]) : field
),
});
export const loginFormSchema = yup.object().shape({
  identifier: yup.string().email().required('信箱不可為空'),
  password: passwordSchema,
});

export const registrationFormSchema = yup.object().shape({
  'traits.email': yup.string().email().required('信箱不可為空'),
  'traits.name': yup.string().required('名稱不可為空'),
  password: passwordSchema,
});