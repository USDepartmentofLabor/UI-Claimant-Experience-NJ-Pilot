/* eslint-disable @typescript-eslint/no-empty-function */
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import ScreenerRedirect from 'pages/screener-redirect'
import { ScreenerInput } from 'types/claimantInput'
import { StoryFn } from '@storybook/react'

const defaultScreenerArgs: ScreenerInput = {
  screener_current_country_us: true,
  screener_live_in_canada: false,
  screener_job_last_eighteen_months: true,
  screener_work_nj: 'nj',
  screener_military_service_eighteen_months: false,
  screener_currently_disabled: false,
  screener_federal_work_in_last_eighteen_months: false,
  screener_maritime_employer_eighteen_months: false,
}

const screenerArgs: {
  [field in keyof ScreenerInput]: {
    name: string
    type: string
    defaultValue?: unknown
    options?: string[]
  }
} = {
  screener_current_country_us: {
    name: 'In U.S.',
    type: 'boolean',
    defaultValue: defaultScreenerArgs['screener_current_country_us'],
  },
  screener_live_in_canada: {
    name: 'In Canada',
    type: 'boolean',
    defaultValue: defaultScreenerArgs['screener_live_in_canada'],
  },
  screener_job_last_eighteen_months: {
    name: 'Job last 18 months',
    type: 'boolean',
    defaultValue: defaultScreenerArgs['screener_job_last_eighteen_months'],
  },
  screener_work_nj: {
    name: 'States',
    type: 'radio',
    options: ['nj', 'other', 'both'],
    defaultValue: defaultScreenerArgs['screener_work_nj'],
  },
  screener_military_service_eighteen_months: {
    name: 'Military service',
    type: 'boolean',
    defaultValue:
      defaultScreenerArgs['screener_military_service_eighteen_months'],
  },
  screener_currently_disabled: {
    name: 'Disabled',
    type: 'boolean',
    defaultValue: defaultScreenerArgs['screener_currently_disabled'],
  },
  screener_federal_work_in_last_eighteen_months: {
    name: 'Federal work',
    type: 'boolean',
    defaultValue:
      defaultScreenerArgs['screener_federal_work_in_last_eighteen_months'],
  },
  screener_maritime_employer_eighteen_months: {
    name: 'Maritime employer',
    type: 'boolean',
    defaultValue:
      defaultScreenerArgs['screener_maritime_employer_eighteen_months'],
  },
}

export default {
  title: 'Pages/Directional page',
  argTypes: {
    ...screenerArgs,
  },
}

const Template: StoryFn<ScreenerInput> = (args) => {
  return (
    <IntakeAppContext.Provider
      value={{
        screenerInput: args,
        setScreenerInput: () => {},
        setSsn: () => {},
      }}
    >
      <ScreenerRedirect />
    </IntakeAppContext.Provider>
  )
}

export const InCanada = Template.bind({})
InCanada.args = {
  ...defaultScreenerArgs,
  screener_current_country_us: false,
  screener_live_in_canada: true,
}

export const OutsideCanadaAndUS = Template.bind({})
OutsideCanadaAndUS.args = {
  ...defaultScreenerArgs,
  screener_current_country_us: false,
  screener_live_in_canada: false,
}

export const Maritime = Template.bind({})
Maritime.args = {
  ...defaultScreenerArgs,
  screener_maritime_employer_eighteen_months: true,
}

export const Military = Template.bind({})
Military.args = {
  ...defaultScreenerArgs,
  screener_military_service_eighteen_months: true,
}

export const Federal = Template.bind({})
Federal.args = {
  ...defaultScreenerArgs,
  screener_federal_work_in_last_eighteen_months: true,
}

export const Disabled = Template.bind({})
Disabled.args = {
  ...defaultScreenerArgs,
  screener_currently_disabled: true,
}
