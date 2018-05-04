module.exports = {
  lang: 'en',
  misc: {
    DASHBOARD: 'Dashboard',
    MARKET: 'Marketplace',
    ORDERS: 'Orders',
    INVOICES: 'Invoices',
    NODE: 'Node',
    NODE_GROUP: 'Node group',
    NODES: 'Nodes',
    STATUS: 'Status',
    ROLES: 'Roles',
    DAEMON: 'Daemon',
    DOWNLOADS: 'Downloads',
    ACCOUNT: 'Account',
    SUPPORT: 'Support',
    TOTAL: 'Total',
    HELP: 'Help',
    NEXT_DUE_DATE: 'Next Due Date',
    RESOURCES: 'Resources',
    CART: 'Cart',
    SETTINGS: 'Settings',
    LOGOUT: 'Logout',
    NOT_FOUND: 'We were unable to find any {type}.',
    LOADING: 'Loading',
    CONTINUE: 'Continue',
    CANCEL: 'Cancel',
    VIEW: 'View',
    VIEW_DETAILS: 'View Details',
    VIEW_FULL_DETAILS: 'View Full Details',
    RESET: 'Reset',
    EDIT: 'Edit',
    START: 'Start',
    STOP: 'Stop',
    CONFIGURE: 'Configure',
    VERIFY: 'Verify',
    LISTENERS: 'Listeners',
    PURCHASE: 'Purchase',
    PAY_NOW: 'Pay Now',
    SAVE: 'Save',
    REMOVE: 'Remove',
    GENERAL_INFO: 'General Information',
    PRICE: 'Price',
    FRIENDLY_NAME: 'Friendly name',
    MARKET_MODEL: 'Market Model',
    ASN: 'ASN',
    AVAILABLE_SOON: 'Available soon.',
    CC: 'Country code',
    CITY: 'City',
    IP: 'IP Address',
    ACCESS_TOKEN: 'Access Token',
    PLACEHOLDER_ACCESS_TOKEN: 'Add a new access token in the format username:password to update',
    PROTOCOL: 'Protocol',
    ADD_TO_CART: 'Add To Cart',
    IN_CART: 'In Cart',
    CHECKOUT: 'Checkout',
    VIEW_CART: 'View Cart',
    CONTINUE_SHOPPING: 'Continue Shopping',
    CHANGE_TERM: 'Change Term',
    COPY_TO_CLIPBOARD: 'Copy',
    COPIED_TO_CLIPBOARD: 'Text copied to clipboard!',
    DOWNLOAD_AS_FILE: 'Download File',
    DELETE_CONFIRM_DIALOG: 'Are you sure you want to remove this {object}?',
    LEAVE_CONFIRM_DIALOG: 'Are you sure you want to leave? Any unsaved changes will be lost.'
  },

  errors: {
    ERROR_404_TITLE: '404',
    ERROR_404_META_TITLE: 'Page not found!',
    ERROR_404_TEXT: 'Oops! The page or resource you were looking for doesn\'t exist.',
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
    CLOUD_USER_ALTER_NOT_ALLOWED: 'You can\'t alter this cloud user.',
    ENDPOINT_NOT_FOUND: 'Endpoint not found or unreachable',
    RELEASES_FETCH_FAILED: 'Unable to load release data, please try again later.'
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
    PAY_WITH_PAYPAL: 'PayPal Checkout',
    PAY_WITH_STRIPE: 'Credit Card Payment',
    PAY_WITH_ACCOUNT_CREDIT: 'Use Account Credit',
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
    ORDER_CONTAINS_UNAVAILABLE_RESOURCE: 'Error: This order contains an unavailable resource!',
    PROMO: {
      APPLY_MSG: 'Have a promo code? Apply it to your account here.',
      ENTER_PROMO_CODE_HERE: 'Enter promo code here',
      APPLY_PROMO_CODE_BUTTON: 'Apply',
      STATUS: {
        PROMO_APPLIED: 'Promo code has been applied!',
        RESOURCE_NOT_FOUND: 'This promo code is invalid.',
        PROMO_CODE_ALREADY_USED: 'This promo code has already been used.',
        REQUEST_FAILED: 'Something went wrong. Please try again later or contact us if this issue persists.'
      }
    }
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
    },
    SYNC_STATUS: {
      PENDING_SYNC: 'Pending',
      SYNCED: 'Done'
    },
    REFERENCE_NUM: 'Reference Number',
    VIEW_INVOICE: 'View invoice',
    VIEW_ALL_RESOURCES: 'List all resources',
    VIEW_LATEST_INVOICE: 'View Latest Invoice',
    NOT_ENABLED: '{type} is not enabled for this node.',
    USE_ACCESSOR: 'Please use the login data as shown in your accessor.',
    ACCESS_CREDENTIALS: 'Access Credentials',
    ACCESS_CONFIG: 'Access Config',
    ACCESS_REFERENCE: 'Access Reference',
    ACCESSOR: 'Accessor',
    ACCESSOR_DETAILS: 'Accessor Details'
  },

  services: {
    UPDATE_SUCCESS: 'Service configuration has been updated.',
    UPDATE_ERROR: 'Something went wrong. Please try again!',
    RESTART_SUCCESS: 'Server restarted successfully!',
    RESTART_ERROR: 'There was an error while trying to restart your server. Please try again later.',
    UNABLE_TO_DISPLAY_ALLOWED_DOMAINS: 'Proxy Mode must be set to ExclusiveAllow to edit allowed domains.',
    UNABLE_TO_DISPLAY_BANNED_DOMAINS: 'Proxy Mode must be set to Normal to edit banned domains.',
    ADD_DOMAIN: 'Add domain',
    ADD_LISTENER: 'Add listener',
    PROXY_MODE: 'Proxy Mode'
  },

  nodes: {
    NO_NODES_TITLE: 'No nodes',
    NO_NODES_TEXT: 'There are no nodes to display in this node group.',
    EDIT_GROUP: 'Edit group',
    EDIT_NODE: 'Edit node',
    DELETE_GROUP_CONFIRM_DIALOG: "Are you sure you want to remove this node group? All your nodes will be set as 'Uncategorized'",
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
    GO_TO_NODE: 'Go to node',
    GO_TO_NODE_GROUP: 'Go to node group',
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
      LISTED_SHARED: 'Shared',
      LISTED_DEDICATED: 'Dedicated'
    }
  },

  daemon: {
    BACK_TO_NODES: 'Back To Nodes',
    MANAGING_AS: 'Managing daemon as',
    SERVICES: 'Services',
    PROXIES: 'Proxies',
    CERTIFICATES: 'Certificates',
    AUTOLOGIN_FAIL: 'Unable to authenticate to daemon. Please try again later or contact us if the problem persists.'
  },

  market: {
    MODEL_NODE: {
      UNLISTED: 'Unlisted',
      MANAGED: 'Managed',
      LISTED_SHARED: 'Shared',
      LISTED_DEDICATED: 'Dedicated'
    },
    ORDER_PROCESSED: 'Success! Invoice #{invoice} has been issued.',
    ADDED_TO_CART: '{name} was added to your cart.',
    REMOVED_FROM_CART: '{name} was removed from your cart.',
    ITEM_ALREADY_IN_CART: '{name} is already in your cart.',
    CART_MUST_BE_EMPTY: 'You must empty your cart before adding this item.',
    TERM_MODIFIED: 'Billing term changed.',
    NODE_GROUP_IP_COUNT: '{ips} in {nodes} nodes',
    CART_EMPTY: 'Cart Empty',
    CART_EMPTY_MSG: 'Your shopping cart is empty. Add some products to check out.',
    SHOP_NOW: 'Shop Now',
    CLEAR_CART: 'Empty Cart',
    SAVINGS_APPLIED: 'Savings have been applied!',
    ITEM_IS_GROUP_WARNING: 'Purchasing this node group will grant you access to the {count} nodes within it. Click "View Full Details" to see all nodes associated to this group.',
    PLAN_WARNING: 'Purchasing this node group will also unlock access to {planName}. <a href="{planUrl}" target="_blank">Learn more</a>',
    TERM: {
      MONTHLY: 'Monthly',
      YEARLY: 'Yearly'
    }
  },

  users: {
    PLACEHOLDER_EMAIL: 'Email address',
    PLACEHOLDER_PASSWORD: 'Password',
    PLEASE_LOGIN: 'Please login to continue',
    NO_ACCOUNT: 'Don\'t have an account?',
    CREATE_ACCOUNT_NOW: 'Create one now',
    LOGIN_BUTTON: 'Log In',
    REGISTER_BUTTON: 'Register',
    USER_CREATE_SUCCESS: 'User created!',
    USER_UPDATE_SUCCESS: 'User saved!',
    USER_UPDATE_ERROR: 'Something went wrong. Please try again!',
    USER_DELETE_SUCCESS: 'User deleted!',
    USER_DELETE_ERROR: 'There was a problem while deleting this user. Please try again later.'
  },

  settings: {
    EMAIL_CHANGE_NOTICE: 'Your current email is <strong>{email}</strong>. If your new email is invalid we will not be able to reach you and your account will be locked.'
  }
}
