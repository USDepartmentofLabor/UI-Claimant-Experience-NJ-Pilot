import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SessionManager } from './SessionManager'

export default {
  title: 'Components/Session Manager',
  component: SessionManager,
} as ComponentMeta<typeof SessionManager>

const Template: ComponentStory<typeof SessionManager> = () => (
  <SessionManager forceOpen={true}></SessionManager>
)

export const Default = Template.bind({})
