import { NewJerseyBanner } from 'components/NewJerseyBanner/NewJerseyBanner'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/New Jersey Banner',
  component: NewJerseyBanner,
} as ComponentMeta<typeof NewJerseyBanner>

const Template: ComponentStory<typeof NewJerseyBanner> = () => (
  <NewJerseyBanner />
)

export const Default = Template.bind({})
