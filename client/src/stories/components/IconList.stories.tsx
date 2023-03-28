import { ComponentMeta, ComponentStory } from '@storybook/react'
import {
  Icon,
  IconList,
  IconListContent,
  IconListIcon,
  IconListItem,
  IconListTitle,
} from '@trussworks/react-uswds'

export default {
  title: 'Components/IconList',
  component: IconList,
} as ComponentMeta<typeof IconList>

const Template: ComponentStory<typeof IconList> = () => {
  return (
    <IconList className="nj-icon-list">
      <IconListItem>
        <IconListIcon>
          <Icon.SentimentSatisfiedAlt />
        </IconListIcon>
        <IconListContent>
          <IconListTitle type="h2">Let the sun shine.</IconListTitle>
          <p>Some tips:</p>
          <ul className="usa-list">
            <li>
              On sunny days, open your curtains to allow the sun to naturally
              warm the rooms of your home without using electricity. Natural
              sunlight can also lift your mood to help brighten your day.
            </li>
            <li>
              On warm days, close your curtains to help keep your house cool.
            </li>
          </ul>
        </IconListContent>
      </IconListItem>
      <IconListItem>
        <IconListIcon>
          <Icon.CalendarToday />
        </IconListIcon>
        <IconListContent>
          <IconListTitle type="h2">Adjust your schedule.</IconListTitle>
          <p>
            Instead of running high-energy-use appliances such as dishwashers
            and clothes dryers during mid-afternoon or early evening hours,
            operate them early in the morning or late at night. Some utilities
            charge less at off-peak times, which will help reduce your costs.
          </p>
        </IconListContent>
      </IconListItem>
    </IconList>
  )
}

export const Default = Template.bind({})
