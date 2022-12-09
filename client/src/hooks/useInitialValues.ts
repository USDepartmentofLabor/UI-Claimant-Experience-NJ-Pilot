import { useContext, useMemo } from 'react'
import { merge } from 'lodash'
import { useWhoAmI } from 'hooks/useWhoAmI'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

export const useInitialValues = (pageInitialValues: ClaimantInput) => {
  const { claimFormValues } = useContext(ClaimFormContext)
  const { data: whoAmI, isLoading: isLoadingWhoAmI } = useWhoAmI()

  const initialValues = useMemo(() => {
    // Initial Values starts with the manually defined values for a given page
    const initialValues = pageInitialValues
    // Claimants can manually alter their phone number.
    // If a phone number is present in the partial claim already, it is either
    // from the whoami on a previous session or a value the claimant previously edited,
    // so don't overwrite it.
    // TODO: Advocate for design change. Claimants should not be able to change
    //  the information from their IDP account within the intake app.
    //  If they can edit a phone number field in the intake app, it should be
    //  separate from what we collect from the IDP.
    // Reason: Bug:
    // - Claimant initiates a claim, their IDP phone number is loaded
    // - Claimant changes phone number in IDP
    // - Claimant returns to claim app, phone number is still their old phone number (we don't overwrite it)
    const previouslyEnteredPhone = claimFormValues?.claimant_phone?.number
    const overwriteClaimantPhone = !previouslyEnteredPhone

    const initialWhoAmIValues = isLoadingWhoAmI
      ? {}
      : whoAmI
      ? {
          claimant_name: {
            first_name: whoAmI.firstName,
            last_name: whoAmI.lastName,
            middle_initial: whoAmI.middleInitial,
          },
          email: whoAmI.email,
          birthdate: whoAmI.birthdate,
          claimant_phone: {
            number: overwriteClaimantPhone
              ? whoAmI.phone
              : previouslyEnteredPhone,
          },
        }
      : {}

    merge(initialValues, claimFormValues, initialWhoAmIValues)

    return initialValues
  }, [pageInitialValues, whoAmI, claimFormValues])

  return {
    initialValues,
    isLoading: isLoadingWhoAmI,
  }
}
