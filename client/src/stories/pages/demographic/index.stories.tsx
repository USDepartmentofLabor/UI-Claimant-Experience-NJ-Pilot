import { ComponentMeta, ComponentStory } from '@storybook/react'

import Demographic from 'pages/claim/demographic'

export default {
  title: 'Pages/Form/Demographic',
  component: Demographic,
} as ComponentMeta<typeof Demographic>

const Template: ComponentStory<typeof Demographic> = () => {
  return <Demographic />
}

export const Default = Template.bind({})
