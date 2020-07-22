import { combineReducers } from 'redux';

import auth from './Auth';
import fees from './Fees';
import debtors from './Debtors';

export default combineReducers({
  auth,
  fees,
  debtors
});
