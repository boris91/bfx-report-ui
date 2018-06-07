import { call, put, select, takeLatest } from 'redux-saga/effects'
import types from './constants'
import ledgersTypes from '../ledgers/constants'
import tradesTypes from '../trades/constants'
import ordersTypes from '../orders/constants'
import movementsTypes from '../movements/constants'
import { postJsonfetch } from '../utils'
import { baseUrl } from '../../var/config'

function getAuth(apiKey, apiSecret) {
  return postJsonfetch(`${baseUrl}/check-auth`, {
    auth: {
      apiKey,
      apiSecret,
    },
  })
}

function* checkAuth() {
  const auth = yield select(state => state.auth)
  try {
    const data = yield call(getAuth, auth.apiKey, auth.apiSecret)
    yield put({
      type: types.UPDATE_AUTH_RESULT,
      payload: data && data.result,
    })
    if (data && data.result) { // fetch all
      yield put({
        type: ledgersTypes.FETCH_LEDGERS,
      })
      yield put({
        type: tradesTypes.FETCH_TRADES,
      })
      yield put({
        type: ordersTypes.FETCH_ORDERS,
      })
      yield put({
        type: movementsTypes.FETCH_MOVEMENTS,
      })
    }
  } catch (error) {
    // TODO: handle error case
    // console.error(error)
    // yield put({ type: 'REQUEST_FAILED', error })
  }
}

// function* checkAuthWithApiKey(action = {}) {
// }

// function *checkAuthWithAuthKey(action = {}) {

// }

export default function* authSaga() {
  yield takeLatest(types.CHECK_AUTH, checkAuth)
}
