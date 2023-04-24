import { ComponentMeta, ComponentStory } from '@storybook/react'

import Demographics from 'pages/claim/demographics'

export default {
  title: 'Pages/Claim Form/Demographics',
  component: Demographics,
} as ComponentMeta<typeof Demographics>

const Template: ComponentStory<typeof Demographics> = () => {
  return <Demographics />
}

export const Default = Template.bind({})
