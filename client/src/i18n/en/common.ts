const common = {
  skip_nav: 'Skip to main content',
  yes: 'Yes',
  no: 'No',
  date: {
    month: {
      label: 'Month',
    },
    day: {
      label: 'Day',
    },
    year: {
      label: 'Year',
    },
    errors: {
      format:
        '{{ fieldName }} must be a valid date with format {{ dateFormat }}',
      required: '{{ fieldName }} is required',
    },
  },
  select_one: '-- Select one --',
  select: '- Select -',
  address: {
    address: {
      label: 'Address',
      errors: {
        required: 'Address is required',
        pobox:
          'P.O. boxes can only be used as a mailing address, not a residential address. If you do not have another address, then please contact us.',
        maxLength: {
          employer: 'Address must be at most 40 characters',
          address_generic_max: 'Address must be at most 64 characters',
          residence: 'Address must be at most 30 characters',
          mailing:
            'Mailing Address and mailing city  combined must be at most 44 characters',
        },
      },
    },
    address2: { label: 'Address 2 (optional)' },
    address3: { label: 'Address 3 (optional)' },
    city: {
      label: 'City',
      errors: {
        required: 'City is required',
        noNumbers: 'Do not use numbers',
        maxLength: {
          residence: 'City must be at most 19 characters',
          employer: 'City must be at most 40 characters',
          address_generic_max: 'City must be at most 64 characters',
        },
      },
    },
    state: {
      label: 'State',
      errors: {
        required: 'State is required',
      },
    },
    zipcode: {
      label: 'ZIP',
      errors: {
        required: 'ZIP Code is required',
        format: 'ZIP Code must be five digits or in 12345-1234 format',
      },
    },
  },
  expanded_content: {
    revealed: 'revealed content',
    collapsed: 'collapsed',
  },
  validation: {
    required: 'This field is required',
    notEmail: 'This is not a valid email',
    email_does_not_match: 'Confirmation email does not match',
    notZipCode: 'This is not a valid zip code',
  },
  banner: {
    aria_label: 'Official government website',
    flag_alt: 'State of New Jersey flag',
    header_text: 'This is a State of New Jersey government website',
    header_action: 'Here’s how you know',
    dot_gov_title: 'Official websites use .gov',
    dot_gov_description:
      'A <strong>.gov</strong> website belongs to an official government organization in the United States.',
    https_title: 'Secure .gov websites use HTTPS',
    https_description_1: 'A <strong>lock</strong>',
    https_description_2:
      'or <strong>https://</strong> means you’ve safely connected to the .gov website. Share sensitive information only on official, secure websites.',
    lock_title: 'Lock',
    lock_description: 'A locked padlock',
  },
  beta_banner: {
    description: 'This site is in beta.',
    disclaimer: 'Pages are being tested and improved.',
  },
  test_banner: ' Test Site - do not use real personal information',
  verified_fields: {
    default_heading:
      'The following information has been added to your application:',
  },
  update_payment_button: 'Update payment info',
  tax_doc_button: 'Get your 1099-G',
  update_contact_info_button: 'Update Address/Telephone',
  page_loader: 'Loading...',
  header: {
    home: 'Home',
    my_claim: 'My claim',
    payments: 'Change payments',
    contact: 'Change contact information',
    appeal: 'File an appeal',
    privacy: 'Data privacy and security',
    logout: 'Log out',
    signout: 'Sign out',
    signin: 'Sign in',
    title: 'Unemployment Insurance benefits',
    menu: 'Menu',
  },
  footer: {
    return_top: 'Return to top',
    logo_alt: 'The State of New Jersey logo',
    identifier_aria: 'Agency identifier',
    official: 'An official website of the ',
    state: 'State of New Jersey',
    links: 'Important links',
    gov: 'Governor Phil Murphy',
    ltgov: 'Lt. Governor Sheila Oliver',
    home: 'NJ Home',
    services: 'Services A to Z',
    departments: 'Departments/Agencies',
    faqs: 'FAQs',
    contact: 'Contact Us',
    privacy: 'Privacy Notice',
    legal: 'Legal Statement & Disclaimers',
    accessibility: 'Accessibility',
    opra: 'Open Public Records Act (OPRA)',
    gov_aria: 'U.S. government information and services',
    copyright: 'Copyright © 2020 State of New Jersey',
  },
  timeout: {
    title: 'You will be logged out due to inactivity in ',
    stay_logged_in: 'Stay logged in',
    log_out: 'Log out',
    instructions:
      'Click the button below to stay logged in. Otherwise, to protect your' +
      ' data, you will be logged out and unsaved changes may be lost.',
    sr_countdown_zero: '{{seconds}} seconds',
    sr_countdown_one: '{{count}} minute, {{seconds}} seconds',
    sr_countdown_other: '{{count}} minutes, {{seconds}} seconds',
  },
  errorStatus: {
    '500': 'Internal server error',
    '404': 'This page could not be found',
  },
}

export default common
