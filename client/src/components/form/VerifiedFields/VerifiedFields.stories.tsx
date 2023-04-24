import { VerifiedFields } from './VerifiedFields'
import { VerifiedField } from './VerifiedField/VerifiedField'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Form/VerifiedFields',
  component: VerifiedFields,
} as ComponentMeta<typeof VerifiedFields>

const Template: ComponentStory<typeof VerifiedFields> = () => (
  <VerifiedFields heading="The following information has been added to your application:">
    <VerifiedField label="First name" value="Hermione" />
    <VerifiedField label="Race" value={['Asian', 'White']} />
    <VerifiedField label="Address">
      <div>123 main St.</div>
      <div>Trenton, NJ 00000</div>
      <div>USA</div>
    </VerifiedField>
  </VerifiedFields>
)

export const Default = Template.bind({})
