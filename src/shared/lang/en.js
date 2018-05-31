module.exports = {
  lang: 'en',
  misc: {
    DASHBOARD: 'Dashboard',
    MARKET: 'Market',
    ORDERS: 'Orders',
    INVOICES: 'Invoices',
    ITEM: 'Item',
    NODE: 'Node',
    NODE_GROUP: 'Node group',
    NODE_GROUPS: 'Node groups',
    TOTAL_NODES: 'Total Nodes',
    NODES: 'Nodes',
    STATUS: 'Status',
    ORDER: 'Order',
    AMOUNT: 'Amount',
    ROLES: 'Roles',
    DAEMON: 'Daemon',
    RESOURCE: 'Resource',
    DOWNLOADS: 'Downloads',
    ACCOUNT: 'Account',
    SYNC_STATUS: 'Sync Status',
    SUPPORT: 'Support',
    TOTAL: 'Total',
    HELP: 'Help',
    DOCUMENTATION: 'Documentation',
    NEXT_DUE_DATE: 'Next Due Date',
    RESOURCES: 'Resources',
    CART: 'Cart',
    IP_COUNT: 'IP Count',
    SETTINGS: 'Settings',
    LOGOUT: 'Logout',
    TYPE: 'Type',
    NOT_FOUND: 'We were unable to find any {type}.',
    LOADING: 'Loading',
    CONTINUE: 'Continue',
    CANCEL: 'Cancel',
    VIEW: 'View',
    ENGAGEMENTS: 'Engagements',
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
    MARKET_INFO: 'Market Information',
    GENERAL_INFO: 'General Information',
    PRICE: 'Price',
    LOCATION: 'Location',
    FRIENDLY_NAME: 'Friendly name',
    MARKET_MODEL: 'Market Model',
    ASN: 'ASN',
    AVAILABLE_SOON: 'Available soon.',
    CC: 'Country code',
    CITY: 'City',
    COUNTRY: 'Country',
    ANY_COUNTRY: 'Any country',
    PORT_NUMBER: 'Port No.',
    IP: 'IP Address',
    IP_ADDRESSES: 'IP Addresses',
    SYSTEM: 'System',
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
    LEAVE_CONFIRM_DIALOG: 'Are you sure you want to leave? Any unsaved changes will be lost.',
    PLEASE_WAIT: 'Please Wait',
    GO_TO_DASHBOARD: 'Go to Dashboard',
    NO_CANCEL: 'No, Cancel',
    EMPTY_RESULTS: 'You don\'t have any {type} yet.',
    ORDER_DATE: 'Order Date',
    TERM: 'Term',
    USERNAME: 'Username',
    PASSWORD: 'Password'
  },

  errors: {
    ERROR_404_TITLE: '404',
    ERROR_404_META_TITLE: 'Page not found!',
    ERROR_404_TEXT: 'Oops! The page or resource you were looking for doesn\'t exist.',
    ERROR_404_ITEM_TITLE: '{item} not found!',
    ERROR_404_ITEM_TEXT: 'We were unable to find that {item}.',
    ERROR_400_ITEM_TITLE: 'Something went wrong.',
    ERROR_400_ITEM_TEXT: 'We were unable to retrieve the list of {item} you requested.',
    REQUESTED_PAGE_DOES_NOT_EXIST: 'Invalid page!',
    VALIDATION_FAILED: 'Please correct any errors and try again.',
    OBJECT_PERSIST_FAILED: 'Something went wrong, please try again later.',
    RESOURCE_CREATION_FAILED: 'Unable to create resource, please try again later.',
    RESOURCE_NOT_FOUND: 'We could not find that resource. Please contact us if the error persists.',
    REQUEST_FAILED: 'The request failed. Please contact us if the error persists.',
    UNAUTHORIZED: 'You are not authorized to do this. Please contact us if the error persists.',
    PAYMENT_FAILED: 'Payment failed',
    INVOICE_ALREADY_PAID: 'This invoice has already been paid!',
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
    ORDER_CONTAINS_UNAVAILABLE_RESOURCE: 'Error: This order contains an unavailable resource!',
    INVALID_SERVICE_OR_ACTION_ATTEMPT: 'Invalid action attempt on service.',
    INVALID_IP_AS_LISTENER_REQUEST: 'Unable to bind httpProxy/openVPN server to this listener.',
    INVALID_HTTP_MODE_REQUEST: 'Invalid HTTP mode change requested.',
    STORED_CONFIG_WAS_NULL: 'Unable to store service configuration.',
    CANNOT_DELETE_SELF: 'You can\'t delete yourself.',
    ROLE_ESCALATION_FAILED: 'You don\'t have permission to add users of this role level.',
    CLOUD_USER_ALTER_NOT_ALLOWED: 'You can\'t alter this cloud user.',
    ENDPOINT_NOT_FOUND: 'Endpoint not found or unreachable',
    RELEASES_FETCH_FAILED: 'Unable to load release data, please try again later.',
    MATRICES_FETCH_FAILED: 'Unable to load compatibility matrices data, please try again later.',
    ECONNABORTED: 'We\'re having trouble connecting to the authentication server. Please try again later.'
  },

  payments: {
    VALIDATION_FAILED: 'The minimum amount you can purchase is of 5 credits (in $USD).',
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
    BACK: 'Back to invoices',
    PAY_INVOICE: 'Pay Invoice',
    PAY_TEXT2: 'Please pay the amount due using the options available below.',
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
    },
    UNABLE_TO_PROCESS: 'We were unable to process some of the resources of your order.',
    FIX_OPTIONS_TEXT: 'Use the button below to automatically fix this order and remove any invalid resources. Additionally, you may cancel the order if you\'d like to place a new one.',
    RESOURCES_MISMATCH: 'Your current order has mismatching resources. Please contact us and provide your order ID ({order}) so that we can solve the problem.',
    RESOURCE_ERROR: {
      RESOURCE_NOT_FOUND: 'Resource no longer available',
      RESOURCE_SOLD_OUT: 'Resource sold out'
    },
    PAID: 'Invoice Paid',
    THANKS: 'Thank you for your payment, your invoice has been paid in full.',
    BILL_TO: 'Bill to',
    NUMBER: 'Invoice Number',
    STATUS: 'Invoice Status',
    TYPE: 'Invoice Type',
    DATE: 'Invoice Date',
    PAYMENT_DUE: 'Payment Due',
    AMOUNT_DUE: 'Amount Due',
    BALANCE_DUE: 'Balance Due',
    BALANCE_DUE_TEXT: 'There is an outstanding balance of <strong>{amount} {currency}</strong> due on this invoice. Please pay now to avoid any late fees.'
  },

  orders: {
    RESOURCE_NOT_FOUND: 'We were unable to find that order resource.',
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
    VIEW_INVOICE: 'View invoice',
    VIEW_RESOURCES: 'View Resources',
    BACK_TO_ORDER: 'Back to Order Details',
    VIEW_ALL_RESOURCES: 'List all resources',
    VIEW_LATEST_INVOICE: 'View Latest Invoice',
    NOT_ENABLED_TITLE: 'Not enabled',
    NOT_ENABLED: '{type} is not enabled for this node.',
    USE_ACCESSOR: 'Please use the login data as shown in your accessor.',
    ACCESS_CREDENTIALS: 'Access Credentials',
    ACCESS_CONFIG: 'Access Config',
    ACCESS_REFERENCE: 'Access Reference',
    ACCESSOR: 'Accessor',
    UNABLE_TO_CHECK_ACCESSOR: 'Unable to check accessor details, please manually refresh the page.',
    ACCESSOR_DETAILS: 'Accessor Details',
    ACCESSOR_DETAILS_TEXT: 'Your accessor details will update once they process.',
    FIX: 'Fix Order',
    FIX_SUCCESS: 'Your order has been fixed and is available for payment.',
    FIX_ERROR: 'There was an error while attempting to fix your order!',
    DELETE_ORDER_CONFIRM_DIALOG: 'Are you sure you want to cancel this order?',
    CANCEL: 'Cancel Order',
    CANCEL_ERROR: 'There was a problem cancelling your order. Please try again or contact us if this issue persists.',
    CANCEL_SUCCESS: 'Your order has been cancelled.',
    REGENERATE_ACCESSOR: 'Regenerate Accessor',
    REGENERATE_ACCESSOR_WARNING: 'Regenerating your accessor will take up to 5 minutes to sync and your existing accessor details will become invalid. Do you wish to continue?',
    REGENERATE_ACCESSOR_ERROR: 'There was an issue regenerating your accessor. Please try again in a few minutes and if the problem persists please contact support.',
    REGENERATE_ACCESSOR_SUCCESS: 'Your request is processing and your accessor details will update within 5 minutes.',
    SYNC_STATUS_TOOLTIP: 'The synchronization status of this node / node group.'
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
    VERIFY_NODE: 'Verify node',
    VERIFICATION_FAILED_TITLE: 'Something went wrong!',
    VERIFICATION_FAILED: 'Something happened while attempting to verify your node <strong>{name}</strong>. We have sent you an email with further details.',
    UNCATEGORIZED: 'Uncategorized',
    NO_NODES_TITLE: 'No nodes',
    HAS_NODES: 'You cannot delete this group before reassigning its nodes to a different group!',
    RESOURCE_NOT_FOUND: 'We were unable to find that resource.',
    NO_NODES_TEXT: 'There are no nodes to display in this node group.',
    EDIT_GROUP: 'Edit group',
    EDIT_NODE: 'Edit node',
    DELETE_GROUP_CONFIRM_DIALOG: 'Are you sure you want to remove this node group?',
    DELETE_SUCCESS: 'Node removed successfully!',
    GROUP_DELETE_SUCCESS: 'Group removed successfully!',
    DELETE_ERROR: 'An error ocurred while trying to delete your node. Please try again later.',
    REQUEST_FAILED: 'The request failed. Please contact us if the error persists.',
    NODE_VERIFY_SUCCESS: 'Your node {node} is now queued for verification. We\'ll send you an email as soon as this is finished.',
    GROUP_UPDATE_SUCCESS: 'Node group updated successfully!',
    UPDATE_SUCCESS: 'Node information updated successfully!',
    GROUP_FROM_NODE_UPDATE_SUCCESS: 'Group changed successfully!',
    HAS_ACTIVE_ORDERS: 'Unable to change market model (this node has active orders)!',
    ORDERS_EXIST: 'Unable to remove: this node has active orders!',
    GROUP_PRICE_AVAILABILITY: 'Price will only be used for <strong>{model1}</strong> and <strong>{model2}</strong> market models.',
    DELETE_ENGAGEMENT_CONFIRM_DIALOG: 'Are you sure you want to cancel this engagement?',
    ENGAGEMENT_DELETE_SUCCESS: 'Engagement cancelled.',
    ORDER_NOT_ACTIVE_YET: 'Unable to cancel engagement: This order isn\'t active yet!',
    GO_TO_NODE: 'Go to node',
    GO_TO_NODE_GROUP: 'Go to node group',
    MARKET_MODEL_TOOLTIP: 'There are three types of market model:',
    STATUS: {
      UNCONFIRMED: 'Unconfirmed',
      CONFIRMED: 'Confirmed',
      PENDING_VERIFICATION: 'Pending Verification',
      ENABLED: 'Enabled',
      DISABLED: 'Disabled',
      CANCELLED: 'Cancelled'
    },
    MODEL: {
      ANY: 'Any type',
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
    BACK: 'Back to market',
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
    },
    PER_MONTH: 'per month',
    PER_YEAR: 'per year',
    UNAVAILABLE: 'Unavailable',
    CHANGE_TERM: 'Change term',
    PURCHASE_ACCESS: 'Purchase access',
    ADDED_TO_YOUR_CART: 'Added to your cart',
    REMOVE_FROM_CART: 'Remove from cart',
    CART_SUMMARY: 'Cart Summary',
    DUE_TODAY: 'Due today',
    RECURRING_FEES: 'Recurring fees',
    RECURRING_FEES_TEXT: 'There are recurring fees associated with items in this cart.',
    RENEWS: 'Renews',
    YEARLY_SAVING: 'By paying yearly, you\'re saving',
    YEARLY_COULD_SAVE: 'By paying yearly, you could save',
    YEARLY_SWITCH: 'Switch to yearly',
    GROUPED_RESULTS: 'Grouped results',
    SHOW_GROUPED_RESULTS: 'Show grouped results',
    SERVICE_TYPES: 'Service types',
    PRICE_RANGE: 'Price range',
    MIN_IPS: 'Min. no. of IP addresses'
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
  },

  help: {
    nodes: {
      title: 'Nodes',
      subtitle: 'Subtitle here',
      topics: {
        general: {
          title: 'General help',
          description: 'test 123',
          topics: {
            what: {
              title: 'What is a node?',
              description: 'A node is you lorem ipsum dolor.'
            },
            availability: {
              title: 'How do I know the availability of a given node?',
              description: 'A given node is lorem.'
            }
          }
        },
        buying: {
          title: 'Purchasing nodes',
          description: 'Purchasing nodes is very simple! Lorem ipsum for all!'
        },
        marketModels: {
          title: 'Market models',
          description:
            `<p><strong>Unlisted</strong>: A node or group that is NOT listed in the Spectero Market.</p>
              <p><strong>Shared</strong>: A node or group that allows more than one customer to purchase access to it. All customers share their resources.</p>
              <p><strong>Dedicated</strong>: A node or group that only allows one dedicated customer to purchase access to it. No resources are shared; it is dedicated to one user only.</p>
              <p><strong>Managed</strong>: A managed node or group.</p>`
        }
      }
    },
    groups: {
      title: 'Groups',
      subtitle: 'Subtitle here',
      topics: {
        general: {
          title: 'General help',
          description: 'This is a general text about groups.'
        }
      }
    },
    market: {
      title: 'Markeplace',
      subtitle: 'You can buy nodes and node groups here.',
      topics: {
        methods: {
          title: 'Payment methods',
          description: 'You can pay with PayPal, Credit Card or credit.'
        }
      }
    },
    invoices: {
      title: 'Invoices',
      subtitle: 'Manage your invoices here.',
      topics: {
        status: {
          title: 'Invoice status',
          description: 'Your invoice can have a different status.'
        }
      }
    },
    orders: {
      title: 'Orders',
      subtitle: 'Subtitle here',
      topics: {
        billing: {
          title: 'Billing',
          description: 'Billing works like this: ...'
        }
      }
    }
  }
}
