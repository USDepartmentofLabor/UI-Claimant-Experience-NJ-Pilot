const common = {
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
  address: {
    address1: { label: 'Address line 1', required: 'Address is required' },
    address2: { label: 'Address line 2 <i>(optional)</i>' },
    city: { label: 'City', required: 'City is required' },
    state: { label: 'State', required: 'State is required' },
    zipcode: {
      label: 'ZIP Code',
      required: 'ZIP Code is required',
      format: 'ZIP Code must be five digits',
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
  verified_fields: {
    default_heading:
      'The following information has been added to your application:',
  },
  page_loader: 'Loading...',
}

export default common
