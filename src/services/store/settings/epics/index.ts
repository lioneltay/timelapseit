import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, of, from, merge } from "rxjs"
import {
  mergeMap,
  withLatestFrom,
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
} from "rxjs/operators"

import { StateObservable } from "redux-observable"

import { Action, State } from "services/store"

import { actionCreators } from "../actions"

import * as api from "services/api"

import { setLocalSettings } from "../utils"

const updateSettingsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    filter(action => (action as any).meta?.settingsUpdate),
    debounceTime(1000),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      if (!(action as any).meta?.settingsUpdate) {
        throw Error("Filter fail no meta.settingsUpdate")
      }

      if (!state.auth.user?.uid) {
        return empty()
      }

      const settings = {
        darkMode: state.settings.darkMode,
      }

      setLocalSettings(settings)

      return from(api.updateSettings(state.auth.user.uid, settings))
    }),
    mergeMap(() => empty()),
  )
}

const initializeSettingsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => state.auth.user?.uid),
    distinctUntilChanged(),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const userId = state.auth.user?.uid
      if (!userId) {
        return empty()
      }

      return from(api.getSettings(userId))
    }),
    map(settings => actionCreators.setSettings(settings)),
  )
}

export const rootEpic = combineEpics(updateSettingsEpic, initializeSettingsEpic)
