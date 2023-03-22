import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { signIn, updateAuth, signUpEmail } from 'state/auth/actions'
import {
  getAuthData,
  getIsLoading,
  getUsers,
  getUsersLoaded,
  getIsSubAccount,
  getUserShouldReLogin,
} from 'state/auth/selectors'
import { getIsElectronBackendLoaded } from 'state/ui/selectors'

import SignIn from './SignIn'

const mapStateToProps = state => ({
  authData: getAuthData(state),
  isElectronBackendLoaded: getIsElectronBackendLoaded(state),
  isUsersLoaded: getUsersLoaded(state),
  loading: getIsLoading(state),
  users: getUsers(state),
  isSubAccount: getIsSubAccount(state),
  userShouldReLogin: getUserShouldReLogin(state),
})

const mapDispatchToProps = {
  signIn,
  updateAuth,
  signUpEmail,
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation('translations'),
)(SignIn)
