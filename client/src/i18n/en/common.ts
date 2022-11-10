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
      required: 'Address is required',
      pobox:
        'PO boxes can only be used as a mailing address, not a residential address',
    },
    city: { label: 'City', required: 'City is required' },
    state: { label: 'State', required: 'State is required' },
    zipcode: {
      label: 'ZIP',
      required: 'ZIP Code is required',
      format: 'ZIP Code must be five digits or in 12345-1234 format',
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
  test_banner: ' Test Site - do not use real personal information',
  verified_fields: {
    default_heading:
      'The following information has been added to your application:',
  },
  page_loader: 'Loading...',
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
}

export default common
