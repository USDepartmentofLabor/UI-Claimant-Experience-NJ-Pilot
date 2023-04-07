import { ComponentMeta, ComponentStory } from '@storybook/react'
import Spinner from './Spinner'

export default {
  title: 'Components/Spinner',
  component: Spinner,
  args: {
    label: 'Loading...',
  },
} as ComponentMeta<typeof Spinner>

export const Example: ComponentStory<typeof Spinner> = (args) => (
  <Spinner {...args} />
)
