import React, { Fragment } from "react"
import { noopTemplate as css } from "lib/utils"

import { IconButtonMenu } from "lib/components"

import { IconButton } from "@material-ui/core"
import { Delete, DeleteSweep, SwapHoriz } from "@material-ui/icons"

import { HeaderBase } from "components"

import { useActions, useSelector } from "services/store"

export default () => {
  const {
    deleteSelectedTasks,
    emptyTrash,
    moveSelectedTasks,
    setMultiselect,
  } = useActions("trashPage")

  const { taskLists, multiselect, numberOfSelectedTasks } = useSelector(
    state => ({
      taskLists: state.app.taskLists ?? [],
      multiselect: state.trashPage.multiselect,
      numberOfSelectedTasks: state.trashPage.trashTasks?.length ?? 0,
    }),
  )

  return (
    <HeaderBase
      css={css`
        position: sticky;
        top: 0;
        z-index: 1000;
      `}
      title="Trash"
      numberOfSelectedTasks={numberOfSelectedTasks}
      multiselect={multiselect}
      onEndMultiselect={() => setMultiselect(false)}
      multiselectActions={
        <Fragment>
          <IconButtonMenu
            icon={<SwapHoriz />}
            items={taskLists.map(list => ({
              label: list.name,
              action: () => moveSelectedTasks({ listId: list.id }),
            }))}
          />

          <IconButton onClick={deleteSelectedTasks}>
            <Delete />
          </IconButton>
        </Fragment>
      }
      actions={
        <IconButton onClick={emptyTrash}>
          <DeleteSweep />
        </IconButton>
      }
    />
  )
}