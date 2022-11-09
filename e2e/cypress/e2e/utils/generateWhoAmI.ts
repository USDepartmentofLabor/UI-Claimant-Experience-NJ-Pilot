import { faker } from '@faker-js/faker'

export const generateWhoAmI = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const middleInitial =
    Math.random() < 0.5 ? faker.name.middleName().charAt(0) : undefined
  const birthdate = faker.date.birthdate().toISOString().substring(0, 10)
  const email = faker.internet.email(firstName, lastName)
  const phone = faker.phone.number('##########')

  return {
    firstName,
    lastName,
    middleInitial,
    birthdate,
    email,
    phone,
  }
}
