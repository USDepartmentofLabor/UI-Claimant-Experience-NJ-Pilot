import {
  EthnicityOptionType,
  RaceOptionType,
  SexOptionType,
  TypeOfPhoneType,
} from 'constants/formOptions'

type ClaimantInput = DemographicInformationType & ContactType

type DemographicInformationType = {
  sex?: SexOptionType
  ethnicity?: EthnicityOptionType
  race?: RaceOptionType[]
}

type ContactType = {
  email?: string
  phones?: TypeOfPhoneType[]
  interpreter_required?: boolean
  preferred_language?: string
  LOCAL_more_phones?: boolean
}
