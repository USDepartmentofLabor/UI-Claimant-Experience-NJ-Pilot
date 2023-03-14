import { array, boolean, mixed, object, ValidationError } from 'yup'
import { i18n_claimForm, i18n_common } from 'i18n/i18n'
import {
  yupAddress,
  yupAddressWithoutPOBox,
  yupName,
} from 'validations/yup/custom'
import { PageDefinition } from 'constants/pages/pageDefinitions'
import { Routes } from 'constants/routes'
const getLength = (field: string | undefined) => {
  return field?.length ? field?.length : 0
}
const validationSchema = object().shape({
  LOCAL_claimant_has_alternate_names: boolean()
    .nullable()
    .required(i18n_claimForm.t('name.claimant_has_alternate_names.required')),
  alternate_names: mixed().when('LOCAL_claimant_has_alternate_names', {
    is: true,
    then: array().of(yupName).min(1).required(),
  }),
  LOCAL_mailing_address_same: boolean(),
  residence_address: yupAddressWithoutPOBox(),
  mailing_address: mixed()
    .when('LOCAL_mailing_address_same', {
      is: false,
      then: yupAddress(),
    })
    .test({
      test: ({ address, city }) => {
        const len = getLength(address) + getLength(city)
        return len > 44
          ? new ValidationError(
              i18n_common.t('address.address.errors.maxLength.mailing'),
              false,
              'LOCAL_mailing_address_same'
            )
          : true
      },
    }),
})

export const PersonalPageDefinition: PageDefinition = {
  path: Routes.CLAIM.PERSONAL,
  heading: i18n_claimForm.t('personal.heading'),
  validationSchema,
}
