import * as functions from "firebase-functions"

export const ping = functions.https.onCall(
  async (data: CallableFunction.SendFeedbackData, context) => {
    return "pong"
  },
)
