import { Union } from 'pages/claim/union'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Pages/Claim Form/Union',
  component: Union,
} as ComponentMeta<typeof Union>

const Template: ComponentStory<typeof Union> = () => {
  return <Union />
}

export const Default = Template.bind({})
