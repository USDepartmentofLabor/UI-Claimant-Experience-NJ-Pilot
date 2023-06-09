import {
  OUTSIDE_US_AGENT_NUMBER,
  DISABILITY_BENEFITS_AGENT_NUMBER,
  CLAIMS_AGENT_NUMBER_1,
  CLAIMS_AGENT_NUMBER_2,
  CLAIMS_AGENT_NUMBER_3,
} from 'constants/phoneNumbers'
const redirect = {
  apply_now: 'Go to application',
  title_apply_online: 'Apply for unemployment online',
  title_call_us: 'Call our contact center',
  title_apply_via_phone: 'Apply over the phone',
  title_not_qualified:
    'You don’t qualify for unemployment insurance in New Jersey',
  title_predict_denial:
    'Are you sure you want to apply? Your application will probably be denied.',
  warning_canada: 'Canadian residents need to apply over the phone.',
  warning_disabled:
    'You must be able to work in order to get unemployment insurance.',
  warning_maritime:
    'People who had maritime employment in the last 18 months need to apply over the phone',
  warning_military:
    'People who had military employment in the last 18 months need to apply over the phone.',
  instructions_canada: `<p>Apply for unemployment insurance by calling <OUTSIDE_US_AGENT_NUMBER_LINK>${OUTSIDE_US_AGENT_NUMBER}</OUTSIDE_US_AGENT_NUMBER_LINK>. Canadian residents need to apply over the phone.</p>`,
  instructions_call_within_us: `<p>Apply for unemployment insurance by calling <CLAIMS_AGENT_NUMBER_1_LINK>${CLAIMS_AGENT_NUMBER_1}</CLAIMS_AGENT_NUMBER_1_LINK>, <CLAIMS_AGENT_NUMBER_2_LINK>${CLAIMS_AGENT_NUMBER_2}</CLAIMS_AGENT_NUMBER_2_LINK>, or <CLAIMS_AGENT_NUMBER_3_LINK>${CLAIMS_AGENT_NUMBER_3}</CLAIMS_AGENT_NUMBER_3_LINK>. If you have a non-New Jersey area code call <OUTSIDE_US_AGENT_NUMBER_LINK>${OUTSIDE_US_AGENT_NUMBER}</OUTSIDE_US_AGENT_NUMBER_LINK>.</p>`,
  instructions_disabled: `<p>You answered 'Yes' to the question 'Are you currently disabled and unable to work?' By law, you must be able to work in order to receive unemployment payments.</p><p>You may be eligible for <TEMPORARY_DISABILITY_INSURANCE_LINK>Temporary Disability Benefits</TEMPORARY_DISABILITY_INSURANCE_LINK>. Call <DISABILITY_BENEFITS_AGENT_NUMBER_LINK>${DISABILITY_BENEFITS_AGENT_NUMBER}</DISABILITY_BENEFITS_AGENT_NUMBER_LINK> from 8:00 AM to 3:00 PM for more information.</p><p>If you would still like to apply, you can <APPLY_BUTTON>continue to the application</APPLY_BUTTON>.</p>`,
  call_center_schedule:
    'Our contact center is open from 8:30 AM to 3 PM, Monday through Friday, excluding holidays.',
  call_center_schedule_extended:
    'We recommend calling as close to 8 AM as possible.',
  page_title: 'Let’s try another way',
  legacy: {
    apply_button: 'Go to application',
    plan_time_heading: 'Plan to spend 45 minutes filling out the application',
    plan_time:
      'Plan to complete everything in one sitting so you don’t lose your work.  The standard application doesn’t save your progress as you go.',
    required_info_heading: 'Gather the required information',
    required_info: `To complete your unemployment insurance application, you'll need the following:
    <subhead>Personal information</subhead>
    <ul><li>NJ drivers license, or another government-issued ID</li>
    <li>Social Security Number</li>
    <li>Birthdate</li>
    <li>Contact information</li>
    <li>Citizenship information or Alien Registration Number</li></ul>
    <subhead>Work history for the last 18 months</subhead>
    <ul><li>Employer name(s)</li>
    <li>Employer address(es)</li>
    <li>Employer phone number(s)</li>
    <li>Start and end dates for each job</li>
    <li>A reason why each job ended, or why your hours changed</li>
    <li>Details about other types of payments you receive(d)</li></ul>
    <subhead>Military</subhead>
    <ul><li>If you were in the military in the last 18 months, Form DD-214 Member 4</li></ul>
    <subhead>Federal workers</subhead>
    <ul><li>If you were a federal employee during the last 18 months, Form SF-8 or SF-50</li></ul>
    <subhead>Banking</subhead>
    <ul><li>If you'd like to get your payments by direct deposit, your bank’s routing number and your account number</li></ul>`,
  },
  non_resident: {
    warning:
      'You must live in the U.S. or Canada to apply for unemployment insurance from New Jersey.',
    instructions:
      'You cannot apply for unemployment insurance from New Jersey if you outside the United States (including Puerto Rico and the U.S. Virgin Islands) or Canada.',
  },
  other_state: {
    warning:
      'You must have worked in New Jersey within the last 18 months to file an unemployment insurance claim in New Jersey.',
    instructions:
      '<p>You may be eligible to receive unemployment insurance benefits from another state. Learn how to file in your state at <DOL_LINK>dol.gov</DOL_LINK>.</p>',
  },
  military_mvp: {
    heading: 'Use our standard web form',
    label: {
      line1:
        'We are continuously improving our new form experience, but it does not yet support military workers. Please use our standard web form to continue your application.',
      button: 'Continue',
    },
  },
}

export default redirect
