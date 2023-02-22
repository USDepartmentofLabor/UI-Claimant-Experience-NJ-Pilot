import states from 'fixtures/states.json'
import territories from 'fixtures/territories.json'
import provinces from 'fixtures/provinces.json'

const statesTerritoriesProvincesLookup = {
  ...states,
  ...territories,
  ...provinces,
}

export const getStatesTerritoriesProvincesNameFromAbbrev = (abbr: string) => {
  if (abbr in statesTerritoriesProvincesLookup) {
    return statesTerritoriesProvincesLookup[
      abbr as keyof typeof statesTerritoriesProvincesLookup
    ]
  } else {
    return abbr
  }
}
