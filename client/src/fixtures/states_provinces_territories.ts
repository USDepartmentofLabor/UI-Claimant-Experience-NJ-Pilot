import states from './states.json'
import provinces from './provinces.json'
import territories from './territories.json'

export const statesProvincesAndTerritories = {
  ...states,
  ...provinces,
  ...territories,
}
