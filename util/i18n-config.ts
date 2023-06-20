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
    emailDoesNotExist: t('error-email-unexisted'),
    emailAlreadyExists: t('error-email_existed'),
    // login
    welcomeBack: t('welcomeback'),
    forgotPw: t('forgot_pw'),
    noAccount: t('dont_have_acct'),
    loginDiffAccount: t('login_diff_acct'),
    termsOfUse: t('terms_of_use'),
    privacyPolicy: t('privacy_policy'),
    orySecurityViolation: t('A security violation was detected, please fill out the form again.'),
    oryInteractionExpired: t('Your interaction expired, please fill out the form again.'),
    oryAddressNoAllowed: t('The %page_route% address is not allowed.'),
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
    profileUpdated: t('profile_updated_succ'),
    // account
    accountLinking: t('account_linking'),
    accountLinkingDesc: t('acct_setting-acct_link_desc'),
    twoStepVerify: t('2_step_verification'),
    twoStepVerifyDesc: t('acct_setting-2step_verif'),
    accountManagement: t('acct_mgmt'),
    deleteMyAccount: t('acct_setting-delete_acct'),
    turnOnTwoStepVerify: t('turn_on_2step_verif'),
    turnOnTwoStepVerifyDesc: t('turn_on_2step_verif_desc'),
    turnOffTwoStepVerify: t('turn_off_2step_verif'),
    turnOffTwoStepVerifyDesc: t('turn_off_2step_verif_desc'),
    currentAcct: t('current_acct'),
    turnOn: t('turn_on'),
    turnOff: t('turn_off'),
    deleteAccount: t('acct_setting-delete_acct-verfi_code'),
    verifyDeleteAccDesc: t('verif_delete_acct_desc'),
    linked: t('linked'),
    unlinked: t('unlinked'),
    cannotLinkAcc: t('acct_use_cannot_link'),
    // change password
    account: t('account'),
    required: t('error-field_required'),
    atLeastChars: t('pw_at_least_8_characters'),
    atLeastNum : t('pw_need_at_least_1_number'),
    atLeastAlpha: t('pw_at_least_1_alphabet'),
    notMatch: t('pw_no_match'),
    passwordChanged: t('pw_changed_succ'),
    // device management 
    currentDevice: t('current_device'),
    currentDeviceDesc: t('current_device-desc'),
    logOutAllDevices: t('log_out_all_devices'),
    logOutAllDevicesDesc: t('log_out_all_device_desc'),
    otherDevice: t('other_device'),
    logOutAll: t('log_out_all'),
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
