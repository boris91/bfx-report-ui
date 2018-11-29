import React, { Fragment, PureComponent } from 'react'
import { injectIntl } from 'react-intl'
import {
  Card,
  Elevation,
} from '@blueprintjs/core'
import {
  Cell,
  TruncatedFormat,
} from '@blueprintjs/table'

import Pagination from 'components/Pagination'
import TimeRange from 'ui/TimeRange'
import DataTable from 'ui/DataTable'
import ExportButton from 'ui/ExportButton'
import Loading from 'ui/Loading'
import NoData from 'ui/NoData'
import RefreshButton from 'ui/RefreshButton'
import MultiSymbolSelector from 'ui/MultiSymbolSelector'
import queryConstants from 'state/query/constants'
import {
  checkFetch,
  formatTime,
  getCurrentEntries,
  handleAddSymbolFilter,
  handleRemoveSymbolFilter,
} from 'state/utils'
import { amountStyle } from 'ui/utils'

import { propTypes, defaultProps } from './FundingOfferHistory.props'

const COLUMN_WIDTHS = [80, 100, 100, 150, 100, 200, 150, 80, 150]
const LIMIT = queryConstants.DEFAULT_FOFFER_QUERY_LIMIT
const PAGE_SIZE = queryConstants.DEFAULT_FOFFER_PAGE_SIZE
const TYPE = queryConstants.MENU_FOFFER

class FundingOfferHistory extends PureComponent {
  constructor(props) {
    super(props)
    this.handlers = {}
    this.handleClick = this.handleClick.bind(this)
    this.handleTagRemove = this.handleTagRemove.bind(this)
  }

  componentDidMount() {
    const { loading, fetchFoffer, match } = this.props
    if (loading) {
      const symbol = (match.params && match.params.symbol) || ''
      fetchFoffer(symbol)
    }
  }

  componentDidUpdate(prevProps) {
    checkFetch(prevProps, this.props, TYPE)
  }

  handleClick(symbol) {
    if (!this.handlers[symbol]) {
      this.handlers[symbol] = () => handleAddSymbolFilter(TYPE, symbol, this.props)
    }
    return this.handlers[symbol]
  }

  handleTagRemove(tag) {
    handleRemoveSymbolFilter(TYPE, tag, this.props)
  }

  render() {
    const {
      fetchNext,
      fetchPrev,
      offset,
      pageOffset,
      pageLoading,
      targetSymbols,
      entries,
      existingCoins,
      handleClickExport,
      intl,
      jumpPage,
      loading,
      refresh,
      timezone,
      nextPage,
    } = this.props
    const filteredData = getCurrentEntries(entries, offset, LIMIT, pageOffset, PAGE_SIZE)
    const numRows = filteredData.length

    const idCellRenderer = (rowIndex) => {
      const { id } = filteredData[rowIndex]
      return (
        <Cell tooltip={id}>
          {id}
        </Cell>
      )
    }

    const symbolCellRenderer = (rowIndex) => {
      const { symbol } = filteredData[rowIndex]
      return (
        <Cell tooltip={symbol}>
          {symbol}
        </Cell>
      )
    }

    const amountCellRenderer = (rowIndex) => {
      const { amountOrig } = filteredData[rowIndex]
      return (
        <Cell
          className='bitfinex-text-align-right'
          tooltip={amountOrig}
        >
          {amountOrig}
        </Cell>
      )
    }

    const amountExecutedCellRenderer = (rowIndex) => {
      const { amountExecuted } = filteredData[rowIndex]
      const classes = amountStyle(amountExecuted)
      return (
        <Cell
          className={classes}
          tooltip={amountExecuted}
        >
          {amountExecuted}
        </Cell>
      )
    }

    const typeCellRenderer = (rowIndex) => {
      const { type } = filteredData[rowIndex]
      return (
        <Cell tooltip={type}>
          {type}
        </Cell>
      )
    }

    const statusCellRenderer = (rowIndex) => {
      const { status } = filteredData[rowIndex]
      return (
        <Cell tooltip={status}>
          {status}
        </Cell>
      )
    }

    const rateCellRenderer = (rowIndex) => {
      const { rate } = filteredData[rowIndex]
      return (
        <Cell
          className='bitfinex-text-align-right'
          tooltip={rate}
        >
          {rate}
        </Cell>
      )
    }

    const periodCellRenderer = (rowIndex) => {
      const period = `${filteredData[rowIndex].period} ${intl.formatMessage({ id: 'foffer.column.period.days' })}`
      return (
        <Cell
          className='bitfinex-text-align-right'
          tooltip={period}
        >
          {period}
        </Cell>
      )
    }

    const mtsUpdateCellRenderer = (rowIndex) => {
      const mtsUpdate = formatTime(filteredData[rowIndex].mtsUpdate, timezone)
      return (
        <Cell tooltip={mtsUpdate}>
          <TruncatedFormat>
            {mtsUpdate}
          </TruncatedFormat>
        </Cell>
      )
    }

    const renderSymbolSelector = (
      <Fragment>
        &nbsp;
        <MultiSymbolSelector
          currentFilters={targetSymbols}
          existingCoins={existingCoins}
          onSymbolSelect={this.handleClick}
          handleTagRemove={this.handleTagRemove}
          type={TYPE}
        />
      </Fragment>
    )

    const renderPagination = (
      <Pagination
        type={TYPE}
        dataLen={entries.length}
        loading={pageLoading}
        offset={offset}
        jumpPage={jumpPage}
        prevClick={fetchPrev}
        nextClick={fetchNext}
        pageOffset={pageOffset}
        nextPage={nextPage}
      />
    )

    const tableColums = [
      {
        id: 'id',
        name: 'column.id',
        renderer: idCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].id,
      },
      {
        id: 'symbol',
        name: 'foffer.column.symbol',
        renderer: symbolCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].symbol,
      },
      {
        id: 'amount',
        name: 'foffer.column.amount',
        renderer: amountCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].amountOrig,
      },
      {
        id: 'amountExecuted',
        name: 'foffer.column.amount-exe',
        renderer: amountExecutedCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].amountExecuted,
      },
      {
        id: 'type',
        name: 'foffer.column.type',
        renderer: typeCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].type,
      },
      {
        id: 'status',
        name: 'foffer.column.status',
        renderer: statusCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].status,
      },
      {
        id: 'rate',
        name: 'foffer.column.rate',
        renderer: rateCellRenderer,
        tooltip: rowIndex => filteredData[rowIndex].rate,
      },
      {
        id: 'period',
        name: 'foffer.column.period',
        renderer: periodCellRenderer,
        tooltip: (rowIndex) => {
          const days = intl.formatMessage({ id: 'foffer.column.period.days' })
          return `${filteredData[rowIndex].period} ${days}`
        },
      },
      {
        id: 'mtsUpdate',
        name: 'foffer.column.updated',
        renderer: mtsUpdateCellRenderer,
        tooltip: rowIndex => formatTime(filteredData[rowIndex].mtsUpdate, timezone),
      },
    ]

    let showContent
    if (loading) {
      showContent = (
        <Loading title='foffer.title' />
      )
    } else if (numRows === 0) {
      showContent = (
        <Fragment>
          <h4>
            {intl.formatMessage({ id: 'foffer.title' })}
            &nbsp;
            <TimeRange />
            {renderSymbolSelector}
          </h4>
          <NoData />
        </Fragment>
      )
    } else {
      showContent = (
        <Fragment>
          <h4>
            {intl.formatMessage({ id: 'foffer.title' })}
            &nbsp;
            <TimeRange />
            {renderSymbolSelector}
            &nbsp;
            <ExportButton handleClickExport={handleClickExport} />
            &nbsp;
            <RefreshButton handleClickRefresh={refresh} />
          </h4>
          {renderPagination}
          <DataTable
            numRows={numRows}
            columnWidths={COLUMN_WIDTHS}
            tableColums={tableColums}
          />
          {renderPagination}
        </Fragment>
      )
    }

    return (
      <Card elevation={Elevation.ZERO} className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
        {showContent}
      </Card>
    )
  }
}

FundingOfferHistory.propTypes = propTypes
FundingOfferHistory.defaultProps = defaultProps

export default injectIntl(FundingOfferHistory)
