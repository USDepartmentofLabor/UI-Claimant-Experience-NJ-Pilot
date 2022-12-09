import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Disability } from 'pages/claim/disability'

export default {
  title: 'Pages/Claim Form/Disability Status',
  component: Disability,
} as ComponentMeta<typeof Disability>

const Template: ComponentStory<typeof Disability> = () => {
  return <Disability />
}

export const Default = Template.bind({})
