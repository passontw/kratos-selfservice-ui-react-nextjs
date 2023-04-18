export enum request_type {
  POST,
  PUT,
  PATCH,
  DELETE,
}

export enum Navs {
  HOME = "HOME",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  PROFILE = "PROFILE",
  ACCOUNT = "ACCOUNT",
  SERVICES = "SERVICES",
  RECOVERY = "RECOVERY",
  SETTINGS = "SETTINGS",
  VERIFICATION = "VERIFICATION",
  EXPORT = "EXPORT"
}

export enum Stage {
  NONE = "NONE",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  VERIFY_CODE = "VERIFY_CODE",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  RESET_PASSWORD = "RESET_PASSWORD",
}