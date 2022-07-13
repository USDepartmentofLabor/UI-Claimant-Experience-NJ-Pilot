import { NextPage } from 'next'
import { ClaimantNames } from 'components/form/ClaimantNames/ClaimantNames'
import { ClaimantAddress } from 'components/form/ClaimantAddress/ClaimantAddress'

import { yupName, yupAddress } from 'validations/yup/custom'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { ADDRESS_SKELETON, PERSON_NAME_SKELETON } from 'constants/initialValues'
import { Routes } from 'constants/routes'
import { i18n_claimForm } from 'i18n/i18n'

import { array, boolean, mixed, object } from 'yup'

const Personal: NextPage = () => {
  return (
    <>
      <ClaimantNames />
      <ClaimantAddress />
    </>
  )
}

const validationSchema = object().shape({
  claimant_name: yupName,
  LOCAL_claimant_has_alternate_names: boolean().required(
    i18n_claimForm.t('name.claimant_has_alternate_names.required')
  ),
  alternate_names: mixed().when('LOCAL_claimant_has_alternate_names', {
    is: true,
    then: array().of(yupName).min(1).required(),
  }),
  LOCAL_mailing_address_same: boolean(),
  residence_address: yupAddress(),
  mailing_address: mixed().when('LOCAL_mailing_address_same', {
    is: false,
    then: yupAddress(),
  }),
})

export const PersonalPageDefinition: PageDefinition = {
  path: Routes.CLAIM.PERSONAL,
  heading: i18n_claimForm.t('personal.heading'),
  initialValues: {
    claimant_name: { ...PERSON_NAME_SKELETON },
    LOCAL_claimant_has_alternate_names: undefined,
    alternate_names: [],
    residence_address: { ...ADDRESS_SKELETON },
    LOCAL_mailing_address_same: false,
    mailing_address: { ...ADDRESS_SKELETON },
  },
  validationSchema,
}

export default Personal
