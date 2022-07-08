import { PageDefinition } from 'constants/pages/pageDefinitions'
import { makeClaimFormRoute } from 'constants/routes'
import { object } from 'yup'

const firstPageDefinition: PageDefinition = {
  heading: 'First page',
  path: makeClaimFormRoute('first'),
  initialValues: {},
  validationSchema: object().shape({}),
}

const middlePageDefinition: PageDefinition = {
  heading: 'Middle page',
  path: makeClaimFormRoute('middle'),
  initialValues: {},
  validationSchema: object().shape({}),
}

const lastPageDefinition: PageDefinition = {
  heading: 'Last page',
  path: makeClaimFormRoute('last'),
  initialValues: {},
  validationSchema: object().shape({}),
}

export const pageDefinitions: PageDefinition[] = [
  firstPageDefinition,
  middlePageDefinition,
  lastPageDefinition,
]
