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
        'Please indicate whether you currently live in the United States (including Puerto Rico and the US Virgin Islands)',
    },
  },
  screener_live_in_canada: {
    label: 'Do you currently live in Canada?',
    errors: {
      required: 'Please indicate whether you currently live in Canada',
    },
  },
  screener_military_service_eighteen_months: {
    label:
      'Have you served in the United States military in the last 18 months?',
    errors: {
      required:
        'Please indicate whether you served in the United States military in the last 18 months',
    },
  },
  screener_job_last_eighteen_months: {
    label:
      'Have you had a job in the last 18 months, including military service?',
    errors: {
      military_conflict:
        'If you served in the military, select yes. If you did not, please change your answer above.',
      military_id_wage_data:
        'Are you sure? We have 1 employer who has listed you as an employee in the last 18 months.',
      military_id_wage_data_plural:
        'Are you sure? We have {{count}} employers who have listed you as an employee in the last 18 months.',
      required:
        'Please indicate whether you had a job in the last 18 months, including military service?',
    },
  },
  screener_all_work_nj: {
    label:
      'Was <strong>all</strong> your work (not including military service) performed in New Jersey?',
    errors: {
      required:
        'Please indicate whether all of your work (not including military service) was performed in New Jersey',
    },
  },
  screener_any_work_nj: {
    label:
      'Was <strong>any</strong> of your work (not including military service) performed in New Jersey?',
    errors: {
      required:
        'Please indicate whether any of your work (not including military service) was performed outside New Jersey',
    },
  },
  screener_currently_disabled: {
    label: 'Are you currently disabled and unable to work?',
    errors: {
      required:
        'Please indicate whether you are currently disabled and unable to work',
    },
  },
  screener_maritime_employer_eighteen_months: {
    label:
      'Have you worked for a maritime employer in the last 18 months (for example, did you work on a ship or in a harbor)?',
    errors: {
      required:
        'Please indicate whether you worked for a maritime employer in the last 18 months (for example, did you work on a ship or in a harbor)',
    },
  },
}

export default screener