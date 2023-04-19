import { ComponentMeta, ComponentStory } from '@storybook/react'
import BetaSuccess from 'pages/claim/beta-success'

export default {
  title: 'Pages/Claim Form/Success',
  component: BetaSuccess,
} as ComponentMeta<typeof BetaSuccess>

const Template: ComponentStory<typeof BetaSuccess> = () => {
  return <BetaSuccess />
}

export const Default = Template.bind({})
