module.exports = {
  lang: 'en',

  misc: {
    DASHBOARD: 'Dashboard',
    MARKET: 'Marketplace',
    ORDERS: 'Orders',
    INVOICES: 'Invoices',
    NODES: 'Nodes',
    DAEMON: 'Daemon',
    DOWNLOADS: 'Downloads',
    ACCOUNT: 'Account',
    SUPPORT: 'Support',
    HELP: 'Help',
    CART: 'Cart',
    SETTINGS: 'Settings',
    LOGOUT: 'Logout',
    NOT_FOUND: 'We were unable to find any {type}.',
    LOADING: 'Loading...',
    CONTINUE: 'Continue',
    CANCEL: 'Cancel',
    VIEW: 'View',
    VIEW_DETAILS: 'View Details',
    VIEW_FULL_DETAILS: 'View Full Details',
    RESET: 'Reset',
    EDIT: 'Edit',
    VERIFY: 'Verify',
    PURCHASE: 'Purchase',
    PAY_NOW: 'Pay Now',
    SAVE: 'Save',
    REMOVE: 'Remove',
    GENERAL_INFO: 'General Information',
    LABEL_PRICE: 'Price',
    LABEL_FRIENDLY_NAME: 'Friendly name',
    LABEL_MARKET_MODEL: 'Market Model',
    LABEL_IP: 'IP Address',
    LABEL_CITY: 'City',
    LABEL_ACCESS_TOKEN: 'Access Token',
    PLACEHOLDER_ACCESS_TOKEN: 'Add a new access token in the format username:password to update',
    LABEL_PROTOCOL: 'Protocol',
    LABEL_NODE_GROUP: 'Node Group',
    ADD_TO_CART: 'Add To Cart',
    IN_CART: 'In Cart',
    CHECKOUT: 'Checkout',
    VIEW_CART: 'View Cart',
    CONTINUE_SHOPPING: 'Continue Shopping',
    CHANGE_TERM: 'Change Term'
  },

  errors: {
    REQUESTED_PAGE_DOES_NOT_EXIST: 'Invalid page!',
    VALIDATION_FAILED: 'Please correct any errors and try again.',
    OBJECT_PERSIST_FAILED: 'Something went wrong, please try again later.',
    RESOURCE_CREATION_FAILED: 'Unable to create resource, please try again later.',
    RESOURCE_NOT_FOUND: 'We could not find that resource. Please contact us if the error persists.',
    REQUEST_FAILED: 'The request failed. Please contact us if the error persists.',
    UNAUTHORIZED: 'You are not authorized to do this. Please contact us if the error persists.',
    PAYMENT_FAILED: 'Payment failed',

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
    CURRENT_PASSWORD_MISMATCH: 'Current password provided was incorrect.',

    INVALID_SERVICE_OR_ACTION_ATTEMPT: 'Invalid action attempt on service.',
    INVALID_IP_AS_LISTENER_REQUEST: 'Unable to bind httpProxy/openVPN server to this listener.',
    INVALID_HTTP_MODE_REQUEST: 'Invalid HTTP mode change requested.',
    STORED_CONFIG_WAS_NULL: 'Unable to store service configuration.',
    CANNOT_DELETE_SELF: 'You can\'t delete yourself.',
    ROLE_ESCALATION_FAILED: 'You don\'t have permission to add users of this role level.',
    CLOUD_USER_ALTER_NOT_ALLOWED: 'You can\'t alter this cloud user.'
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
    PAY_WITH_PAYPAL: 'Pay with Paypal',
    PAY_WITH_STRIPE: 'Pay with Credit Card',
    PAY_WITH_ACCOUNT_CREDIT: 'Pay with Account Credit',
    REQUEST_FAILED: 'We were unable to start the payment process. Please contact us if this keeps happening.',
    ZERO_CREDIT_BALANCE: 'You don\'t have any balance in your account.',
    UNPAID_CREDIT_INVOICES_ARE_PRESENT: 'Unable to invoice credits: you already have one invoice queued for payment!',
    ADD_CREDIT: 'Add Credit',
    ADD_CREDIT_TITLE: 'Add Credit',
    ADD_CREDIT_DESC: 'Use the form below to add credit to your account for making payments in the future.',
    ADD_CREDIT_MAX_WARNING: 'You may add up to <span>$</span>{remaining} {currency} more credit to this account.',
    ADD_CREDIT_FORM_LABEL: 'Enter amount of credit (in $USD) you\'d like to purchase:',
    CREDIT_INVOICED: '{amount} {currency} worth of credit invoiced!',
    ADD_CREDIT_PLACEHOLDER: 'Enter amount of credit you wish to purchase',
    NO_CREDIT_CARD: 'You don\'t have any credit or debit cards saved. You\'ll have the option to save one upon checkout.',
    NO_ACCOUNT_CREDIT: 'You don\'t have any credit in your account.',
    COUNT_ACCOUNT_CREDIT: 'You currently have <strong><span>$</span>{credit} USD</strong> of credit in your account.',
    ORDER_CONTAINS_UNAVAILABLE_RESOURCE: 'Error: This order contains an unavailable resource!'
  },

  invoices: {
    INVOICE_STATUS: {
      PAID: 'Paid',
      UNPAID: 'Unpaid',
      PARTIALLY_REFUNDED: 'Partially Refunded',
      REFUNDED: 'Refunded',
      CANCELLED: 'Cancelled'
    },
    MENU_STATUS: {
      ALL: 'All invoices',
      PAID: 'Paid invoices',
      UNPAID: 'Unpaid invoices'
    }
  },

  orders: {
    ORDER_STATUS: {
      PENDING: 'Pending',
      AUTOMATED_FRAUD_CHECK: 'Pending Fraud Check',
      MANUAL_FRAUD_CHECK: 'Pending Fraud Check',
      ACTIVE: 'Active',
      CANCELLED: 'Cancelled'
    },
    MENU_STATUS: {
      ALL: 'All orders',
      ACTIVE: 'Active orders',
      CANCELLED: 'Cancelled orders'
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
    REQUEST_FAILED: 'The request failed. Please contact us if the error persists.',
    NODE_VERIFY_SUCCESS: 'Your node {node} is now queued for verification. We\'ll send you an email as soon as this is finished.',
    GROUP_UPDATE_SUCCESS: 'Node group updated successfully!',
    UPDATE_SUCCESS: 'Node updated successfully!',
    HAS_ACTIVE_ORDERS: 'Unable to change market model (this node has active orders)!',
    ORDERS_EXIST: 'Unable to remove: this node has active orders!',
    GROUP_PRICE_AVAILABILITY: 'Note: Price will only be used for <strong>{model1}</strong> and <strong>{model2}</strong> market models.',
    DELETE_ENGAGEMENT_CONFIRM_DIALOG: 'Are you sure you want to cancel this engagement?',
    ENGAGEMENT_DELETE_SUCCESS: 'Engagement canceled!',
    ORDER_NOT_ACTIVE_YET: 'Unable to cancel engagement: This order isn\'t active yet!',
    STATUS: {
      UNCONFIRMED: 'Unconfirmed',
      CONFIRMED: 'Confirmed',
      PENDING_VERIFICATION: 'Pending Verification',
      ENABLED: 'Enabled',
      DISABLED: 'Disabled'
    },
    MODEL: {
      UNLISTED: 'Unlisted',
      MANAGED: 'Managed',
      LISTED_SHARED: 'Listed Shared',
      LISTED_DEDICATED: 'Listed Dedicated'
    }
  },

  market: {
    MODEL_NODE: {
      UNLISTED: 'Unlisted',
      MANAGED: 'Managed',
      LISTED_SHARED: 'Listed Shared',
      LISTED_DEDICATED: 'Listed Dedicated'
    },
    ORDER_PROCESSED: 'Success! Invoice #{invoice} has been issued.',
    ADDED_TO_CART: '{name} was added to your cart.',
    REMOVED_FROM_CART: '{name} was removed from your cart.',
    TERM_MODIFIED: 'Term has been changed to {term}.',
    NODE_GROUP_IP_COUNT: '{ips} in {nodes} nodes',
    CART_EMPTY: 'Your cart is empty.',
    CLEAR_CART: 'Empty Cart',
    ITEM_IS_GROUP_WARNING: 'Purchasing this node group will grant you access to the {count} nodes within it. Click "View Full Details" to see all nodes associated to this group.',
    PLAN_WARNING: 'Purchasing this node group will also unlock access to {planName}. <a href="{planUrl}" target="_blank">Learn more</a>',
    TERM: {
      MONTHLY: 'Monthly',
      YEARLY: 'Yearly'
    }
  },

  users: {
    LOGIN_BUTTON: 'Log In',
    REGISTER_BUTTON: 'Register',
    USER_CREATE_SUCCESS: 'User created!',
    USER_UPDATE_SUCCESS: 'User saved!',
    USER_UPDATE_ERROR: 'Something went wrong. Please try again!',
    USER_DELETE_SUCCESS: 'User deleted!',
    USER_DELETE_ERROR: 'There was a problem while deleting this user. Please try again later.',
    UNABLE_TO_DISPLAY_BANNED_DOMAINS: 'Proxy Mode must be set to Normal to edit banned domains.',
    UNABLE_TO_DISPLAY_ALLOWED_DOMAINS: 'Proxy Mode must be set to ExclusiveAllow to edit allowed domains.',
    LEAVE_CONFIRM_DIALOG: 'Are you sure you want to leave? Any unsaved changes will be lost.'
  },

  settings: {
    EMAIL_CHANGE_NOTICE: 'Your current email is <strong>{email}</strong>. If your new email is invalid we will not be able to reach you and your account will be locked.'
  }
}
