import React, { useState } from "react"
import styled from "styled-components"
import { Transition } from "react-spring"

import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Clear from "@material-ui/icons/Clear"
import Modal from "./Modal"
import { useAppState } from "../state"
import { error_color, grey_text } from "../constants"

const Container = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background: ${error_color};
  color: white;
  padding: 5px;
`

const Action = styled.span`
  cursor: pointer;
  text-decoration: underline;
  font-weight: 500;
`

const X = styled(Clear)`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
` as typeof Clear

const WarningFooter: React.FunctionComponent = () => {
  const {
    user,
    show_warning_footer,
    actions: { signInWithGoogle, setShowWarningFooter },
  } = useAppState()

  const [show_modal, setShowModal] = useState(false)

  return (
    <Transition
      items={show_warning_footer && !user}
      from={{ transform: "translateY(100%)" }}
      enter={{ transform: "translateY(0)" }}
      leave={{ transform: "translateY(100%)" }}
    >
      {show => style =>
        show ? (
          <Container style={style}>
            <Typography variant="caption" color="inherit" align="center">
              <Action onClick={signInWithGoogle}>Sign in</Action> to backup and
              sync your notes across devices.{" "}
              <Action onClick={() => setShowModal(true)}>Learn more.</Action>
            </Typography>
            <X fontSize="small" onClick={() => setShowWarningFooter(false)} />

            <Modal
              style={{ width: 500, maxWith: "100%" }}
              open={show_modal}
              onClose={() => setShowModal(false)}
              actions={
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowModal(false)}
                >
                  Got it
                </Button>
              }
              title="You are not signed in"
            >
              <Typography style={{ color: grey_text }}>
                As you are not signed in your tasks are stored and only
                accessible directly on your device. Your data could be lost if
                you delete the app damage your phone.
                <div className="my-2">
                  <Action onClick={signInWithGoogle}>Sign in</Action> now to
                  enable:
                </div>
                <ul className="my-2" style={{ listStyle: "disc inside" }}>
                  <li>Access to your tasks across all your devices</li>
                  <li>Automatic backups of your tasks so they won't be lost</li>
                </ul>
              </Typography>
            </Modal>
          </Container>
        ) : null}
    </Transition>
  )
}

export default WarningFooter
