import Personal from 'pages/claim/personal'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Pages/Claim Form/Personal',
  component: Personal,
} as ComponentMeta<typeof Personal>

const Template: ComponentStory<typeof Personal> = () => {
  return <Personal />
}

export const Default = Template.bind({})
