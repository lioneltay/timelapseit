import { firebase, firestore, dataWithId } from "services/firebase"
import { noUndefinedValues } from "lib/utils"

export const getTaskList = async (listId: ID): Promise<TaskList> => {
  const x = await firestore
    .collection("taskList")
    .doc(listId)
    .get()
    .then(dataWithId)

  return x as TaskList
}

type AddTaskListInput = Omit<
  TaskList,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "numberOfIncompleteTasks"
  | "numberOfCompleteTasks"
>
export const createTaskList = async (
  list: AddTaskListInput,
): Promise<TaskList> => {
  return firestore
    .collection("taskList")
    .add({
      numberOfIncompleteTasks: 0,
      numberOfCompleteTasks: 0,
      ...list,
      primary: list.primary ?? false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as TaskList
    })
    .catch(e => {
      console.log(e)
      return e
    })
}

type EditTaskListInput = {
  listId: ID
  data: Partial<Omit<TaskList, "id" | "createdAt" | "updatedAt">>
}
export const editTaskList = async ({
  listId,
  data,
}: EditTaskListInput): Promise<TaskList> => {
  console.log("editing", listId, data)
  await firestore
    .collection("taskList")
    .doc(listId)
    .update(
      noUndefinedValues({
        ...data,
        updatedAt: Date.now(),
      }),
    )

  const editedList = await firestore
    .collection("taskList")
    .doc(listId)
    .get()
    .then(dataWithId)

  return editedList as TaskList
}

export const deleteTaskList = async (listId: ID): Promise<ID> => {
  const tasks = await firestore
    .collection("task")
    .where("listId", "==", listId)
    .get()
    .then(x => x.docs.map(dataWithId) as Task[])

  const batch = firestore.batch()

  batch.delete(firestore.collection("taskList").doc(listId))
  tasks.forEach(task => batch.delete(firestore.collection("task").doc(task.id)))

  await batch.commit()
  return listId
}

export const getTaskLists = async (userId: ID | null): Promise<TaskList[]> => {
  return firestore
    .collection("taskList")
    .where("userId", "==", userId)
    .get()
    .then(res => res.docs.map(dataWithId) as TaskList[])
}

type SetPrimaryTaskListInput = {
  userId: ID | null
  listId: ID
}
export const setPrimaryTaskList = async ({
  userId,
  listId,
}: SetPrimaryTaskListInput) => {
  const taskLists = await getTaskLists(userId)

  const batch = firestore.batch()

  batch.update(firestore.collection("taskList").doc(listId), {
    primary: true,
  })

  taskLists
    .filter(list => list.id !== listId && list.primary)
    .forEach(list => {
      batch.update(firestore.collection("taskList").doc(list.id), {
        primary: false,
      })
    })

  return batch.commit()
}
