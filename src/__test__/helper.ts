/* eslint-disable import/no-extraneous-dependencies */
// @ts-ignore Could not find a declaration file for module 'dva-immer'
import dvaImmer from 'dva-immer';
import dva, { Model } from 'dva';
import { Store } from 'redux';
import { GlobalState } from '@/service/interface';
/*
 * To setup a test using models with some inital state there are two options.
 * 1. edit each model's state before setup
 * 2. pass in an initialState object.
 * Option 2 (initialState) will override any default state from the models.
 */

export function setup(
  models: Model[],
  initialState?: any /* subset of GlobalState */,
): Store<GlobalState> {
  const app = dva({ initialState });
  app.use(dvaImmer());
  models.forEach((m) => app.model(m));
  app.router(jest.fn());
  app.start();
  // @ts-ignore: Property '_store' does not exist on type 'DvaInstance'.
  // eslint-disable-next-line no-underscore-dangle
  return app._store;
}
