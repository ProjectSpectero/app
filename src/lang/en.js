module.exports = {
  lang: 'en',
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

    ROLE_ESCALATION_FAILED: 'You don\'t have permission to add users of this role level.',
    CLOUD_USER_ALTER_NOT_ALLOWED: 'You can\'t alter this cloud user.',
    USER_CANNOT_REMOVE_SELF: 'You cannot delete yourself.',

    INVALID_SERVICE_OR_ACTION_ATTEMPT: 'Invalid action attempt on service.',
    INVALID_IP_AS_LISTENER_REQUEST: 'Unable to bind httpProxy/openVPN server to this listener.',
    INVALID_HTTP_MODE_REQUEST: 'Invalid HTTP mode change requested.',
    STORED_CONFIG_WAS_NULL: 'Unable to store service configuration.',
    CANNOT_DELETE_SELF: 'You can\'t delete yourself.',

    PAYMENT_INVALID_PARAMETERS: 'The payment data you have supplied seems to be wrong. Please contact us for more details.',
    PAYMENT_PROCESSOR_NOT_ENABLED: 'This payment processor is not enabled. Please contact us for more details.'
  },

  payments: {
    INVOICE_ALREADY_PAID: 'This invoice was already paid!',
    NO_STORED_CARD: 'Unable to find a card connected to this account.',
    USE_SAVED_CARD: 'You have saved a credit card ({card}) on our database. Do you want to pay with it?',
    USE_SAVED_CARD_YES: 'Yes, pay now',
    USE_SAVED_CARD_NO: 'No, let me choose a different card'
  },

  services: {
    UPDATE_SUCCESS: 'Service updated!',
    UPDATE_ERROR: 'Something went wrong. Please try again!',
    RESTART_SUCCESS: 'Server restarted successfully!',
    RESTART_ERROR: 'There was an error while trying to restart your server. Please try again later.'
  },

  nodes: {
    DELETE_CONFIRM_DIALOG: 'Are you sure you want to remove this node?',
    DELETE_SUCCESS: 'Node removed successfully!',
    DELETE_ERROR: 'An error ocurred while trying to delete your node. Please try again later.'
  },

  users: {
    CLEAR_CREDIT_CARD: 'Your {card} card is saved and will be used for future payments. If you\'d like, you can remove it now.',
    NO_CREDIT_CARD: 'You don\'t have any credit card associated with Spectero.'
  },

  USER_CREATE_SUCCESS: 'User created!',
  USER_UPDATE_SUCCESS: 'User saved!',
  USER_UPDATE_ERROR: 'Something went wrong. Please try again!',
  USER_DELETE_SUCCESS: 'User deleted!',
  USER_DELETE_ERROR: 'There was a problem while deleting this user. Please try again later.',
  UNABLE_TO_DISPLAY_BANNED_DOMAINS: 'Proxy Mode must be set to Normal to edit banned domains.',
  UNABLE_TO_DISPLAY_ALLOWED_DOMAINS: 'Proxy Mode must be set to ExclusiveAllow to edit allowed domains.',
  LEAVE_CONFIRM_DIALOG: 'Are you sure you want to leave? Any unsaved changes will be lost.',
  CHANGE_EMAIL_DIALOG: 'You have changed your email from {oldEmail} to {newEmail}. If your new email is invalid, we will not be able to reach you and your account will be locked. Are you sure you want to change your email to {newEmail} and logout?'
}
