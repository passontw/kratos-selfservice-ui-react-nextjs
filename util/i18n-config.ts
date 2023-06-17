import { useTranslation } from "next-i18next";

export function useI18nConfig() {
  const { t } = useTranslation('common');

  const lang = {
    // shared : appeared more than once
    password: t('password'),
    email: t('email'),
    signUp: t('signup'),
    login: t('login'),
    signUpPwHint: t('signup_pw_hint'),
    verifyAccount: t('verify_account'),
    verify: t('verify'),
    resend: t('resend'),
    didntReceive: t('didnt_receive'),
    changePw: t('change_pw'),
    username: t('username'),
    save: t('save'),
    // login
    welcomeBack: t('welcomeback'),
    forgotPw: t('forgot_pw'),
    noAccount: t('dont_have_acct'),
    loginDiffAccount: t('login_diff_acct'),
    termsOfUse: t('terms_of_use'),
    privacyPolicy: t('privacy_policy'),
    // signup
    joinUs: t('join_us'),
    alreadyHaveAcct: t('already_have_acct'),
    signupOtherAcct: t('signup_with_other_acct'),
    agreePolicyHint: t('agree_tos_n_privacy_hint'),
    //recovery
    forgotPwDesc: t('forgot_pw_desc'),
    submit: t('submit'),
    verifyCode: t('verif_code'),
    verifyAcctDesc: t('verif_acct_desc'),
    // settings
    newPw: t('new_pw'),
    confirmNewPw: t('confirm_new_pw'),
    enterNewPw: t('enter_new_pw'),
    // profile
    phone: t('phone'),
    gender: t('gender'),
    birthday: t('birthday'),
    joinedSince: t('join_since'),
    // dialog
    cancel: t('cancel'),
    // menu
    personalInfo: t('personal_info'),
    acctSettings: t('acct_settings'),
    deviceMgmt: t('device_mgmt'),
    exportUserData: t('export_user_data'),
    logout: t('log_out'),
  };

  return lang;
}
