import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Cell } from '@blueprintjs/table'

import DataTable from 'ui/DataTable'
import { getTooltipContent } from 'utils/columns'
import { fixedFloat, formatAmount } from 'ui/utils'

const getColumns = ({ leoLev, leoAmountAvg, t }) => {
  const formattedLeoAmountAvg = fixedFloat(leoAmountAvg)

  return [
    {
      id: 'leo_level',
      name: 'accountsummary.leo_level',
      width: 100,
      renderer: () => (
        <Cell tooltip={getTooltipContent(leoLev, t)}>
          {leoLev}
        </Cell>
      ),
      copyText: () => leoLev,
    },
    {
      id: 'leo_average_amount',
      name: 'accountsummary.average_amount',
      width: 120,
      renderer: () => (
        <Cell tooltip={getTooltipContent(formattedLeoAmountAvg, t)}>
          {formatAmount(formattedLeoAmountAvg)}
        </Cell>
      ),
      copyText: () => leoAmountAvg,
    },
  ]
}

const AccountSummaryLeo = ({ data, t }) => {
  const { leoLev, leoAmountAvg } = data

  const columns = getColumns({ leoLev, leoAmountAvg, t })

  return (
    <div className='section-account-summary-data-item'>
      <div className='data-item--divider' />
      <DataTable
        numRows={1}
        tableColumns={columns}
      />
    </div>
  )
}

AccountSummaryLeo.propTypes = {
  data: PropTypes.shape({
    leoLev: PropTypes.number.isRequired,
    leoAmountAvg: PropTypes.number.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

export default memo(AccountSummaryLeo)
