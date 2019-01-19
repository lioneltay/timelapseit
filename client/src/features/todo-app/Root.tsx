import React from "react"
import styled from "styled-components"

import Header from "./Header"

import TaskList from "./TaskList"
import TaskAdder from "./TaskAdder"
import EditModal from "./EditModal"
import CompleteTasks from "./CompleteTasks"

import { useAppState } from "./state"

import { background_color } from "./constants"

import { Flipper } from "react-flip-toolkit"
import { partition } from "ramda"
import prop from "ramda/es/prop"
import comparator from "ramda/es/comparator"
import { Task } from "./types"

const PageContainer = styled.div`
  background: ${background_color};
  min-height: 100vh;
`

const OldPageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 50px;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

const TaskPage: React.FunctionComponent = () => {
  const {
    tasks,
    editing_task_id,
    show_edit_modal,
    actions: { stopEditingTask, editTask },
  } = useAppState()

  const [complete, incomplete] = partition(task => task.complete, tasks)
  const process = (tasks: Task[]) =>
    tasks
      .sort(comparator((t1, t2) => t1.position > t2.position))
      .map(prop("id"))

  const flipKey =
    [...process(incomplete), ...process(complete)].join("") +
    complete.length +
    incomplete.length

  return (
    <Flipper flipKey={flipKey}>
      <PageContainer>
        <Header />

        <TaskAdder />

        <OldPageContainer>
          <Container>
            <TaskList
              style={{ background: "white" }}
              tasks={tasks.filter(task => !task.complete)}
            />

            <CompleteTasks tasks={tasks.filter(task => task.complete)} />
          </Container>

          {(() => {
            const task = tasks.find(task => task.id === editing_task_id)
            return task && editing_task_id ? (
              <EditModal
                initialValues={task}
                open={show_edit_modal}
                onClose={stopEditingTask}
                onSubmit={async values => {
                  await editTask(editing_task_id, values)
                  stopEditingTask()
                }}
              />
            ) : null
          })()}
        </OldPageContainer>
      </PageContainer>
    </Flipper>
  )
}

export default TaskPage
