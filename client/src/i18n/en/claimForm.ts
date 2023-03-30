const claimForm = {
  step_progress: 'step {{step}} of {{totalSteps}}',
  pagination: {
    previous: 'Back',
    next: 'Next',
    next_step: 'Next: {{stepName}}',
    save_and_exit: 'Save and exit',
    save_notice:
      'Answers are automatically saved when you complete a page and click "Next".',
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
    residence_address: {
      label: 'Residence address',
    },
    mailing_address: {
      label: 'Mailing address',
    },
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
    no_employers_on_record:
      'We do not have recent employers on file for you. We need the last 18 months of your employment history, including where you are still working, to calculate your unemployment benefit amount. Please manually add employment history to your application on the next page.',
    question:
      'In the last 18 months (since {{date}}), did you work at the following employers?',
    work_at: 'Did you work at {{employer}}',
    confirm_employer:
      'Are you sure? Check your pay stubs or W2 to confirm your employer name.',
    employer_retrieval_warning: {
      heading: 'Unable to look up employers',
      header_description:
        'We are unable to look up your employment records at this time. Please check here later, or manually add your employers now.',
    },
    worked_for_imported_employer_in_last_18mo: {
      errors: {
        required:
          'Please say whether you were employed by this employer within the last 18 months',
      },
    },
  },
  review_employers: {
    heading: 'Review employers',
    preamble: {
      default:
        'You\'ve added the following employers.  If you had any other employers in the last 18 months, click "Add employer" below.',
      had_work:
        "You said you had a job in the last 18 months. If that's correct, add an employer below. If you did not have a job, please go back and change your answer on <0>the first page</0>.",
      no_work:
        'You said you did not have a job in the last 18 months.  If that\'s correct, click "next" below. If you did have a job, please go back and change your answer on <0>the first page</0>.',
    },
    add_employer: 'Add employer',
    edit_employer: {
      edit_details: 'Edit details',
      label: 'Edit details for {{employer}}',
      delete: 'Delete',
      delete_label: 'Delete employer {{employer}}',
    },
    add: 'Add',
    save: 'Save',
  },
  identity: {
    heading: 'Identity information',
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
      unspecified: 'Unspecified (X)',
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
      high_school_credential_certification:
        'High School + Credential/Certification',
      associates: "Associate's Degree",
      some_college: 'Some College',
      bachelors: "Bachelor's Degree",
      some_graduate: 'Some Graduate School',
      masters: "Master's Degree",
      doctorate: 'Doctoral Degree',
    },
    errors: { required: 'Education level must be selected' },
  },
  work_authorization: {
    authorization_type: {
      label: 'Are you legally allowed to work in the United States?',
      options: {
        US_citizen_or_national: 'Yes; I am a U.S. citizen/national',
        permanent_resident: 'Yes; I am a permanent resident',
        H1B_visa: 'Yes; I have an H1B visa',
        employment_authorization_or_card_or_doc:
          'Yes; I have an employment authorization card/document',
        not_legally_allowed_to_work_in_US:
          'No; I am not legally allowed to work in the United States',
      },
      errors: {
        required: 'You must select an authorization status',
      },
    },
    employment_authorization_document_name: {
      section_title:
        'Enter the following information as it appears on your alien registration card',
    },
    alien_registration_number: {
      label: 'USCIS / Alien registration number',
      hint: '<0>Need help finding it?</0> This is a 7-9 digit number, sometimes starting with “A”',
      modal: {
        heading:
          'You are navigating to immigrationhelp.org, a website not managed by the State of New Jersey.',
      },
      errors: {
        format:
          'Please enter a valid USCIS / Alien registration number with only numbers and a length of 7-9',
        required: 'USCIS / Alien registration number is required',
      },
    },
    re_enter_alien_registration_number: {
      label: 'Re-enter USCIS / Alien registration number',
      errors: {
        mustMatch: 'Must match USCIS / Alien registration number',
        required: 'Re-enter USCIS / Alien registration number is required',
      },
    },
    country_of_origin: {
      label: 'Country of origin',
      errors: {
        required: 'Country of origin is required',
      },
    },
    employment_authorization_start_date: {
      label: 'Valid from / issued on',
      errors: {
        required: 'Valid from / issued on date is required',
        maxDate: "Valid from / issued on date can't be in the future",
      },
    },
    employment_authorization_end_date: {
      label: 'Expiration date',
      errors: {
        required: 'Expiration date is required',
        minDate: "Expiration date can't be before valid from / issued on date",
      },
    },
  },
  has_nj_issued_id: {
    label: 'Do you have a New Jersey driver’s license or state ID?',
    errors: {
      required:
        'Please say whether you have a New Jersey driver’s license or state ID',
    },
  },
  drivers_license_or_state_id_number: {
    label: 'Driver’s license or state ID number',
    errors: {
      required: 'Driver’s license or state ID number is required',
      matches:
        'Please enter a driver’s license or state ID number like D12345678901234',
    },
  },
  employers: {
    preamble:
      'We need the last 18 months of your employment history, including where you are still working, to calculate your unemployment benefit amount.',
    verified_fields: {
      employer_name: 'Employer name',
      employer_address: 'Address',
      employer_phone: 'Phone number',
      fein: 'FEIN',
    },
    separation: {
      heading: 'Change in employment',
      info_alert: {
        description:
          'If you were treated unfairly, harassed, or discriminated against on the job, please also visit the <0>EEOC website</0> for help.',
        website: 'https://www.eeoc.gov/youth/filing-complaint',
      },
      reason: {
        label: 'Why did your job end or your hours change?',
        required: 'Change in employment reason is required',
      },
      option: {
        required: 'Please select a separation option',
      },
      separation_circumstance_details: {
        required_label: 'Please share more details below',
        optional_label: 'Please share more details below <i>(optional)</i>',
        errors: {
          max_length:
            'Your separation circumstance details must be at most 255 characters',
          required: 'More detail about the separation reason is required',
        },
      },
      expect_to_be_recalled: {
        label: 'Do you expect to be recalled by this employer?',
        errors: {
          required: 'You must say whether you expect to be recalled',
        },
      },
      definite_recall: {
        label: 'Do you have a definite date of recall?',
        errors: {
          required: 'You must say whether you have a definite date of recall',
          minDate: 'The date of recall must be after you last day of work',
        },
      },
      definite_recall_date: {
        label: 'Definite date of recall',
        errors: {
          required: 'You must provide the definite recall date',
          minDate: 'Recall date must be after last day of employment',
        },
      },
      is_seasonal_work: {
        label: 'Is your work seasonal?',
        errors: {
          required: 'You must say whether your work was seasonal',
        },
      },
      reasons: {
        laid_off: {
          label: 'Laid off',
          description:
            'Your job ended due to your work location closing or moving, lack of work, downsizing, reorganization, or your contract ending.',
          option_heading: 'What was the reason you were laid off?',
          options: {
            lack_of_work: 'Lack of work, including seasonal',
            finished_job: 'Finished job/position or contract ended',
            position_eliminated: 'Position eliminated/downsizing',
            business_closed: 'Business closed or moved out of area',
          },
        },
        fired_discharged_suspended: {
          label: 'Fired, discharged, or suspended',
          description:
            'This employer ended your job, suspended you, or forced you to resign for a reason other than lack of work or assignment ending.',
          option_heading:
            'What was the reason you were fired, discharged, or suspended?',
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
            "You're still working for this employer, but you may have fewer hours or be on a leave/break.",
          option_heading: 'Explain the reason you are still employed',
          options: {
            reduction_in_hours_by_employer: 'Hours reduced by employer',
            reduction_in_hours_by_claimant: 'Hours reduced by me',
            hours_not_reduced_at_this_employer:
              'My hours were not reduced at this employer',
            leave_of_absence: 'On a leave of absence',
            paid_vacation_holiday_or_pto: 'On a paid vacation, holiday or PTO',
            temp_lay_off_or_furlough: 'On a temporary lay off or furloughed',
            seasonal_work: 'Seasonal work, but currently not working',
            school_employee_on_break: 'School employee on a break or holiday',
            self_employed: 'Self-employed with this employer',
            shared_work_program: 'Shared Work Program',
          },
          errors: {
            required: 'You must select a reason for why you are still employed',
          },
        },
        quit_or_retired: {
          label: 'Quit, resigned, or retired',
          description:
            'You left your job entirely by your own decision (this does not include forced resignation)',
          option_heading: 'Why did you quit your job?',
          options: {
            personal: 'Personal',
            health: 'Health',
            general: 'General',
            quit_job: 'Quit for another job',
            quit_terminated: 'Quit instead of being terminated',
          },
        },
        strike_or_lock_out_by_employer: {
          label: 'Strike or lock out by employer',
          description:
            'During a labor dispute, you chose to stop work or this employer stopped work.',
          // unconventional to have a null translation but it's because we leverage this file also for TS types
          option_heading: null,
        },
        unsatisfactory_work_performance: {
          label: 'Unsatisfactory work performance',
          description:
            'This employer ended your job due to performance, such as not meeting a quota',
        },
        federal_or_state_shutdown: {
          label: 'Strike or lock out by employer',
          description:
            'During a labor dispute, you decided to stop work or this employer stopped work.',
          option_heading: null,
        },
      },
    },
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
    employment_start_date: {
      label: 'Start date for this employer',
      errors: {
        required: 'Start date is required',
        maxDate: "Start date can't be in the future",
      },
    },
    employment_last_date: {
      label: 'Last day of work for this employer',
      hint: 'If still employed, put the last day you physically worked at this employer',
      errors: {
        required: 'Last day of work is required',
        maxDate: "Last day of work can't be in the future",
        minDate: "Last day can't be before employment start date",
      },
      warning:
        'If this job ended more than 18 months ago, it will not be used for your unemployment application.',
    },
    discharge_date: {
      label: 'What was your discharge date?',
      errors: {
        date_format: 'Discharge date',
        required: 'Discharge date is required',
        maxDate: "Discharge date can't be in the future",
        minDate: 'Discharge date must be on or after employment end date',
      },
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
    your_employer: {
      heading: 'Your employer',
      employer_name: {
        label: 'Employer name',
        hint: 'You can usually find the employer or business name on your paystub or W2.',
        errors: {
          required: 'You must give the name of your employer',
          maxLength:
            'Please shorten your employer’s name to 40 characters or less (including spaces). For example you may say “DOL” instead of “Department of Labor”, or “Intl” instead of “International”',
        },
      },
      fein: {
        label: 'FEIN, or Federal Employer Identification Number (optional)',
        hint: 'You can usually find your employer’s FEIN on your W2 or other tax documents your employer gave you.',
        errors: {
          digitsOnly: 'FEIN can only be numbers',
          maxLength: 'Your FEIN must be at most 15 characters',
        },
      },
      state_employer_payroll_number: {
        label: 'State payroll number (optional)',
        review_label: 'State payroll number',
        hint: 'You can find this on your NJ state employee paystubs.',
        errors: {
          digitsOnly: 'Your state payroll number must numbers only',
          incorrectLength: 'Your state payroll number must be 7 digits',
        },
      },
      employer_address: {
        address: { label: 'Employer street address 1' },
        address2: { label: 'Employer street address 2 (optional)' },
        address3: { label: 'Employer street address 3 (optional)' },
        city: { label: 'City' },
        state: { label: 'State' },
        zipcode: { label: 'ZIP' },
      },
      employer_phone: {
        label: 'Employer phone number (optional)',
      },
      is_full_time: {
        help_text:
          'Full-time means working more (even 1 minute more) than 32 hours a week. Part-time means working exactly 32 hours or less a week.',

        label: 'Was this a full-time or part-time job?',
        options: {
          full_time: 'Full-time',
          part_time: 'Part-time or intermittent',
        },
        errors: {
          required:
            'You must say whether this was a full-time or part-time job',
        },
      },
    },
    work_location: {
      section_title: 'Work location',
      worked_at_employer_address: {
        label: 'Did you work in <0>City</0>, <1>State</1> for this employer?',
        placeholder:
          'Did you work in the above city and state for this employer?',
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
        label: 'Work location phone number (optional)',
      },
    },
    hours_reduced_twenty_percent: {
      label: 'Did this employer reduce your hours by 20% or more?',
      hint: 'For example, if this employer reduced your hours from 40 hours per week to 32 hours, you would choose "yes."',
      errors: {
        required: 'You must say whether your hours were reduced by 20% or more',
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
        hint: 'A sole proprietor has only one owner. Answer "No" if this employer is a corporation, which usually has “Inc” in the name.',
        options: {
          yes: 'Yes',
          no: 'No',
          not_sure: "I'm not sure",
        },
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
    payments_received: {
      heading: 'Payments from this employer',
      payments_received_detail: {
        pay_type: {
          label:
            'Have you received any payments from this employer since your last day of work?',
          errors: {
            required: 'At least one option must be selected',
            none_and:
              'Please check whether you have not received any other pay',
          },
          options: {
            vacation_sick_pto: {
              label: 'Vacation, sick, or PTO pay',
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
                "Payment you received from this employer's retirement plan or the union affiliated with this employer. This does not include any loans you took from them.",
            },
            severance: {
              label: 'Severance pay',
              description:
                'Pay you received due to policy, contract, or other note about your job ending',
            },
            continuation: {
              label: 'Continuation pay',
              description:
                'Pay you received without performing work for the time after your last day of work through the end of the employment date given by your employer',
            },
            payment_in_lieu_of_notice: {
              label: 'Payment in lieu of notice',
              description:
                'Pay you received specifically if your company was required to give you advance notice of your job ending',
            },
            holiday: {
              label: 'Holiday pay',
              description: 'Pay you received specifically for holidays',
            },
            other_pay: {
              label: 'Other type of pay',
              description: '',
            },
            none: {
              label: 'I have not received any other pay',
              description: '',
              ariaDescription:
                'Selecting this disables all other pay options. Uncheck to re-enable the other options.',
            },
          },
        },
        total: {
          label: 'Total of this pay',
          reviewLabel: 'Total of {{payType}}',
          description: {
            vacation_sick_pto:
              'Pay you received for approved time off or a pay out of unused time off',
            final_paycheck:
              'Pay you received for hours you worked before your last day of work',
            pension_annuity_retirement:
              "Payment you received from this employer's retirement plan or the union affiliated with this employer. This does not include any loans you took from them.",
            severance_or_continuation:
              'Payment due to separation based on your contract, by law, or as a gift',
          },
          currencyPrefix: '$',
          errors: {
            required: 'Total pay is required, in dollars',
            min: 'Total pay must be greater than 0',
            number:
              'Total must be a number in dollars or cents, like 150, or 150.75',
          },
        },
        dates_hint: {
          label: {
            default:
              'If the payment covers a set period of time, for example the next two weeks, enter the start date and end date that period covers. If you are not sure or it does not have a set timeframe, put your last day of work for both start and end date.',
            holiday:
              'What was the time period on the paycheck including this pay? If you are not sure or it does not have a set timeframe, put your last day of work for both start and end date.',
          },
        },
        date_pay_began: {
          label: 'Start date of this pay',
          reviewLabel: 'Start date of {{payType}}',
          errors: {
            required: 'Start date is required',
            max: 'Date must be today or in the past',
          },
        },
        date_pay_ended: {
          label: 'End date of this pay',
          reviewLabel: 'End date of {{payType}}',
          errors: {
            required: 'End date is required',
            max: 'Date must be today or in the past',
            min: 'Date must be the same or after the start date of this pay',
          },
        },
        other_note: {
          label: 'Please explain what type of pay you received',
          reviewLabel: 'Please explain what type of other pay you received',
          errors: {
            required: 'Please give further details',
            maxLength:
              'Your other type of pay details must be at most 1024 characters',
          },
        },
      },
    },
  },
  occupation: {
    heading: 'Occupation information',
    search: 'Search',
    choose_the_occupation:
      'If you have multiple occupations, choose your main one or the one you’re most comfortable with. We use your answer for your <0>reemployment profile</0> and for statistical purposes.',
    reemployment_profile_link:
      'https://www.dol.gov/agencies/eta/american-job-centers/worker-profiling-remployment-services',
    job_title: {
      label: 'What is your main occupation?',
      errors: {
        required: 'Occupation is required',
      },
      min_length: 'Occupation must be at least three characters',
    },
    hint: "If you're not sure, see our",
    list_of_occupations: 'list of occupations',
    job_description: {
      label: 'Give a short description of your main occupation:',
      errors: {
        required: 'Job description is required',
        maxLength:
          'Please shorten your occupation description to 255 characters or less (including spaces).',
      },
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
    training_through_hiring_hall_or_career_center: {
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
        maxLength: 'Union name must be at most 32 characters',
      },
    },
    union_local_number: {
      label: 'Union local number',
      errors: {
        digitsOnly: 'Union number can only be numbers',
        required: 'You must give your union local number',
        maxLength: 'Union local number must be at most 16 characters',
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
    heading: 'Contact information',
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
      errors: {
        required: 'You must say whether you need an interpreter or TTY',
      },
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
      errors: {
        required: 'Please specify the language you speak',
        maxLength: 'Preferred language must be at most 32 characters',
      },
    },
    other_language: 'Enter the language you speak',
  },
  name: {
    legal_name: 'What is your legal name?',
    alternate_name: 'Additional name',
    first_name: {
      label: 'First name',
      errors: {
        required: 'First name is required',
        alphabetical:
          "Sorry, we can't currently accept accent marks, numbers, or non-English characters. Please type your first name with only the letters A-Z.",
        maxLength: 'First name must be at most 36 characters',
      },
    },
    middle_initial: {
      label: 'Middle initial (optional)',
      errors: {
        alphabetical:
          "Sorry, we can't currently accept accent marks, numbers, or non-English characters. Please type your middle initial with only the letters A-Z.",
        maxLength: 'Middle initial must be at most 1 character',
      },
    },
    last_name: {
      label: 'Last name',
      errors: {
        required: 'Last name is required',
        alphabetical:
          "Sorry, we can't currently accept accent marks, numbers, or non-English characters. Please type your last name with only the letters A-Z.",
        maxLength: 'Last name must be at most 36 characters',
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
  edit_employer: {
    heading: 'Edit employer',
  },
  payment: {
    heading: 'Payment information',
    header_description: {
      line1:
        "Once you're approved for benefits, you can have your payments directly deposited into your bank account or loaded onto a prepaid debit card.",
      line2: 'Questions? Please visit our <0>payments information page</0>',
    },
    federal_income_tax_withheld: {
      header: 'Taxes and deductions',
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
      header: 'Benefits payments',
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
      header: 'Dependency benefits',
      label:
        'Are you interested in applying for an increased payment based on your dependents?',
      description: {
        line1:
          "You may qualify for an increase to your benefit amount based on your family’s situation. If you are not receiving the max benefit amount, and you are interested in an increased rate for Dependency Benefits, you will need to give proof of the dependents you are claiming along with supporting legal documentation. To be eligible, your spouse/civil union partner can't be employed during the week you start your claim or already be collecting dependency benefits. <0>Read more about eligibility here</0>",
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
      label: 'How do I find these numbers?',
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
    section: {
      accessible_name: 'Review {{ name }}',
    },
    edit: {
      accessible_name: 'Edit {{ name }}',
      label: 'Edit',
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
  success: {
    heading: 'We’re reviewing your application',
    alert_heading: 'Application submitted',
    success_details:
      'We received your application and are reviewing it to make sure you’re eligible for  payments.',
    id_verification_heading: 'Verify your identity on ID.me',
    id_verification_instructions:
      'After submitting your application, go to ID.me and <IdMeProcessLink>verify your identity</IdMeProcessLink>. This helps us to make sure payments go to the right person.',
    id_verification_requirements_lead: 'To verify your identity, you need:',
    id_verification_requirement_gov_id:
      'Your <IdMeDocTypesLink>government-issued ID</IdMeDocTypesLink>',
    id_verification_requirement_id_copy:
      'A smartphone or computer with a camera to take and upload a photo of your ID',
    id_verification_requirement_ssn: 'Your Social Security Number',
    id_verification_requirement_sms:
      'A phone number where you can receive text messages',
    id_verification_requirement_email: 'An email address',
    id_verification_closing:
      'When verifying with ID.me, use the same email you used to apply for unemployment ({{email}}).',
    id_verification_button: 'Verify my identity',
    expectations_heading: 'What to expect',
    expect_comms_heading: 'Follow-up communication',
    expect_comms:
      'If we need more information from you we will email you or send you a letter in the mail. <strong>You must complete the forms or respond in a timely manner to receive payments. If you don’t respond, you may lose benefits.</strong>',
    expect_certifying_heading: 'Certify your eligibility every week',
    expect_certifying: `<p>Each week that you’re unemployed you need to <HowToCertifyLink>answer some questions in order to receive your unemployment insurance payments</HowToCertifyLink> for that week.</p>
      <p>If your application is approved, you should start getting payments every week that you certify and remain eligible.</p>
      <p><strong>Important: If you try to certify your eligibility and get an error saying your claim has expired, you may still have to complete your ID.me verification.</strong></p>`,
    expect_certifying_button: 'Certify my eligibility',
    privacy_heading: 'Data privacy and security',
    privacy_statement: `<p>The information collected from your application for unemployment compensation is private data and cannot be released except when authorized by state or federal law, by a court order, or with your permission. The information you and/or your employer(s) provide may be used for New Jersey Department of Labor and Workforce Development purposes and may be used to provide income and eligibility verification between State Agencies administering programs under a plan approved under Title I, X, XIV, XVI as contained in Section 1137 (a)(6) of the Social Security Act. It may be shared with other state and/or federal agencies that determine eligibility for Medicaid, Food Stamps, Social Security, or other state and/or federal benefits and programs. Your Social Security Number will be validated with the Social Security Administration. If you are not a citizen of the United States, your work authorization in the United States will be verified with the Department of Homeland Security.</p>
      <p>Precautions have been taken to ensure that the information provided by you in this application are kept private and secure. This online application uses a secure connection. Data submitted using this application is encrypted. You should be aware that by using a shared computer, others may be able to view your personal information.</p>`,
  },
}

export default claimForm
