import React from "react"

function App() {
  const cameraView = React.useRef<HTMLVideoElement>()
  const cameraSensor = React.useRef<HTMLCanvasElement>()
  const cameraOutput = React.useRef<HTMLImageElement>()

  React.useEffect(() => {
    async function go() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      console.log(stream)

      if (cameraView.current) {
        cameraView.current.srcObject = stream
      }
    }

    go()
  })

  return (
    <div>
      <video ref={cameraView} autoPlay playsInline />

      <canvas ref={cameraSensor} />

      <img ref={cameraOutput} />

      <button
        onClick={() => {
          if (
            cameraSensor.current &&
            cameraView.current &&
            cameraOutput.current
          ) {
            cameraSensor.current.width = cameraView.current.videoWidth
            cameraSensor.current.height = cameraView.current.videoHeight
            cameraSensor.current
              .getContext("2d")
              ?.drawImage(cameraView.current, 0, 0)
            console.log("blob", cameraSensor.current.toBlob())
            cameraOutput.current.src = cameraSensor.current.toDataURL(
              "image/webp",
            )
          }
        }}
      >
        Take a picture
      </button>
    </div>
  )
}

export default App
