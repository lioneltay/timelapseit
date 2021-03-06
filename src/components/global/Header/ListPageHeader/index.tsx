import React, { Fragment } from "react"
import { noopTemplate as css } from "lib/utils"

import { IconButton } from "@material-ui/core"
import {
  SwapHorizIcon,
  AddIcon,
  CheckIcon,
  DeleteIcon,
  NotificationsIcon,
  MoreVertIcon,
} from "lib/icons"

import { IconButtonMenu } from "lib/components"
import TaskAdder from "./TaskAdder"
import HeaderBase from "components/global/Header/components/HeaderBase"

import { useSelector, useActions } from "services/store"

import {
  createTaskNotification,
  createTaskNotifications,
} from "services/notifications"

import { EditListModal } from "components"

export default () => {
  const {
    taskLists,
    allSelectedTasksComplete,
    allSelectedTasksIncomplete,
    selectedTaskList,
    multiselect,
    numberOfSelectedTasks,
    selectedTasks,
    numberOfTasks,
  } = useSelector((state, s) => ({
    taskLists: state.app.taskLists || [],
    allSelectedTasksComplete: s.listPage.allSelectedTasksComplete(state),
    allSelectedTasksIncomplete: s.listPage.allSelectedTasksInComplete(state),
    selectedTaskList: s.app.selectedTaskList(state),
    multiselect: state.listPage.multiselect,
    selectedTasks: s.listPage.selectedTasks(state),
    numberOfSelectedTasks: state.listPage.selectedTaskIds.length,
    numberOfTasks: state.listPage.tasks?.length ?? 0,
  }))

  const {
    completeSelectedTasks,
    decompleteSelectedTasks,
    deleteSelectedTasks,
    moveSelectedTasks,
    setMultiselect,
  } = useActions("listPage")

  const [showEditListModal, setShowEditListModal] = React.useState(false)

  return (
    <React.Fragment>
      <div
        css={css`
          position: sticky;
          top: 0;
          z-index: 1000;
        `}
      >
        <HeaderBase
          title={selectedTaskList?.name ?? ""}
          numberOfSelectedTasks={numberOfSelectedTasks}
          numberOfTasks={numberOfTasks}
          multiselect={multiselect}
          onEndMultiselect={() => setMultiselect(false)}
          actions={
            <React.Fragment>
              <IconButtonMenu
                icon={<MoreVertIcon />}
                items={[
                  {
                    label: "Edit",
                    action: () => setShowEditListModal(true),
                  },
                ]}
              />
            </React.Fragment>
          }
          multiselectActions={
            <Fragment>
              {allSelectedTasksIncomplete ? (
                <IconButton
                  onClick={() => {
                    selectedTasks.forEach(createTaskNotification)
                    setMultiselect(false)
                  }}
                >
                  <NotificationsIcon />
                </IconButton>
              ) : null}

              {allSelectedTasksComplete || allSelectedTasksIncomplete ? (
                <IconButton
                  onClick={
                    allSelectedTasksIncomplete
                      ? completeSelectedTasks
                      : decompleteSelectedTasks
                  }
                >
                  {allSelectedTasksIncomplete ? <CheckIcon /> : <AddIcon />}
                </IconButton>
              ) : null}

              <IconButtonMenu
                icon={<SwapHorizIcon />}
                items={taskLists
                  .filter((list) => list.id !== selectedTaskList?.id)
                  .map((list) => ({
                    label: list.name,
                    action: () => moveSelectedTasks({ listId: list.id }),
                  }))}
              />

              <IconButton onClick={deleteSelectedTasks}>
                <DeleteIcon />
              </IconButton>
            </Fragment>
          }
        />
        <TaskAdder />
      </div>

      {selectedTaskList ? (
        <EditListModal
          onClose={() => setShowEditListModal(false)}
          open={showEditListModal}
          initialValues={selectedTaskList}
          listId={selectedTaskList.id}
        />
      ) : null}
    </React.Fragment>
  )
}
