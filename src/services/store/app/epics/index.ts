import { combineEpics, ofType } from "redux-observable"
import { Observable, empty, from } from "rxjs"
import {
  map,
  switchMap,
  distinctUntilChanged,
  mergeMap,
  withLatestFrom,
} from "rxjs/operators"
import { Action, actionCreators } from "services/store/actions"
import { firestore, dataWithId } from "services/firebase"
import { assert } from "lib/utils"

import { selectors } from "services/store/selectors"

import { State } from "services/store"

import { StateObservable } from "redux-observable"

import * as api from "services/api"

const createTaskListObservable = (userId: ID) =>
  new Observable<TaskList[]>(observer => {
    return firestore
      .collection("taskList")
      .where("userId", "==", userId)
      .onSnapshot(snapshot => {
        const taskLists = snapshot.docs.map(doc => dataWithId(doc) as TaskList)
        observer.next(taskLists)
      })
  })

const taskListsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return state$.pipe(
    map(state => state.auth?.user?.uid ?? null),
    distinctUntilChanged(),
    switchMap(userId => (userId ? createTaskListObservable(userId) : empty())),
    map(taskLists => actionCreators.app.setTaskLists(taskLists)),
  )
}

const firstTaskListEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    ofType("APP|SET_TASK_LISTS"),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      assert(action.type === "APP|SET_TASK_LISTS")

      const userId = state.auth.user?.uid

      console.log("firstasklist epic", userId)

      if (!(userId && action.payload.taskLists.length === 0)) {
        return empty()
      }

      return from(
        api
          .createTaskList({
            name: "Todo",
            primary: true,
            userId,
          })
          .then(async list => {
            await Promise.all([
              api.createTask({
                title: "My first task!",
                userId,
                listId: list.id,
              }),
              api.createTask({
                title: "My second task!",
                userId,
                listId: list.id,
              }),
            ])
            return list
          }),
      )
    }),
    map(list => actionCreators.app.selectTaskList(list.id)),
  )
}

const updateTaskListCountsEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>,
): Observable<Action> => {
  return action$.pipe(
    ofType("LIST|SET_TASKS"),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      assert(action.type === "LIST|SET_TASKS")

      const list = state.app.taskLists?.find(
        list => list.id === action.payload.listId,
      )

      if (!list) {
        console.log("no task list")
        return empty()
      }

      const tasks = selectors.listPage.tasks(state, list.id)
      assert(tasks)
      const numberOfCompleteTasks = tasks.filter(task => task.complete).length
      const numberOfIncompleteTasks = tasks.filter(task => !task.complete)
        .length

      if (
        list.numberOfCompleteTasks === numberOfCompleteTasks &&
        list.numberOfIncompleteTasks === numberOfIncompleteTasks
      ) {
        return empty()
      }

      return from(
        api.editTaskList({
          listId: action.payload.listId,
          data: {
            numberOfCompleteTasks,
            numberOfIncompleteTasks,
          },
        }),
      )
    }),
    mergeMap(() => empty()),
  )
}

export const rootEpic = combineEpics(
  taskListsEpic,
  firstTaskListEpic,
  updateTaskListCountsEpic,
)