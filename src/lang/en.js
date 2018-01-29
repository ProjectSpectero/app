module.exports = {
  lang: 'en',
  errors: {
    VALIDATION_FAILED: 'Please correct any errors and try again.',
    OBJECT_PERSIST_FAILED: 'Something went wrong, please try again later.',
    RESOURCE_CREATION_FAILED: 'Unable to create resource, please try again later.',

    FIELD_REQUIRED: 'This field is required.',
    FIELD_MAXLENGTH: 'Cannot be longer than {x} characters.',
    FIELD_MINLENGTH: 'Cannot be shorter than {x} characters.',
    FIELD_REGEX_MATCH: 'Invalid input format provided.',
    FIELD_EMAIL: 'Must be a valid email.',

    MISSING_BODY: 'Some required fields are missing or empty.',
    USER_NOT_FOUND: 'Invalid username or password.',
    USER_OBJECT_NOT_FOUND: 'Unable to submit the form without a proper user',
    USER_AUTHKEY_ALREADY_EXISTS: 'Username already in use.',
    AUTHENTICATION_FAILED: 'Invalid username or password.',
    UNABLE_TO_LOGOUT: 'Unable to log the user out.',
    ROLE_VALIDATION_FAILED: 'You don\'t have access to assign this role.',

    ROLE_ESCALATION_FAILED: 'You don\'t have permission to add users of this role level.',
    CLOUD_USER_ALTER_NOT_ALLOWED: 'You can\'t alter this cloud user.',
    USER_CANNOT_REMOVE_SELF: 'You cannot delete yourself.',

    INVALID_SERVICE_OR_ACTION_ATTEMPT: 'Invalid action attempt on service.',
    INVALID_IP_AS_LISTENER_REQUEST: 'Unable to bind httpProxy/openVPN server to this listener.',
    INVALID_HTTP_MODE_REQUEST: 'Invalid HTTP mode change requested.',
    STORED_CONFIG_WAS_NULL: 'Unable to store service configuration.',
    CANNOT_DELETE_SELF: 'You can\'t delete yourself.'
  },

  services: {
    UPDATE_SUCCESS: 'Service updated!',
    UPDATE_ERROR: 'Something went wrong. Please try again!',
    RESTART_SUCCESS: 'Server restarted successfully!',
    RESTART_ERROR: 'There was an error while trying to restart your server. Please try again later.'
  },

  USER_CREATE_SUCCESS: 'User created!',
  USER_UPDATE_SUCCESS: 'User saved!',
  USER_UPDATE_ERROR: 'Something went wrong. Please try again!',
  USER_DELETE_SUCCESS: 'User deleted!',
  USER_DELETE_ERROR: 'There was a problem while deleting this user. Please try again later.',
  UNABLE_TO_DISPLAY_BANNED_DOMAINS: 'Proxy Mode must be set to Normal to edit banned domains.',
  UNABLE_TO_DISPLAY_ALLOWED_DOMAINS: 'Proxy Mode must be set to ExclusiveAllow to edit allowed domains.',
  LEAVE_CONFIRM_DIALOG: 'Are you sure you want to leave? Any unsaved changes will be lost.'
}
