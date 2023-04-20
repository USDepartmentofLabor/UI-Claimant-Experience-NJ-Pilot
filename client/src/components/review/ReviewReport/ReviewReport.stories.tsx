import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ReviewReport } from './ReviewReport'

export default {
  title: 'Components/Review HTML',
  component: ReviewReport,
} as ComponentMeta<typeof ReviewReport>

const Template: ComponentStory<typeof ReviewReport> = (args) => (
  <ReviewReport {...args} />
)
export const OccupationData = Template.bind({})
OccupationData.args = {
  claimFormValues: {
    job_title: 'Dairy Farmer',
    job_description: 'Field and cattle work',
    occucoder_code: '45-2093.00',
    occucoder_job_title: 'Farmworkers, Farm, Ranch, and Aquacultural Animals',
    occucoder_description:
      'Attend to live farm, ranch, open range or aquacultural animals.',
    occucoder_score: 100,
  },
}
