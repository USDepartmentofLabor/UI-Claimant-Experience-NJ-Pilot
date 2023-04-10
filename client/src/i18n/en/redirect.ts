import {
  OUTSIDE_US_AGENT_NUMBER,
  DISABILITY_BENEFITS_AGENT_NUMBER,
  CLAIMS_AGENT_NUMBER_1,
  CLAIMS_AGENT_NUMBER_2,
  CLAIMS_AGENT_NUMBER_3,
} from 'constants/phoneNumbers'
const redirect = {
  title_call_us: 'Call our contact center',
  title_apply_via_phone: 'Apply over the phone',
  warning_canada: 'Canadian residents need to apply over the phone.',
  warning_maritime:
    'People who had maritime employment in the last 18 months need to apply over the phone',
  instructions_canada: `<p>Apply for unemployment insurance by calling <OUTSIDE_US_AGENT_NUMBER_LINK>${OUTSIDE_US_AGENT_NUMBER}</OUTSIDE_US_AGENT_NUMBER_LINK>. Canadian residents need to apply over the phone.</p>`,
  instructions_call_within_us: `<p>Apply for unemployment insurance by calling <CLAIMS_AGENT_NUMBER_1_LINK>${CLAIMS_AGENT_NUMBER_1}</CLAIMS_AGENT_NUMBER_1_LINK>, <CLAIMS_AGENT_NUMBER_2_LINK>${CLAIMS_AGENT_NUMBER_2}</CLAIMS_AGENT_NUMBER_2_LINK>, or <CLAIMS_AGENT_NUMBER_3_LINK>${CLAIMS_AGENT_NUMBER_3}</CLAIMS_AGENT_NUMBER_3_LINK>. If you have a non-New Jersey area code call <OUTSIDE_US_AGENT_NUMBER_LINK>${OUTSIDE_US_AGENT_NUMBER}</OUTSIDE_US_AGENT_NUMBER_LINK>.</p>`,
  call_center_schedule:
    'Our contact center is open from 8:30 AM to 3 PM, Monday through Friday, excluding holidays. We recommend calling as close to 8 AM as possible.',
  page_title: 'Let’s try another way',
  info_alert: {
    title: 'You cannot use our new form due to the following reasons:',
    items: {
      ip_deny: 'You must be in the U.S. to file. ',
      non_resident: 'You do not reside in the U.S. or Canada. ',
      other_state:
        'You have not worked in New Jersey within the last 18 months. ',
      military_mvp:
        "Because you said you had military employment, you'll need to apply with our standard form. ",
      military_ip:
        "Because you said you had military employment, you'll need to apply with an agent. ",
      disability: 'You might need to file for disability instead. ',
      federal:
        'Because you said you had federal employment, you’ll need to use our standard form. ',
    },
  },
  read_more: 'Read more.',
  ip_deny: {
    heading: 'You must be in the U.S. to file',
    label:
      'Your access to the New Jersey Unemployment Insurance System is denied since it originated from a location outside of the United States.',
  },
  non_resident: {
    heading: 'You must reside in the U.S. or Canada to file',
    label:
      'Your application could not be processed because you do not currently reside within the United States (including Puerto Rico and the US Virgin Islands) or Canada.',
  },
  other_state: {
    heading: 'File in another state',
    label:
      'In order to file an Unemployment Insurance claim in New Jersey you must have worked in New Jersey within the last 18 months. You may be eligible to receive Unemployment Insurance benefits from another state in which you worked.',
    button: 'File in your state',
  },
  military_mvp: {
    heading: 'Use our standard web form',
    label: {
      line1:
        'We are continuously improving our new form experience, but it does not yet support military workers. Please use our standard web form to continue your application.',
      button: 'Continue',
    },
  },
  military_ip: {
    heading: 'Apply with an agent (military)',
    label: {
      line1:
        'Applicants who have served in the United States military within the past 18 months are required to be in New Jersey when filing their claim for Unemployment Insurance benefits. The IP address from which you are attempting to file is not identifiable as a New Jersey IP address.',
      line2:
        'If you choose to continue with your application your claim will be based only on New Jersey wages and any military earnings will not be considered when determining your eligible benefit amount. <0>Continue without claiming military wages, only non-military NJ wages</0>.',
      line3:
        'If you would like your military wages to be considered when determining your eligible benefit amount, please try back from a New Jersey IP address or call from New Jersey using a New Jersey area code. In order to continue filing your current application, please contact a Claims Agent at <0>732-761-2020</0>, <1>201-601-4100</1>, or <2>856-507-2340.</2>',
    },
  },
  disability: {
    heading: 'File for temporary disability benefits',
    label: {
      line1:
        "You answered 'Yes' to the question 'Are you currently disabled and unable to work?' By law, unemployment benefits are only payable if you are able to work. Instead, please file a claim for Temporary Disability Benefits.",
      line2: `Click the button below or call <0>${DISABILITY_BENEFITS_AGENT_NUMBER}</0> during our normal business hours from 8:30 AM to 4:30 PM for more information.`,
      button: 'File a claim',
    },
  },
  federal: {
    heading: 'Use our standard web form',
    label: {
      line1:
        'We are continuously improving our new form experience, but it does not yet support federal workers. Please use our standard web form to continue your application.',
      button: 'Continue',
    },
  },
  agent_contact: {
    label: {
      line1:
        'Claims Agents should be contacted during our normal business hours from 8:30 AM to 4:30 PM, Monday through Friday, excluding holidays. ',
    },
  },
}

export default redirect
