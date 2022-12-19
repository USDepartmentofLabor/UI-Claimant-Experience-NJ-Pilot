import { ComponentMeta, ComponentStory } from '@storybook/react'
import { SessionManager } from './SessionManager'

export default {
  title: 'Components/Session Manager',
  component: SessionManager,
} as ComponentMeta<typeof SessionManager>
const MINUTES = 2
const SECONDS = 0
const generateExpireTime = () => {
  const expireDate = new Date(Date.now() + (60 * MINUTES + SECONDS) * 1000)
  console.log('expire date is ' + expireDate)
  return expireDate.toString()
}
const AlwaysOpenTemplate: ComponentStory<typeof SessionManager> = () => (
  <SessionManager
    forceOpen={true}
    forceExpireTime={generateExpireTime()}
  ></SessionManager>
)

export const AlwaysOpen = AlwaysOpenTemplate.bind({})
const PopUpFeatureTemplate: ComponentStory<typeof SessionManager> = () => (
  <SessionManager
    forceOpen={false}
    forceExpireTime={generateExpireTime()}
  ></SessionManager>
)
export const PopUpFeature = PopUpFeatureTemplate.bind({})
