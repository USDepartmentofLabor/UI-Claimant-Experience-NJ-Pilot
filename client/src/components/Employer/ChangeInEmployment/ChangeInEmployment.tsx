import { Fieldset } from '@trussworks/react-uswds'
import { RadioField } from 'components/form/fields/RadioField/RadioField'
import { changeInEmploymentOptions } from 'constants/formOptions'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
import { ClaimantInput } from 'types/claimantInput'
import { YesNoQuestion } from 'components/form/YesNoQuestion/YesNoQuestion'
import { DateInputField } from 'components/form/fields/DateInputField/DateInputField'

interface IEmployer {
  index: string
}
interface IChangeInEmploymentOptionText {
  description: string
  name: string
}

// type LaidOffOption =
//   keyof typeof employers.separation.reasons.laid_off.options;
// type FiredOption =
//   keyof typeof claimForm.employers.separation.reasons.fired_discharged_terminated.options;
// type StillEmployedOption =
//   keyof typeof claimForm.employers.separation.reasons.still_employed.options;
// type QuitOption =
//   keyof typeof claimForm.employers.separation.reasons.quit.options;

// type SeparationOption =
//   | LaidOffOption
//   | FiredOption
//   | StillEmployedOption
//   | QuitOption;

export const ChangeInEmployment = ({ index }: IEmployer) => {
  const { values } = useFormikContext<ClaimantInput>()
  const { clearField } = useClearFields()

  const handleReasonChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value === 'yes') {
      clearField(`employers[${index}].employer_is_sole_proprietorship`)

      clearField('preferred_language')
      clearField('preferred_language_other')
    }
    console.log('fill this in')
  }
  const { t } = useTranslation('claimForm', { keyPrefix: 'employers' })

  const employer = values.employers[parseInt(index)]
  const showExpectRecall = employer.separation_circumstance === 'laid_off'
  //     export const separationReasons = new Map<
  //   SeparationReasonOptionType,
  //   SeparationReasonType
  // >([
  //   [
  //     "laid_off",
  //     {
  //       options: Object.keys(
  //         claimForm.employers.separation.reasons.laid_off.options
  //       ) as LaidOffOption[],
  //       comment_required: false,
  //     },
  //   ],
  //   [
  //     "fired_discharged_terminated",
  //     {
  //       options: Object.keys(
  //         claimForm.employers.separation.reasons.fired_discharged_terminated
  //           .options
  //       ) as FiredOption[],
  //       comment_required: true,
  //     },
  //   ],
  //   [
  //     "still_employed",
  //     {
  //       options: Object.keys(
  //         claimForm.employers.separation.reasons.still_employed.options
  //       ) as StillEmployedOption[],
  //       comment_required: true,
  //     },
  //   ],
  //   [
  //     "quit",
  //     {
  //       options: Object.keys(
  //         claimForm.employers.separation.reasons.quit.options
  //       ) as QuitOption[],
  //       comment_required: true,
  //     },
  //   ],
  //   [
  //     "strike",
  //     {
  //       comment_required: true,
  //     },
  //   ],
  //   [
  //     "retired",
  //     {
  //       comment_required: true,
  //     },
  //   ],
  //   [
  //     "shutdown",
  //     {
  //       comment_required: true,
  //     },
  //   ],
  // ]);
  //     const selectedReason = useMemo(
  //       () =>
  //         employer.separation_circumstance
  //           ? separationReasons.get(employer.separation_circumstance)
  //           : null,
  //       [employer.separation_circumstance]
  //     );
  const SeparationReasonLabel = (reason: IChangeInEmploymentOptionText) => {
    return (
      <>
        <span>{reason.name}</span>
        <div className="usa-checkbox__label-description">
          {reason.description}
        </div>
      </>
    )
  }
  return (
    <>
      <div>
        {<b>{t('separation.heading')} </b>}
        <Fieldset legend={t('separation.reason.label')}>
          <RadioField
            name={'employers[${index}].separation_circumstance'}
            tile={true}
            options={changeInEmploymentOptions.map((option) => {
              return {
                label: (
                  <SeparationReasonLabel
                    name={t(`separation.reasons.${option}.label`)}
                    description={t(`separation.reasons.${option}.description`)}
                  />
                ),
                labelDescription: index,
                tile: true,
                value: option,
              }
            })}
            onChange={handleReasonChange}
          />
        </Fieldset>
        <DateInputField
          name={'employers[${index}].employment_start_date'}
          legend={t('employment_start_date.label')}
        />
        <DateInputField
          name={'employers[${index}].employment_last_date'}
          legend={t('employment_last_date.label')}
        />

        {showExpectRecall && (
          <Fieldset>
            <YesNoQuestion
              question={t('separation.expect_to_be_recalled.label')}
              name={'employers[${index}].expect_to_be_recalled'}
            />
          </Fieldset>
        )}
      </div>
    </>
  )
}
