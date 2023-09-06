export const handleYupSchema = async (schema, payload: any) => {
  console.log("handleYupSchema function", JSON.stringify([schema, payload]))
  return schema.validate(payload, { abortEarly: false });
}

export const handleYupErrors = (errors: unknown) => {
  if(!errors.inner) return errors;
  console.log("handleYupErrors function", JSON.stringify(errors))
  return errors.inner.reduce((currentError: any, nextError: { path: any; message: any; }) => {
    const name = nextError.path;
    const message = nextError.message;
    return {
      ...currentError,
      [name]: message
    }
  }, {})
}
