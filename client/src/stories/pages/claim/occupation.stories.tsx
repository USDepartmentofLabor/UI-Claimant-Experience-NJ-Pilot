import Occupation from 'pages/claim/occupation'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Pages/Claim Form/Occupation',
  component: Occupation,
} as ComponentMeta<typeof Occupation>

const Template: ComponentStory<typeof Occupation> = () => {
  return <Occupation />
}

export const Default = Template.bind({})
