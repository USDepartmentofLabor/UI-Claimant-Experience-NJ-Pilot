const claimForm = {
  step_progress: 'step {{step}} of {{totalSteps}}',
  pagination: {
    previous: 'Back',
    next: 'Next',
    next_step: 'Next: {{stepName}}',
    save_and_exit: 'Save and exit',
    submit: 'Submit',
  },
  prequal: {
    heading: "Let's get started",
    filed_in_last_12mo: {
      label:
        'Have you filed for unemployment benefits during the last 12 months?',
      errors: {
        required:
          'Please say whether you have filed for unemployment benefits during the last 12 months',
      },
    },
    state_province_territory_where_filed: {
      label: 'Where did you file?',
      errors: {
        required:
          'Please say the location you filed for unemployment benefits during the last 12 months',
      },
    },
    lived_outside_nj_when_working_nj: {
      label: 'When you worked in New Jersey, did you live out of state?',
      errors: {
        required:
          'Please say when you worked in New Jersey, if you lived out of state',
      },
    },
    will_look_for_work_in_nj: {
      label: 'Will you continue looking for work in New Jersey?',
      errors: {
        required:
          'Please say whether you will continue looking for work in New Jersey',
      },
    },
    can_begin_work_immediately: {
      label: 'Can you begin full-time work immediately?',
      errors: {
        required: 'Please say whether you can begin full-time work immediately',
      },
    },
    federal_work_in_last_18mo: {
      label:
        'In the last 18 months, have you worked for the federal government (not including military service)?',
      errors: {
        required:
          'Please say whether in the last 18 months, have you worked for the federal government (not including military service)',
      },
    },
  },
  personal: {
    heading: 'Personal information',
    verified_legal_name: { label: 'Legal name' },
  },
  demographics: {
    heading: 'Demographics',
    preamble:
      'We ask for the following information only for our reporting needs. ' +
      "Your answers to these questions won't affect your application or potential payment amount. " +
      'We are working on our systems to support more inclusive options.',
  },
  recent_employers: {
    heading: 'Recent employers',
    preamble:
      'We need the last 18 months of your employment history, including where you are still working, to calculate your unemployment benefit amount. Please confirm our records of your employers below.',
    question:
      'In the last 18 months (since {{date}}), did you work at the following employers?',
    work_at: 'Did you work at {{employer}}',
    confirm_employer:
      'Are you sure? Check your pay stubs or W2 to confirm your employer name.',
    isEmployer: {
      errors: {
        required:
          'Please say whether you were employed by this employer within the last 18 months',
      },
    },
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
      unspecified: 'X (unspecified)',
    },
    errors: {
      required: 'You must select a sex',
    },
  },
  race: {
    label: 'What is your race?',
    options: {
      american_indian_or_alaskan: 'American Indian or Alaskan Native',
      asian: 'Asian',
      black: 'Black or African American',
      hawaiian_or_pacific_islander: 'Native Hawaiian or Other Pacific Islander',
      white: 'White',
      opt_out: 'Choose not to answer',
    },
    errors: {
      required: 'You must select a race',
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
      required: 'You must say whether you are Hispanic or Latino',
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
        required: 'Please say whether you are authorized to work',
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
            none: 'No reason given',
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
        'Please say whether you have worked for any other employers in the last 18 months',
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
        'Please say if this is the phone number of your physical workplace',
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
        'Please say if you worked at the physical location you listed for your employer',
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
      hint: "You can usually find your employer's FEIN on your W2 or other tax documents your employer gives.",
      pattern: 'The FEIN must match the pattern 12-1234567',
    },
    state_employer_payroll_number: {
      label: 'State employer payroll number (optional)',
      hint: 'You can find the state employer payroll number on line 15 of your W2.',
    },
    work_location: {
      section_title: 'Work location',
      worked_at_employer_address: {
        label: 'Did you work in <0>City</0>, <1>State</1> for this employer?',
        required:
          "Please say whether you worked at the employer's address shown above",
      },
      alternate_physical_work_address: {
        city: {
          label: 'Work city',
        },
        state: {
          label: 'Work state',
        },
        zipcode: {
          label: 'Work ZIP',
        },
      },
      is_employer_phone_accurate: {
        label:
          'Was <0>employer phone</0> the phone number of the location where you worked?',
        required: "Please check that the employer's phone number is right",
      },
      work_location_phone: {
        label: 'Work location phone number',
      },
    },
    business_interests: {
      section_title: 'Your business interests',
      self_employed: {
        label: 'Were you self employed at this business?',
        errors: {
          required:
            'You must say whether you are self-employed at this business',
        },
      },
      is_owner: {
        label:
          'Were you, or are you now, the owner or part-owner of this business?',
        errors: {
          required:
            'You must say whether you have/had ownership in this business',
        },
      },
      corporate_officer_or_stock_ownership: {
        label:
          'Are/Were you a corporate officer, or did you own more than 5% interest for this business?',
        errors: {
          required:
            'You must say whether you are a corporate officer or own stock in your company',
        },
      },
      employer_is_sole_proprietorship: {
        label: 'Was this business a sole proprietorship?',
        hint: 'Answer yes if there was only one owner, or if the business would file a Schedule C (Form 1040). Answer no if it was a corporation, which usually has “Inc” in the name.',
        errors: {
          required:
            'You must say whether this business was a sole proprietorship',
        },
      },
      related_to_owner_or_child_of_owner_under_18: {
        label:
          'Are you the spouse, parent, or child of the owner of this business?',
        options: {
          no: {
            label: 'No',
          },
          spouse: {
            label: 'Yes, spouse',
          },
          parent: {
            label: 'Yes, parent',
          },
          child: {
            label: 'Yes, child',
          },
        },
        errors: {
          required:
            'You must say whether you are related to the owner of this business',
        },
      },
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
  disability: {
    heading: 'Disability',
    info_alert: {
      title:
        'For Unemployment Insurance, you are “disabled” if any of the following are true:',
      items: {
        doctor_cert:
          'A medical provider certifies you are unable to work due to a physical/mental health condition, pregnancy, or childbirth recovery',
        tdi: 'You are receiving or have applied for temporary disability payments',
        workers_comp:
          'You are receiving or have applied for workers’ compensation payments',
      },
    },
    disability_applied_to_or_received: {
      label:
        'Since your last day worked, have you applied for or received payments for any of the following?',
      options: {
        disability: 'Disability',
        family_leave: 'Family leave',
        social_security: 'Social Security (SSI/SSDI)',
        none: 'None of the above',
      },
      errors: {
        none_only: "You may not choose another selection if you choose 'none'",
        required: 'You must choose at least one of the options',
      },
    },
    disabled_immediately_before: {
      label:
        'Were you disabled in the last 4 weeks before filling out this application?',
      errors: {
        required: 'You must say whether you were disabled in the last 4 weeks',
      },
    },
    type_of_disability: {
      label: 'What plan do you get your payment from?',
      options: {
        state_plan:
          'State insurance plan (temporary disability or family leave)',
        private_plan: 'Private insurance plan from your employer',
        workers_compensation:
          "Workers' compensation due to being injured on the job",
      },
      errors: {
        required:
          'You must say from which plan you get your disability payment',
      },
    },
    date_disability_began: {
      label: 'Date disability or family leave began',
      errors: {
        required: 'You must give the date disability or family leave began',
        maxDate:
          "Date disability or family leave began can't be after today's date",
      },
    },
    recovery_date: {
      label: 'Recovery/release/end date',
      help_text:
        'If you have not yet recovered, type the current date below and we will request more information from you at a later date by email.',
      errors: {
        required: 'You must give a recovery/release/end date',
        minDate:
          'Recovery/release/end date has to be after the date of disability',
        maxDate: "Recovery/release/end date can't be after today's date",
      },
    },
    contacted_last_employer_after_recovery: {
      label:
        'After recovering, did you contact your last employer for more work?',
      errors: {
        required:
          'You must say if you contacted your employer after recovering',
      },
    },
  },
  education_and_training: {
    heading: 'Your education and training',
    attending_training: {
      label:
        'Are you currently attending school, college, or unpaid job training?',
      required:
        'You must say whether you are currently attending school, college, or job training',
      help_text:
        'If you are in union-required training or paid job training, choose "No."',
    },
    enrollment: {
      label: 'Did you go through a union hiring hall or Career Center?',
      help_text:
        'Career Centers include Vocational Rehabilitation and other <0>New Jersey career services</0>.',
      error: {
        required: 'Select how you enrolled',
      },
    },
    full_time_student: {
      label: 'Have you been a full-time student during the last 18 months?',
      required:
        'You must say whether you have been a full-time student during the last 18 months',
    },
  },
  union: {
    heading: 'Union membership',
    union_name: {
      label: 'Name of your union',
      errors: {
        required: 'You must give the name of your union',
      },
    },
    union_local_number: {
      label: 'Union local number',
      errors: {
        required: 'You must give your union local number',
      },
    },
    required_to_seek_work_through_hiring_hall: {
      label:
        'Are you required to seek work through a union hiring hall (a job placement office operated by your union)?',
      errors: {
        required:
          'You must say whether you are required to seek work through a union hiring hall',
      },
    },
  },
  contact: {
    heading: 'Contact Information',
    claimant_phone: {
      label: 'Phone number',
      errors: {
        matches: 'Please enter a phone number like (555) 555-1234',
        required: 'Phone number is required',
      },
    },
    alternate_phone: {
      label: 'Alternate phone number (optional)',
    },
    sms: {
      label: 'Can we send text messages to this number?',
      help_text: 'Your mobile plan’s message and data rates may apply.',
      errors: {
        required: 'Please say if we can send text messages to this number',
      },
    },
    email: {
      label: 'Email address',
    },
    interpreter_required: {
      label: 'Do you need an interpreter or TTY to communicate with us?',
      options: {
        interpreter: 'Yes, an interpreter',
        tty: 'Yes, TTY',
        no_interpreter_tty: 'No',
      },
      required: 'You must say whether you need an interpreter or TTY',
    },
    preferred_language: {
      label: 'What language do you speak?',
      options: {
        mandarin: '中文 (Mandarin Chinese)',
        spanish: 'Español (Spanish)',
        haitian: 'Kreyòl ayisyen (Haitian Creole)',
        polish: 'Polski (Polish)',
        portuguese: 'Português (Portuguese)',
        russian: 'Русский (Russian)',
        vietnamese: 'Tiếng Việt (Vietnamese)',
        other: 'Other',
      },
      required: 'Please specify the language you speak',
    },
    other_language: 'Enter the language you speak',
  },
  name: {
    legal_name: 'What is your legal name?',
    alternate_name: 'Additional name',
    first_name: {
      label: 'First name',
      required: 'First name is required',
      errors: {
        alphabetical: 'First name must be alphabetical',
      },
    },
    middle_initial: {
      label: 'Middle initial (optional)',
      errors: {
        alphabetical: 'Middle initial must be alphabetical',
        max: 'Middle initial must be at most 1 character',
      },
    },
    last_name: {
      label: 'Last name',
      required: 'Last name is required',
      errors: {
        alphabetical: 'Last name must be alphabetical',
      },
    },
    suffix: {
      label: 'Suffix (optional)',
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
        'You must say if you have worked under a different name in the past 18 months',
    },
  },
  payment: {
    heading: 'Payment information',
    header_description: {
      line1:
        "Once you're approved for benefits, you can have your payments directly deposited into your bank account or loaded onto a prepaid debit card.",
      line2: 'Questions? Please visit our <0>payments information page</0>.',
    },
    federal_income_tax_withheld: {
      header: '<strong>Taxes and deductions</strong>',
      description:
        'Unemployment Insurance payments will be counted as reportable income on your federal taxes. Federal tax withholding will only be made after amounts are deducted and withheld for any unemployment overpayments, child support obligations, or any other amounts that must be deducted and withheld by law.',
      label:
        'Would you like to withhold 10% of your benefits for federal taxes?',
      help_text:
        "If you don't withhold now, you may need to pay them later on when you file your taxes.",
      errors: {
        required: 'Your tax withholding preference is required',
      },
    },
    payment_method: {
      header: '<strong>Benefits payments</strong>',
      label: 'How would you like to receive your benefits payments?',
      direct_deposit_description:
        "Direct deposit can take up to 7 days to take effect, but it's usually faster than the debit card option.",
      debit_card_description:
        'Your debit card will be sent via regular mail in a plain, unmarked envelope. Benefits will be transferred to your debit card within two business days after you claim your benefits.',
      options: {
        debit: 'Prepaid debit card',
        direct_deposit: 'Direct deposit (faster)',
      },
      errors: {
        required: 'Your payment preference is required',
      },
      acknowledge_direct_deposit_option: {
        label:
          'I acknowledge that the New Jersey Division of Unemployment Insurance (UI) offers unemployed workers the option to have their benefits deposited directly into their personal bank accounts. Direct deposit is a convenient, safe, and reliable way to receive your benefits. Funds will normally be available in your account within two full business days from the day you certify for benefits. Before attempting to use those funds, verify with your bank that the deposit cleared your account.',
        errors: {
          required: 'Your acknowledgement is required',
          mustBeTrue:
            'You must acknowledge that you have read and understood the above disclosure',
        },
      },
    },
    apply_for_increased_payment_for_dependents: {
      header: '<strong>Dependency benefits</strong>',
      label:
        'Are you interested in applying for an increased payment based on your dependents?',
      description: {
        line1:
          "You may qualify for an increase to your benefit amount based on your family’s situation. If you are not receiving the max benefit amount, and you are interested in an increased rate for Dependency Benefits, you will need to give proof of the dependents you are claiming along with supporting legal documentation. To be eligible, your spouse/civil union partner can't be employed during the week you start your claim or already be collecting dependency benefits. <0>Read more about eligibility here</0>.",
        line2:
          'If interested, within a few business days you will receive two emails—one explaining who could be eligible for dependency benefits, and a second with a link to an online application where you will be asked to answer a few questions and submit further information.',
      },
      errors: {
        required: 'Your dependency benefits preference is required',
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
      errors: {
        required: 'Routing number is required',
        incorrectLength: 'Routing number must be exactly 9 characters',
        digitsOnly: 'Routing number can only be numbers',
      },
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
      errors: {
        required: 'Account number is required',
        maxLength: 'Account number must be at most 17 digits',
        digitsOnly: 'Account number can only be numbers',
      },
    },
    re_enter_account_number: {
      label: 'Re-enter account number',
      errors: {
        mustMatch: 'Must match account number',
        required: 'Re-enter account number is required',
      },
    },
    routing_and_account_number: {
      label: '<strong>How do I find these numbers?</strong>',
      image_alt:
        'A picture of a check showing where to find the routing and account numbers',
      description: {
        line1:
          'The <strong>routing number</strong> is usually on the bottom-left corner of checks, and is always 9 numbers.',
        line2:
          'The <strong>account number</strong> is usually to the right of the routing number and slightly longer.',
        line3:
          'You may also find your routing and account numbers on your online bank account or mobile app.',
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
        required: 'Please give further details',
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
  complete_claim_error: 'Error completing claim, try again later',
  verified_by_idp: {
    heading: 'The following information has been added to your application:',
    to_edit_visit: 'To edit your information, visit',
    idp_url_text: 'login.gov',
  },
  your_employer: {
    heading: 'Your employer',
    is_full_time: {
      help_text:
        'Full-time means working more (even 1 minute more) than 32 hours a week. Part-time means working exactly 32 hours or less a week.',

      label: 'Was this a full-time or part-time job?',
      options: {
        full_time: 'Full-time',
        part_time: 'Part-time or intermittent',
      },
      required: 'This field is required',
    },
  },
  review: {
    heading: 'Review application',
    preamble: {
      heading: 'Before you submit',
      line1:
        "Be sure that all of your answers are correct. You can't change any of your answers after you click submit below.",
      line2:
        'Remember, the law provides penalties for false statements to obtain benefits.',
      line3:
        'After you click submit, wait for the confirmation information to show to be sure we have received your application.',
    },
    certify: {
      label:
        'I certify that all questions have been answered truthfully. I understand that <0>false and misleading information</0> may result in loss of benefits. In addition, I may be subject to fines and penalties if benefits are improperly paid to me as a result of providing false information.',
      errors: {
        mustBeTrue:
          'You must certify that you have read and understood the above disclosure',
        required: 'Your certification is required',
      },
    },
  },
}

export default claimForm
