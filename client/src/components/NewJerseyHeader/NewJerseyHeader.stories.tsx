import { NewJerseyHeader } from 'components/NewJerseyHeader/NewJerseyHeader'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/New Jersey Header',
  component: NewJerseyHeader,
} as ComponentMeta<typeof NewJerseyHeader>

const Template: ComponentStory<typeof NewJerseyHeader> = () => (
  <NewJerseyHeader />
)

export const Default = Template.bind({})
