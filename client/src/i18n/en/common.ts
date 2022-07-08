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
}

export default common
