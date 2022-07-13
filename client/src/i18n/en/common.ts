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
  phone: {
    number: {
      label: 'Phone number',
      errors: {
        matches: 'Please enter a phone number like (555) 555-1234',
        required: 'Phone number is required',
      },
    },
    type: {
      label: 'Type of phone number <i>(optional)</i>',
      mobile: 'Mobile',
      home: 'Home',
      work: 'Work',
    },
    sms: {
      label: 'Send me text (SMS) notifications',
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
}

export default common
