const screener = {
  pagination: {
    previous: 'Back',
    next: 'Next',
    next_step: 'Next: {{stepName}}',
    save_and_exit: 'Save and exit',
    complete: 'Complete',
  },
  heading: 'Before we get started',
  screener_current_country_us: {
    label:
      'Do you currently live in the United States (including Puerto Rico and the US Virgin Islands)?',
    errors: {
      required:
        'Please say whether you currently live in the United States (including Puerto Rico and the US Virgin Islands)',
    },
  },
  screener_live_in_canada: {
    label: 'Do you currently live in Canada?',
    errors: {
      required: 'Please say whether you currently live in Canada',
    },
  },
  screener_job_last_eighteen_months: {
    label: 'Have you had a job in the last 18 months?',
    errors: {
      military_id_wage_data:
        'Are you sure? We have 1 employer who has listed you as an employee in the last 18 months',
      military_id_wage_data_plural:
        'Are you sure? We have {{count}} employers who have listed you as an employee in the last 18 months',
      required:
        'Please say whether you had a job in the last 18 months, including military service',
    },
  },
  screener_military_service_eighteen_months: {
    label: 'In that time, did you serve in the United States military?',
    errors: {
      job_conflict:
        'If you served in the military, please change your answer above to say that you did have a job',
      required:
        'Please say whether you served in the United States military in the last 18 months',
    },
  },
  screener_work_nj: {
    label:
      'Where did you perform your work (not including federal or military service)?',
    options: {
      nj: 'Only in New Jersey',
      other: 'Only in other states',
      both: 'In both New Jersey and other states',
    },
    errors: {
      required: 'Please say where you performed your work',
    },
  },
  screener_currently_disabled: {
    label: 'Are you currently disabled and unable to work?',
    errors: {
      required:
        'Please say whether you are currently disabled and unable to work',
    },
  },
  screener_federal_work_in_last_eighteen_months: {
    label:
      'In the last 18 months, have you worked for the federal government (not including military service)?',
    errors: {
      required:
        'Please say whether in the last 18 months, have you worked for the federal government (not including military service)',
    },
  },
  screener_maritime_employer_eighteen_months: {
    label:
      'Have you worked for a maritime employer in the last 18 months (for example, did you work on a ship or in a harbor)?',
    errors: {
      required:
        'Please say whether you worked for a maritime employer in the last 18 months (for example, did you work on a ship or in a harbor)',
    },
  },
}

export default screener
