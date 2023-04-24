import { ComponentMeta, ComponentStory } from '@storybook/react'
import Contact from 'pages/claim/contact'

export default {
  title: 'Pages/Claim Form/Contact Information',
  component: Contact,
} as ComponentMeta<typeof Contact>

const Template: ComponentStory<typeof Contact> = () => {
  return <Contact />
}

export const Default = Template.bind({})
