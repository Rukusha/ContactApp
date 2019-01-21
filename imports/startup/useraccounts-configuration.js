import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({

    // FlowRouter configuration
    defaultLayout: 'Unlogged_body',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main',

    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Redirects
    homeRoutePath: '/projects',
    redirectTimeout: 4000,

    // Hooks
    onLogoutHook: () => FlowRouter.go('Login.show'),
    //onSubmitHook: mySubmitFunc,
    //preSignUpHook: myPreSubmitFunc,
    //postSignUpHook: myPostSubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password"
      },
    },
});

AccountsTemplates.addFields([
    {
        _id: 'telephone',
        type: 'tel',
        displayName: "Telephone",
        required: true
    },
    {
        _id: 'name',
        type: 'text',
        displayName: "Name",
        required: true
    }
]);