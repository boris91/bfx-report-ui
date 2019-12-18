import PropTypes from 'prop-types'

const POSITIONS_ENTRIES_PROPS = PropTypes.shape({
  amount: PropTypes.number,
  basePrice: PropTypes.number,
  liquidationPrice: PropTypes.number,
  marginFunding: PropTypes.number,
  marginFundingType: PropTypes.number,
  mtsUpdate: PropTypes.number.isRequired,
  pair: PropTypes.string.isRequired,
  pl: PropTypes.number,
  plPerc: PropTypes.number,
})

export const propTypes = {
  entries: PropTypes.arrayOf(POSITIONS_ENTRIES_PROPS).isRequired,
  fetchPaudit: PropTypes.func.isRequired,
  getFullTime: PropTypes.func,
  dataReceived: PropTypes.bool.isRequired,
  pageLoading: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  targetIds: PropTypes.array.isRequired,
  timeOffset: PropTypes.string.isRequired,
  setTargetIds: PropTypes.func.isRequired,
}

export const defaultProps = {
  entries: [],
}
