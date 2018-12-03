import queryTypes from 'state/query/constants'
import authTypes from 'state/auth/constants'
import {
  baseSymbolState,
  fetchNext,
  fetchPrev,
  jumpPage,
} from 'state/reducers.helper'

import types from './constants'

const initialState = {
  ...baseSymbolState,
}

const TYPE = queryTypes.MENU_FCREDIT

export function fundingCreditHistoryReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case types.UPDATE_FCREDIT: {
      const { res, nextPage } = payload
      const { existingCoins } = state
      const updateCoins = [...existingCoins]
      let smallestMts
      const entries = res.map((entry) => {
        const {
          amount,
          flags,
          hidden,
          id,
          mtsCreate,
          mtsLastPayout,
          mtsOpening,
          mtsUpdate,
          noClose,
          notify,
          period,
          positionPair,
          rate,
          rateReal,
          renew,
          side,
          status,
          symbol,
        } = entry
        const currentSymbol = symbol.slice(1)
        // save new symbol to updateCoins list
        if (updateCoins.indexOf(currentSymbol) === -1) {
          updateCoins.push(currentSymbol)
        }
        // log smallest mts
        if (nextPage === false
          && (!smallestMts || smallestMts > mtsUpdate)
        ) {
          smallestMts = mtsUpdate
        }
        return {
          id,
          symbol: currentSymbol,
          side,
          mtsCreate,
          mtsUpdate,
          amount,
          flags,
          status,
          rate,
          period,
          mtsOpening,
          mtsLastPayout,
          notify,
          hidden,
          rateReal,
          renew,
          noClose,
          positionPair,
        }
      })
      return {
        ...state,
        currentEntriesSize: entries.length,
        dataReceived: true,
        entries: [...state.entries, ...entries],
        existingCoins: updateCoins.sort(),
        smallestMts: nextPage !== false ? nextPage : smallestMts - 1,
        offset: state.offset + entries.length,
        pageOffset: 0,
        pageLoading: false,
        nextPage,
      }
    }
    case types.FETCH_FAIL:
      return {
        ...state,
        pageLoading: false,
      }
    case types.FETCH_NEXT_FCREDIT:
      return fetchNext(TYPE, state)
    case types.FETCH_PREV_FCREDIT:
      return fetchPrev(TYPE, state)
    case types.JUMP_FCREDIT_PAGE:
      return jumpPage(TYPE, state, payload)
    case types.ADD_SYMBOL:
      return state.targetSymbols.includes(payload)
        ? state
        : {
          ...initialState,
          targetSymbols: [...state.targetSymbols, payload],
          existingCoins: state.existingCoins,
        }
    case types.REMOVE_SYMBOL:
      return (state.targetSymbols.includes(payload))
        ? {
          ...initialState,
          targetSymbols: state.targetSymbols.filter(symbol => symbol !== payload),
          existingCoins: state.existingCoins,
        }
        : state
    case types.SET_SYMBOLS:
      return {
        ...initialState,
        targetSymbols: payload,
        existingCoins: state.existingCoins,
      }
    // existingCoins should be re-calc in new time range
    case types.REFRESH:
    case queryTypes.SET_TIME_RANGE:
      return {
        ...initialState,
        targetSymbol: state.targetSymbol,
      }
    case authTypes.LOGOUT:
      return initialState
    default: {
      return state
    }
  }
}

export default fundingCreditHistoryReducer
