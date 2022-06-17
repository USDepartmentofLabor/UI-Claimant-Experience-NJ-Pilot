import {
  EthnicityOptionType,
  RaceOptionType,
  SexOptionType,
} from 'constants/formOptions'

type ClaimantInput = DemographicInformationType

type DemographicInformationType = {
  sex?: SexOptionType
  ethnicity?: EthnicityOptionType
  race?: RaceOptionType[]
}
