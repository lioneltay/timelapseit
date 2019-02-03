import { createReducer } from "lib/rxstate"
import { state_s } from "services/state"
import { firestore, dataWithId } from "services/firebase"
import { map, switchMap, withLatestFrom } from "rxjs/operators"
import { from, of, Observable } from "rxjs"

import { user_s } from "services/state/modules/user"
import { tasks_s, selectTaskList } from "services/state/modules/list-view"

import {
  State,
  getTaskLists,
  createDefaultTaskList,
  editTaskList,
  setPrimaryTaskList,
} from "./index"

const createCurrentListsStream = (user_id: ID | null) =>
  new Observable<TaskList[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("task_lists")
      .where("user_id", "==", user_id)
      .onSnapshot(snapshot => {
        const lists: TaskList[] = snapshot.docs.map(dataWithId) as TaskList[]
        observer.next(lists)
      })
  })

const lists_s = user_s.pipe(
  switchMap(user => createCurrentListsStream(user ? user.uid : null)),
)

tasks_s.pipe(withLatestFrom(state_s)).subscribe(([tasks, state]) => {
  const {
    task_lists,
    list_view: { selected_task_list_id },
  } = state

  if (!task_lists || !selected_task_list_id || !tasks) {
    return
  }

  const selected_list = task_lists.find(
    list => list.id === selected_task_list_id,
  )

  if (!selected_list) {
    return
  }

  const non_archived_tasks = tasks.filter(task => !task.archived)

  const number_of_incomplete_tasks = non_archived_tasks.filter(
    task => !task.complete,
  ).length
  const number_of_complete_tasks = non_archived_tasks.filter(
    task => task.complete,
  ).length

  editTaskList({
    list_id: selected_task_list_id,
    list_data: {
      number_of_complete_tasks,
      number_of_incomplete_tasks,
    },
  })
})

export const reducer_s = createReducer<State>(
  lists_s.pipe(
    map(lists => {
      if (lists) {
        const primary = lists.find(list => list.primary)
        if (!primary) {
          const first_list = lists[0]
          if (first_list) {
            setPrimaryTaskList(first_list.id)
          } else {
            createDefaultTaskList()
          }
        }
      }

      return (state: State) => lists
    }),
  ),
)
