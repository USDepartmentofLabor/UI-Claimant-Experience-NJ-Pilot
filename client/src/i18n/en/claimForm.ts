const claimForm = {
  step_progress: 'step {{step}} of {{totalSteps}}',
  pagination: {
    previous: 'Back',
    next: 'Next',
    next_step: 'Next: {{stepName}}',
    save_and_exit: 'Save and exit',
    complete: 'Complete',
  },
  personal: {
    heading: 'Personal Information',
  },
  demographics: {
    heading: 'Demographics',
    preamble:
      'We ask for your demographic information only for our reporting requirements. ' +
      "Your responses to these questions won't affect your application or potential payment amount. " +
      'We are working to update our systems to support more inclusive selections.',
  },
  identity: {
    heading: 'Identity Information',
  },
  ssn: {
    label: 'Social Security number',
    hint: 'Use format 000-00-0000',
    errors: {
      badFormat: 'Must use format 000-00-0000',
      required: 'Social Security number is required',
    },
    showSsnLabel: 'Show SSN',
  },
  birthdate: {
    label: 'Date of birth',
    errors: {
      maxDate: 'Date must be in the past',
      required: 'Date of birth is required',
    },
  },
  sex: {
    label: 'What is your sex?',
    options: {
      female: 'Female',
      male: 'Male',
      x: 'X (unspecified)',
    },
    errors: {
      required: 'Sex is a required field',
    },
  },
  race: {
    label: 'What race are you?',
    options: {
      american_indian_or_alaskan: 'American Indian or Alaskan Native',
      asian: 'Asian',
      black: 'Black or African American',
      hawaiian_or_pacific_islander: 'Native Hawaiian or Other Pacific Islander',
      white: 'White',
      opt_out: 'Choose not to answer',
    },
    errors: {
      required: 'Race is a required field',
    },
  },
  ethnicity: {
    label: 'Are you Hispanic or Latino?',
    options: {
      hispanic: 'Yes',
      not_hispanic: 'No',
      opt_out: 'Choose not to answer',
    },
    errors: {
      required: 'Ethnicity is a required field',
    },
  },
  education_level: {
    label: 'What is the highest level of education you have completed?',
    options: {
      none: 'No Schooling',
      less_than_high_school: 'Less than High School',
      some_high_school: 'Some High School',
      high_school_ged: 'High School Graduate/GED',
      some_college: 'Some College',
      associates: "Associate's Degree",
      bachelors: "Bachelor's Degree",
      some_graduate: 'Some Graduate School',
      masters: "Master's Degree",
      doctorate: 'Doctoral Degree',
    },
    errors: { required: 'Education level must be selected' },
  },
  work_authorization: {
    authorized_to_work: {
      label: 'Are you legally allowed to work in the United States?',
      errors: {
        required: 'Please indicate whether you are authorized to work',
      },
    },
    not_authorized_to_work_explanation: {
      label: 'Please share more about why you can’t work in the United States:',
      errors: {
        required:
          'Please share more about why you can’t work in the United States',
      },
    },
    authorization_type: {
      label: 'Select your authorization:',
      options: {
        US_citizen_or_national: 'U.S. citizen/national',
        permanent_resident: 'Permanent resident',
        temporary_legal_worker: 'Temporary legal worker',
      },
      errors: {
        required: 'You must select an authorization status',
      },
    },
    alien_registration_number: {
      label: 'Alien registration number',
      errors: {
        format:
          'Please enter a valid Alien registration number with format 123-456-789',
        required: 'Alien registration number is required',
      },
    },
  },
  drivers_license_or_state_id_number: {
    label: 'Driver’s license or state ID number',
    errors: {
      required: 'Driver’s license or state ID number is required',
    },
  },
  employers: {
    separation: {
      heading: 'Separation',
      reason: {
        label: 'Why did your job end/your hours change?',
        required: 'Separation reason is required',
      },
      option: {
        required: 'Please select a separation option',
      },
      comment: {
        required_label: 'Please share more details below',
        optional_label: 'Please share more details below <i>(optional)</i>',
        errors: {
          required: 'More detail about the separation reason is required',
        },
      },
      reasons: {
        laid_off: {
          label: 'Laid off',
          description:
            'Your job ended due to lack of work, downsizing, your contract ending, or your place of work closing or moving.',
          option_heading: 'What was the reason you were laid off?',
          options: {
            lack_of_work: 'Lack of work, including seasonal',
            finished_job: 'Finished job/position or contract ended',
            position_eliminated: 'Position eliminated/downsizing',
            business_closed: 'Business closed or moved out of area',
          },
        },
        fired_discharged_terminated: {
          label: 'Fired, discharged, or terminated',
          description:
            'Your employer ended your job, claiming you had performance or behavior issues.',
          option_heading:
            'What was the reason you were fired, discharged, or terminated?',
          options: {
            attendance: 'Attendance',
            violation: 'Violation of employer policy',
            other: 'Other reason',
            none: 'No reason provided',
          },
        },
        still_employed: {
          label: 'Still employed',
          description:
            "You're still working for your employer, but you may have fewer hours or be on a leave/break.",
          option_heading: 'What has changed about your job?',
          options: {
            still_working_hours_unchanged:
              'Still working, hours have not changed',
            hours_reduced_by_employer: 'Hours reduced by employer',
            hours_reduced_by_me: 'Hours reduced by me',
            shared_work_program: 'Shared Work Program',
            leave_of_absence:
              'On a leave of absence (personal, medical, or family medical)',
            temporary: 'On a temporary layoff, furloughed',
            still_working_self_employed:
              'Still working, self-employed with this employer',
            suspended: 'Suspended',
            school_employee: 'School employee, on a break/holiday',
            holiday_vacation: 'Holiday/vacation',
          },
        },
        quit: {
          label: 'Quit',
          description: 'You left your job (this does not include retirement).',
          option_heading: 'Why did you quit your job?',
          options: {
            personal: 'Personal',
            health: 'Health',
            general: 'General',
            quit_job: 'Quit for another job',
            quit_terminated: 'Quit instead of being terminated',
          },
        },
        strike: {
          label: 'Strike or lock out by employer',
          description:
            'During a labor dispute, you chose to stop work or your employer stopped work.',
          // unconventional to have a null translation but it's because we leverage this file also for TS types
          option_heading: null,
        },
        retired: {
          label: 'Retired',
          description:
            'You have concluded your working career. Retiring can be voluntary or mandatory.',
          option_heading: null,
        },
        shutdown: {
          label: 'Federal or State shutdown',
          description: 'Your job ended due to lack of government funding.',
          option_heading: null,
        },
      },
    },
    heading: 'Your employer',
    reason_for_data_collection:
      'We need the <strong>last 18 months</strong> of your work history to calculate your unemployment benefit amount. List out all your jobs, including jobs you are still working, to avoid delays with your application.',
    errors: {
      required: 'This field is required',
    },
    address: {
      heading: 'Employer address',
      address1: { label: 'Employer address line 1' },
      address2: { label: 'Employer address line 2 <i>(optional)</i>' },
      city: { label: 'City' },
      state: { label: 'State' },
      zipcode: { label: 'ZIP Code' },
    },
    name: {
      label: 'Employer name',
      hint: 'You can usually find your employer or company’s name on your paystub or W2.',
      required: 'Employer name is required',
    },
    more_employers: {
      label:
        'Have you worked for any other employers in the last 18 months (including part-time, seasonal, and self-employment)?',
      required:
        'Please indicate whether you have worked for any other employers in the last 18 months',
    },
    first_work_date: {
      label: 'Start date for this employer:',
      required: 'Start date is required',
    },
    last_work_date: {
      label: 'Last day of work for this employer:',
      required: 'Last day of work is required',
    },
    same_phone: {
      label:
        'Is the phone number of your physical workplace the same as the number listed above?',
      required:
        'Please indicate if this is the phone number of your physical workplace',
    },
    phones: {
      number: {
        label: 'Employer phone number',
        required: 'Employer phone number is a required field',
        matches: 'Please enter a phone number like (555) 555-1234',
      },
    },
    alt_employer_phone: 'Work location phone number',
    same_address: {
      label:
        'Did you work at the physical location you listed for your employer?',
      required:
        'Please indicate if you worked at the physical location you listed for your employer',
    },
    work_site_address: {
      heading: 'What physical address did you work at?',
      address1: { label: 'Employer address line 1' },
      address2: { label: 'Employer address line 2 <i>(optional)</i>' },
      city: { label: 'City' },
      state: { label: 'State' },
      zipcode: { label: 'ZIP Code' },
    },
    no_different_phone: 'No, it was a different phone number',
    no_different_address: 'No, I worked at a different location',
    fein: {
      label: 'FEIN, or Federal Employer Identification Number (optional)',
      hint: "You can usually find your employer's FEIN on your W2 or other tax documents your employer provides.",
      pattern: 'The FEIN must match the pattern 12-1234567',
    },
    state_employer_payroll_number: {
      label: 'State employer payroll number (optional)',
      hint: 'You can find the state employer payroll number on line 15 of your W2.',
    },
    self_employed: {
      label: 'Were you self-employed at this job?',
      required: 'You must indicate whether you were self-employed at this job',
    },
  },
  self_employment: {
    label: 'Self-employment',
    self_employed: {
      label: 'Are you currently self-employed?',
      required: 'You must indicate whether you are self-employed',
    },
    business_ownership: {
      label: 'Do you have ownership in a business of any kind?',
      required: 'You must indicate whether you have ownership in a business',
    },
    business_name: {
      label: 'Name of business',
      required: 'You must indicate the name of the business',
    },
    business_interests: { label: 'Your business interests' },
    corporate_officer: {
      label:
        'Are you a corporate officer, or do you own more than 5% of the stock for the company you worked for?',
      required:
        'You must indicate whether you are a corporate officer or own stock in your company',
    },
    corporation_name: {
      label: 'Name of corporation',
      required: 'You must indicate the name of the corporation',
    },
    related_to_owner: {
      label:
        'Are you related to the owner of any business you worked for during the last 18 months?',
      help_text:
        'Choose "No" unless the business owner is your spouse or child, or if you are a child under 18 working for a parent',
      required:
        'You must indicate whether you are related to the owner of any business you worked for during the last 18 months',
    },
    corporation_or_partnership: {
      label: 'Is this business a corporation or partnership?',
      required:
        'You must indicate whether the business is a corporation or a partnership',
    },
  },
  occupation: {
    search: 'Search',
    choose_the_occupation:
      'Choose the occupation that best matches what you entered above. If nothing matches, please try another search.',
    what_is_your_occupation: {
      label: 'What is your occupation?',
      required: 'Occupation is required',
      min_length: 'Occupation must be at least three characters',
    },
    hint: "If you're not sure, see our",
    list_of_occupations: 'list of occupations',
    short_description: {
      label: 'Give a short description of your job:',
      required: 'Job description is required',
    },
    bls_code: {
      required: 'Please select the occupation that best matches your selection',
    },
    no_results: 'No results. Try another search.',
  },
  able_and_available: {
    heading: 'Able and available',
    info_alert: {
      title:
        'For unemployment insurance, you are “disabled” if any of the following are true:',
      items: {
        doctor_cert:
          'A medical provider certifies you are unable to work due to a physical/mental health condition, pregnancy, or childbirth recovery',
        tdi: 'You are receiving temporary disability benefits',
        workers_comp: "You are receiving workers' compensation benefits",
      },
    },
    can_begin_work_immediately: {
      label: 'Can you begin full-time work immediately?',
      errors: {
        required:
          'You must indicate whether you can begin full-time work immediately',
      },
    },
    has_collected_disability: {
      label:
        'Since your last day worked, have you received disability or family leave payments?',
      help_text:
        'Choose "No" if you received payments from Social Security (SSI/SSDI).',
      errors: {
        required:
          'You must indicate whether you have received disability payments',
      },
    },
    disabled_immediately_before: {
      label:
        'Were you disabled in the last 4 weeks before filling out this application?',
      errors: {
        required:
          'You must indicate whether you were disabled in the last 4 weeks',
      },
    },
    type_of_disability: {
      label: 'What plan do you get your payment from?',
      options: {
        state_plan:
          'State insurance plan (temporary disability or family leave)',
        private_plan: 'Private insurance plan provided by your employer',
        workers_compensation:
          "Workers' compensation due to being injured on the job",
      },
      errors: {
        required:
          'You must indicate from which plan you get your disability payment',
      },
    },
    date_disability_began: {
      label: 'Date disability or family leave began',
      errors: {
        required: 'You must indicate the date disability or family leave began',
        maxDate:
          "Date disability or family leave began cannot be after today's date",
      },
    },
    recovery_date: {
      label: 'Recovery/release/end date',
      help_text:
        'If you have not yet recovered, type the current date below and we will request more information from you at a later date by email.',
      errors: {
        required: 'You must indicate a Recovery/release/end date',
        minDate:
          'Recovery/release/end date has to be after the date of disability',
        maxDate: "Recovery/release/end date cannot be after today's date",
      },
    },
    contacted_last_employer_after_recovery: {
      label:
        'After recovering, did you contact your last employer for more work?',
      errors: {
        required:
          'You must indicate if you contacted your employer after recovering',
      },
    },
  },
  education_and_training: {
    heading: 'Your education and training',
    attending_training: {
      label:
        'Are you currently attending school, college, or unpaid job training?',
      required:
        'You must indicate whether you are currently attending school, college, or job training',
      help_text:
        'If you are in union-required training or paid job training, choose "No."',
    },
    enrollment: {
      label: 'How did you enroll?',
      options: {
        self_enrolled: 'Self-enrolled',
        career_center:
          'Through a Career Center such as Department of Labor, Vocational Rehabilitation, etc.',
        union: 'Through a union hiring hall',
      },
      error: {
        required: 'Select how you enrolled',
      },
    },
    full_time_student: {
      label: 'Have you been a full-time student during the last 18 months?',
      required:
        'You must indicate whether you have been a full-time student during the last 18 months',
    },
  },
  union: {
    heading: 'Union membership',
    union_name: {
      label: 'Name of your union',
      errors: {
        required: 'You must indicate the name of your union',
      },
    },
    union_local_number: {
      label: 'Union local number',
      errors: {
        required: 'You must indicate your union local number',
      },
    },
    required_to_seek_work_through_hiring_hall: {
      label:
        'Are you required to seek work through a union hiring hall (a job placement office operated by your union)?',
      errors: {
        required:
          'You must indicate whether you are required to seek work through a union hiring hall',
      },
    },
  },
  contact: {
    heading: 'Contact Information',
    more_phones: 'Add another phone number',
    email: 'Email address', // no label, not editable
    interpreter_required: {
      label: 'Do you need an interpreter to communicate with us?',
      required: 'You must indicate whether you need an interpreter',
    },
    preferred_language: {
      label: 'What language do you speak?',
      required: 'Please indicate the language you speak',
    },
  },
  name: {
    legal_name: 'What is your legal name?',
    alternate_name: 'Additional name',
    first_name: { label: 'First name', required: 'First name is required' },
    middle_initial: {
      label: 'Middle initial <i>(optional)</i>',
      errors: {
        max: 'Middle initial must be at most 1 character',
      },
    },
    last_name: { label: 'Last name', required: 'Last name is required' },
    suffix: {
      label: 'Suffix <i>(optional)</i>',
      options: {
        I: 'I',
        II: 'II',
        III: 'III',
        IV: 'IV',
        junior: 'Junior',
        senior: 'Senior',
      },
    },
    claimant_has_alternate_names: {
      label:
        'In the last 18 months, have you worked under a name different from your legal name?',
      required:
        'You must indicate if you have worked under a different name in the past 18 months',
    },
  },
  payment: {
    heading: 'Payment information',
    federal_income_tax_withheld: {
      label:
        'Would you like to have 10% federal income tax withheld from your benefits payments?',
      help_text:
        'Federal tax withholding will only be made after amounts are deducted and withheld for any unemployment overpayments, child support obligations, or any other amounts required to be deducted and withheld by law.',
      errors: {
        required: 'Your tax withholding preference is required',
      },
    },
    payment_method: {
      label: 'How would you like to receive your benefits payments?',
      options: {
        debit: 'Prepaid debit card mailed to me',
        direct_deposit: 'Direct deposit to my bank account',
      },
      errors: {
        required: 'Your payment preference is required',
      },
    },
    account_type: {
      label: 'Account type',
      options: {
        checking: 'Checking',
        savings: 'Savings',
      },
      errors: {
        required: 'Account type is required',
      },
    },
    routing_number: {
      label: 'Routing number',
      errors: { required: 'Routing number is required' },
    },
    re_enter_routing_number: {
      label: 'Re-enter routing number',
      errors: {
        mustMatch: 'Must match routing number',
        required: 'Re-enter routing number is required',
      },
    },
    account_number: {
      label: 'Account number',
      errors: { required: 'Account number is required' },
    },
    re_enter_account_number: {
      label: 'Re-enter account number',
      errors: {
        mustMatch: 'Must match account number',
        required: 'Re-enter account number is required',
      },
    },
  },
  other_pay_detail: {
    pay_type: {
      label:
        'Have you received any payments from your employer(s) since becoming unemployed?',
      required: 'At least one option must be selected',
      options: {
        vacation_sick_pto: {
          label: 'Vacation/sick/PTO pay',
          description:
            'Pay you received for approved time off or a pay out of unused time off',
        },
        final_paycheck: {
          label: 'Final paycheck',
          description:
            'Pay you received for hours you worked prior to your last day of work',
        },
        pension_annuity_retirement: {
          label: 'Pension, annuity, or retirement pay',
          description:
            'Pay you received from a retirement plan associated with an employer you listed on this application (not a loan)',
        },
        severance: {
          label: 'Severance pay',
          description:
            "Pay you received from your employer when you're dismissed from your job",
        },
        profit_sharing: {
          label: 'Profit sharing',
          description:
            "A share in your company's profits based on your yearly salary",
        },
        other: {
          label: 'Other type of pay',
          description: '',
        },
        no_other_pay: {
          label: 'I have not received any other pay',
          description: '',
          ariaDescription: 'Selecting this disables all other pay options',
        },
      },
    },
    total: {
      label: 'Total {{- payType }} received',
      currencyPrefix: '$',
      errors: {
        required: 'Total pay is required, in dollars',
        min: 'Total pay must be greater than 0',
        number:
          'Total must be a number in dollars or cents, like 150, or 150.75',
      },
    },
    date_received: {
      label: 'Date {{- payType }} received',
      errors: {
        required: 'Date received is required',
        max: 'Date must be today or in the past',
        label: 'Date received',
      },
    },
    note: {
      label: 'Please share more about your {{- payType }} received',
      errors: {
        required: 'Please provide further details',
      },
    },
  },
  legal_affirmation: {
    required: 'You must confirm the affirmation statement by checking the box',
    label:
      'I gave true answers to all questions. I know that there may be legal punishments for giving false answers.',
  },
  is_complete: { label: "I'm done!", required: 'You must check the box' },
  is_complete_description:
    'Checking this box means your claim will be sent to your workforce agency',
  validation_alert_one: 'Correct the error on this page to proceed',
  validation_alert_other:
    'Correct the {{ count }} errors on this page to proceed',
  verified_by_idp: {
    heading: 'The following information has been added to your application:',
    to_edit_visit: 'To edit your information, visit',
    idp_url_text: 'login.gov',
  },
}

export default claimForm
