import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SignOut } from './SignOut'

export default {
  title: 'Components/Sign Out Button',
  component: SignOut,
} as ComponentMeta<typeof SignOut>

const Template: ComponentStory<typeof SignOut> = (args) => <SignOut {...args} />

export const SignOutWithButton = Template.bind({})
SignOutWithButton.args = {
  isNavLink: false,
}

export const SignOutWithNav = Template.bind({})
SignOutWithNav.args = {
  isNavLink: true,
}
