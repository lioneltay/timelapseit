import React from "react"
import { noopTemplate as css } from "lib/utils"
import { Switch, Route, Redirect } from "react-router-dom"

import ListPage from "./lists/Page"
import ProfilePage from "./profile/Page"

import { useTheme } from "theme"

import { GlobalComponents } from "components"

export default () => {
  const theme = useTheme()

  return (
    <div
      className="fd-c"
      css={css`
        background: ${theme.backgroundColor};
        min-height: 100vh;
      `}
    >
      <h1>Hello</h1>
    </div>
  )
}
