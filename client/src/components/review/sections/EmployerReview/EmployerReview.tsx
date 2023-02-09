// import { Fragment, useContext } from 'react'
// import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
// import { PersonalPageDefinition } from 'constants/pages/definitions/personalPageDefinition'
// import { ClaimFormContext } from 'contexts/ClaimFormContext'
// // import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
// import { useTranslation } from 'next-i18next'
// // import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'
// import { AddressInput } from 'types/claimantInput'

// export const buildEmployerAddress = (
//   personalAddress: AddressInput | undefined
// ) => {
//   const { address, state, city, zipcode } = personalAddress || {}

//   if (
//     address === undefined &&
//     state === undefined &&
//     city === undefined &&
//     zipcode === undefined
//   ) {
//     return undefined
//   }

//   return `${address}${address && ', '}${city}${city && ', '}${state}${
//     state && ' '
//   }${zipcode}`

// }
// export const EmployerReview = ({ employer }: { employer: EmployerType }) => {
//     const { t } = useTranslation("claimForm", { keyPrefix: "employers" });

// }
// export const EmployersReview = () => {
//     const { t } = useTranslation('claimForm')

//     const { claimFormValues } = useContext(ClaimFormContext)

//     const { heading, path } = PersonalPageDefinition

//     return (
//         <>
//       {claimFormValues?.employers && claimFormValues?.employers.length>0 &&
//       claimFormValues?.employers.map((employer,idx)=>(
//         <EmployerReview></EmployerReview>)
//       )
// }</>

//         )
//      }
