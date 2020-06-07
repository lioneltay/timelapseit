import React from "react"

function App() {
  const cameraView = React.useRef<HTMLVideoElement>()
  const cameraSensor = React.useRef<HTMLCanvasElement>()
  const cameraOutput = React.useRef<HTMLImageElement>()
  const mediaRef = React.useRef<MediaStream>()

  React.useEffect(() => {
    async function go() {
      mediaRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })
    }

    go()

    if (cameraView.current && mediaRef.current) {
      cameraView.current.srcObject = mediaRef.current
    }
  })

  return (
    <div>
      <h1>TAKE PHOTO</h1>

      <video ref={cameraView} autoPlay playsInline />

      <canvas ref={cameraSensor} />

      <img ref={cameraOutput} />

      <button
        onClick={async () => {
          const mediaStream = mediaRef.current
          const img = cameraOutput.current
          if (mediaStream && img) {
            const mediaStreamTrack = mediaStream.getVideoTracks()[0]
            console.log("@@@@@@@@@", mediaStreamTrack.getCapabilities())
            const imageCapture = new ImageCapture(mediaStreamTrack)
            console.log("$$$$$$$$$", await imageCapture.getPhotoSettings())
            const blob = await imageCapture.takePhoto()
            img.src = URL.createObjectURL(blob)
            img.onload = () => {
              URL.revokeObjectURL(this.src)
            }
          }

          // if (
          //   cameraSensor.current &&
          //   cameraView.current &&
          //   cameraOutput.current
          // ) {
          //   cameraSensor.current.width = cameraView.current.videoWidth
          //   cameraSensor.current.height = cameraView.current.videoHeight
          //   cameraSensor.current
          //     .getContext("2d")
          //     ?.drawImage(cameraView.current, 0, 0)
          //   console.log("blob", cameraSensor.current.toBlob())
          //   cameraOutput.current.src = cameraSensor.current.toDataURL(
          //     "image/webp",
          //   )
          // }
        }}
      >
        Take a picture
      </button>
    </div>
  )
}

export default App
