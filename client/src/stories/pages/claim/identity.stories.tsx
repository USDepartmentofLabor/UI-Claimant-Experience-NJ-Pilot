import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Identity } from 'pages/claim/identity'

export default {
  title: 'Pages/Claim Form/Identity',
  component: Identity,
} as ComponentMeta<typeof Identity>

const Template: ComponentStory<typeof Identity> = () => {
  return <Identity />
}

export const Default = Template.bind({})
