/**
 * Main Store function
 */
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { createLogger } from 'redux-logger';
import rootReducer from '../Reducers';
import rootSaga from '../Sagas';

export default  function (initialState = {}) {
  // Middleware and Store enhancers
  const sagaMiddleware = createSagaMiddleware();
  const enhancers = [
    applyMiddleware(sagaMiddleware),
  ];

  if (process.env.NODE_ENV !== 'production') {
    enhancers.push(applyMiddleware(createLogger()));
    window.devToolsExtension && enhancers.push(window.devToolsExtension());
  }

  const store = createStore(rootReducer, initialState, compose(...enhancers));
  /* ------------- Saga Middleware ------------- */
  sagaMiddleware.run(rootSaga);

  return store;
}
