import { Footer } from 'components/Footer/Footer'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>

const Template: ComponentStory<typeof Footer> = () => <Footer />

export const Default = Template.bind({})
