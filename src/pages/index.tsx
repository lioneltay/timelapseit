import React from "react"
import { noopTemplate as css } from "lib/utils"
import { Switch, Route, Redirect } from "react-router-dom"

import { useTheme } from "theme"

import { GlobalComponents } from "components"

export default () => {
  return (
    <div
      className="fd-c"
      css={css`
        min-height: 100vh;
      `}
    >
      <h1>Hello</h1>
    </div>
  )
}
