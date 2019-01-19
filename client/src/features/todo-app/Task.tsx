import React, { forwardRef } from "react"
import styled from "styled-components"
import { Task } from "./types"

import IconButton from "@material-ui/core/IconButton"
import Fab from "@material-ui/core/Fab"

import Delete from "@material-ui/icons/Delete"
import Add from "@material-ui/icons/Add"
import DragHandle from "@material-ui/icons/DragHandle"
import Check from "@material-ui/icons/Check"
import Assignment from "@material-ui/icons/Assignment"
import { useAppState } from "./state"

import { Flipped } from "react-flip-toolkit"

import { useDraggable, useDropzone } from "@tekktekk/react-dnd"

const Container = styled.div`
  position: relative;
  max-width: 100%;

  display: grid;
  grid-template-columns: 0fr 1fr 0fr;
  align-items: center;

  padding-left: 8px;
  min-height: 72px;
`

const Overlay = styled.div`
  opacity: 0;
  pointer-events: none;

  display: none;

  body.hasHover ${Container}:hover & {
    display: flex;
    opacity: 1;
    pointer-events: all;
  }
`

const TaskDetails = styled.div`
  display: grid;
  padding: 0 18px;
  cursor: pointer;
`

const TaskTitle = styled.div`
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 2px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #262728;
`

const TaskNotes = styled.div`
  color: #9aa0a6;
  font-weight: 500;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export type Props = Stylable & {
  task: Task
}

const TaskItem: React.FunctionComponent<Props> = (
  { task, style, className },
  ref,
) => {
  const {
    touch_screen,
    selected_tasks,
    editing,
    actions: {
      startEditingTask,
      toggleTaskSelection,
      editTask,
      removeTask,
      moveTask,
      endTaskRepositioning,
    },
  } = useAppState()

  const selected = selected_tasks.findIndex(id => id === task.id) >= 0

  const {
    event_handlers: drag_handlers,
    state: { data, is_dragging },
  } = useDraggable({
    type: `task:${task.complete ? "complete" : "incomplete"}`,
    data: { task },
    onDragEnd: () => endTaskRepositioning(),
    renderDraggingItem: ({ data, dimensions }) => (
      <div
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        <TaskItemDisplay
          style={{ background: "grey" }}
          task={data.task}
          selected={selected}
          touch_screen={touch_screen}
          editing={editing}
        />
      </div>
    ),
  })

  const { event_handlers: drop_handlers } = useDropzone({
    type: `task:${task.complete ? "complete" : "incomplete"}`,
    onDragEnter: ({ data, type, updateData }) => {
      if (data.task.position === task.position) {
        return
      }
      moveTask(data.position, task.position)
      updateData({ task })
    },
  })

  return (
    <Flipped flipId={task.id}>
      <TaskItemDisplay
        {...drop_handlers()}
        style={{
          visibility:
            is_dragging && data.task.id === task.id ? "hidden" : "visible",
          pointerEvents:
            is_dragging && data.task.id === task.id ? "none" : "all",
        }}
        task={task}
        selected={selected}
        editing={editing}
        touch_screen={touch_screen}
        onIconClick={() => toggleTaskSelection(task.id)}
        onDetailsClick={() => startEditingTask(task.id)}
        onCompleteToggle={() => editTask(task.id, { complete: !task.complete })}
        onDelete={() => removeTask(task.id)}
        drag_handle_props={drag_handlers()}
      />
    </Flipped>
  )
}

type TaskItemDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
  task: Task
  touch_screen: boolean
  selected: boolean
  editing: boolean
  onIconClick?: () => void
  onDetailsClick?: () => void
  onCompleteToggle?: () => void
  onDelete?: () => void
  drag_handle_props?: React.HTMLAttributes<HTMLElement>
}

const TaskItemDisplay = forwardRef<HTMLDivElement, TaskItemDisplayProps>(
  (
    {
      task,
      touch_screen,
      selected,
      editing,
      onDetailsClick,
      onIconClick,
      onCompleteToggle,
      onDelete,
      drag_handle_props = {},
      ...rest
    },
    ref,
  ) => {
    return (
      <Container {...rest} ref={ref}>
        <Fab
          style={{
            borderRadius: editing ? "50%" : "5px",
            transition: "300ms",
            border: selected ? "1px solid blue" : "none",
            background: "white",
            marginLeft: 4,
            color: "#ccc",
          }}
          onClick={onIconClick}
          size="small"
        >
          <Assignment
            style={{
              transform: `scale(${editing ? 0.7 : 1})`,
              transition: "300ms",
            }}
          />
        </Fab>

        <TaskDetails onClick={onDetailsClick}>
          <TaskTitle
            className="fg-1"
            style={{
              textDecoration: task.complete ? "line-through" : "none",
              color: task.complete ? "#a3a3a3" : "black",
            }}
          >
            <strong>{task.position}</strong>
            {task.title}
          </TaskTitle>

          <TaskNotes>{task.notes}</TaskNotes>
        </TaskDetails>

        {editing || touch_screen ? null : (
          <Overlay>
            <IconButton onClick={onCompleteToggle}>
              {task.complete ? <Add /> : <Check />}
            </IconButton>

            <IconButton onClick={onDelete}>
              <Delete />
            </IconButton>
          </Overlay>
        )}

        {editing || !touch_screen || !task.complete ? null : (
          <IconButton onClick={onCompleteToggle}>
            <Add />
          </IconButton>
        )}

        {editing ? (
          <div {...drag_handle_props}>
            <IconButton disableRipple style={{ cursor: "move" }}>
              <DragHandle />
            </IconButton>
          </div>
        ) : null}
      </Container>
    )
  },
)

export default forwardRef(TaskItem)

// {/* <Container
//         {...drop_handlers()}
//         ref={ref}
//         className={className}
//         style={{
//           ...style,
//           visibility:
//             is_dragging && data.task.id === task.id ? "hidden" : "visible",
//           pointerEvents:
//             is_dragging && data.task.id === task.id ? "none" : "all",
//           backgroundColor: selected ? highlight_color : "transparent",
//         }}
//       >
//         <Fab
//           style={{
//             borderRadius: editing ? "50%" : "5px",
//             transition: "300ms",
//             border: selected ? "1px solid blue" : "none",
//             background: "white",
//             marginLeft: 4,
//             color: "#ccc",
//           }}
//           onClick={() => toggleTaskSelection(task.id)}
//           size="small"
//         >
//           <Assignment
//             style={{
//               transform: `scale(${editing ? 0.7 : 1})`,
//               transition: "300ms",
//             }}
//           />
//         </Fab>

//         <TaskDetails onClick={() => startEditingTask(task.id)}>
//           <TaskTitle
//             className="fg-1"
//             style={{
//               textDecoration: task.complete ? "line-through" : "none",
//               color: task.complete ? "#a3a3a3" : "black",
//             }}
//           >
//             <strong>{task.position}</strong>
//             {task.title}
//           </TaskTitle>

//           <TaskNotes>{task.notes}</TaskNotes>
//         </TaskDetails>

//         {editing || touch_screen ? null : (
//           <Overlay>
//             <IconButton
//               onClick={() => editTask(task.id, { complete: !task.complete })}
//             >
//               {task.complete ? <Add /> : <Check />}
//             </IconButton>

//             <IconButton onClick={() => removeTask(task.id)}>
//               <Delete />
//             </IconButton>
//           </Overlay>
//         )}

//         {editing || !touch_screen || !task.complete ? null : (
//           <IconButton
//             className={`fas fa-${task.complete ? "plus" : "check"}`}
//             onClick={() => editTask(task.id, { complete: !task.complete })}
//           />
//         )}

//         {editing ? (
//           <div {...drag_handlers()}>
//             <IconButton disableRipple style={{ cursor: "move" }}>
//               <DragHandle />
//             </IconButton>
//           </div>
//         ) : null}
//       </Container> */}
