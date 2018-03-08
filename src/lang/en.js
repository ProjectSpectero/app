module.exports = {
  lang: 'en',

  misc: {
    NOT_FOUND: 'We were unable to find any {type}.',
    LOADING: 'Loading, please wait ...',
    CONTINUE: 'Continue',
    SAVE: 'Save'
  },

  errors: {
    VALIDATION_FAILED: 'Please correct any errors and try again.',
    OBJECT_PERSIST_FAILED: 'Something went wrong, please try again later.',
    RESOURCE_CREATION_FAILED: 'Unable to create resource, please try again later.',
    RESOURCE_NOT_FOUND: 'We could not find that resource. Please contact us if the error persists.',
    REQUEST_FAILED: 'The request failed. Please contact us if the error persists.',
    UNAUTHORIZED: 'You are not authorized to do this. Please contact us if the error persists.',

    FIELD_REQUIRED: 'This field is required.',
    FIELD_MAXLENGTH: 'Cannot be longer than {x} characters.',
    FIELD_MINLENGTH: 'Cannot be shorter than {x} characters.',
    FIELD_REGEX_MATCH: 'Invalid input format provided.',
    FIELD_EMAIL: 'Must be a valid email.',

    MISSING_BODY: 'Some required fields are missing or empty.',
    USER_NOT_FOUND: 'Invalid email or password.',
    EMAIL_FIELD_UNIQUE: 'This email is already taken.',
    EMAIL_VERIFICATION_NEEDED: 'Your acount is pending verification. Please check your email!',
    USER_OBJECT_NOT_FOUND: 'Unable to submit the form without a proper user',
    USER_AUTHKEY_ALREADY_EXISTS: 'Email already in use.',
    AUTHENTICATION_FAILED: 'Invalid email or password.',
    UNABLE_TO_LOGOUT: 'Unable to log the user out.',
    ROLE_VALIDATION_FAILED: 'You don\'t have access to assign this role.',

    INVALID_SERVICE_OR_ACTION_ATTEMPT: 'Invalid action attempt on service.',
    INVALID_IP_AS_LISTENER_REQUEST: 'Unable to bind httpProxy/openVPN server to this listener.',
    INVALID_HTTP_MODE_REQUEST: 'Invalid HTTP mode change requested.',
    STORED_CONFIG_WAS_NULL: 'Unable to store service configuration.',
    CANNOT_DELETE_SELF: 'You can\'t delete yourself.'
  },

  payments: {
    INVOICE_ALREADY_PAID: 'This invoice was already paid!',
    NO_STORED_CARD: 'Unable to find a card connected to this account.',
    USE_SAVED_CARD: 'You previously saved a credit card ({card}) on our system. Do you want to pay with it?',
    BUTTON_USE_SAVED_CARD_YES: 'Yes, Pay Now',
    BUTTON_USE_SAVED_CARD_NO: 'No, Use Different Card',
    BUTTON_PROCESS_PAYMENT: 'Process Payment',
    CHECK_SAVE_CARD: 'Save card for future orders',
    PAYMENT_SUCCESS: 'Payment processed successfully!',
    PAYMENT_PROCESSING: 'Payment in process, please wait...',
    PAYMENT_ACCEPTED: 'Your order has been accepted! We are now processing your payment, please check this invoice in a few minutes.',
    PAY_HEADER: 'Payment for invoice #{invoiceId}',
    PAY_DESCRIPTION: 'Use the form below to pay for your order. Once we recieve your payment, you\'ll gain access to the services associated to the invoice.',
    PAY_SECURE: 'Your payment is secure.',
    PAYPAL_CONNECT_HEADER: 'Connecting to Paypal',
    PAYPAL_CONNECT_DESCRIPTION: 'Please wait while we redirect you to Paypal One Touch™...',
    PAYMENT_INVALID_PARAMETERS: 'The payment data you have supplied seems to be wrong. Please contact us for more details.',
    PAYMENT_PROCESSOR_NOT_ENABLED: 'This payment processor is not enabled. Please contact us for more details.',

    INVOICE_STATUS: {
      PAID: 'Paid',
      UNPAID: 'Unpaid',
      PARTIALLY_REFUNDED: 'Partially Refunded',
      REFUNDED: 'Refunded',
      CANCELLED: 'Cancelled'
    }
  },

  orders: {
    ORDER_STATUS: {
      PENDING: 'Pending',
      AUTOMATED_FRAUD_CHECK: 'Pending Fraud Check',
      MANUAL_FRAUD_CHECK: 'Pending Fraud Check',
      ACTIVE: 'Active',
      CANCELLED: 'Cancelled'
    }
  },

  services: {
    UPDATE_SUCCESS: 'Service updated!',
    UPDATE_ERROR: 'Something went wrong. Please try again!',
    RESTART_SUCCESS: 'Server restarted successfully!',
    RESTART_ERROR: 'There was an error while trying to restart your server. Please try again later.'
  },

  nodes: {
    DELETE_GROUP_CONFIRM_DIALOG: "Are you sure you want to remove this node group? All your nodes will be set as 'Uncategorized'",
    DELETE_CONFIRM_DIALOG: 'Are you sure you want to remove this node?',
    DELETE_SUCCESS: 'Node removed successfully!',
    GROUP_DELETE_SUCCESS: 'Group removed successfully!',
    DELETE_ERROR: 'An error ocurred while trying to delete your node. Please try again later.',
    NODE_VERIFY_SUCCESS: 'Your node {node} is now queued for verification. We\'ll send you an email as soon as this is finished.',
    GROUP_UPDATE_SUCCESS: 'Node group updated successfully!',
    UPDATE_SUCCESS: 'Node updated successfully!',
    HAS_ACTIVE_ORDERS: 'Unable to change market model (this node has active orders)!',
    GROUP_PRICE_AVAILABILITY: 'Note: Price will only be used for {model1} and {model2} market models.'
  },

  users: {
    LOGIN_BUTTON: 'Log In',
    REGISTER_BUTTON: 'Register',
    NO_CREDIT_CARD: 'You don\'t have any credit or debit cards saved. You\'ll have the option to save one upon checkout.'
  }
}
