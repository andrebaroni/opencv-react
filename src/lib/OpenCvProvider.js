import * as React from 'react'

const OpenCvContext = React.createContext()

const { Consumer: OpenCvConsumer, Provider } = OpenCvContext

export { OpenCvConsumer, OpenCvContext }

const scriptId = 'opencv-react'
const moduleConfig = {
  wasmBinaryFile: 'opencv_js.wasm',
  usingWasm: true
}

export const OpenCvProvider = ({ openCvPath, children, onLoad }) => {
  const [loaded, setLoaded] = React.useState(false)

  const handleOnLoad = React.useCallback(() => {
    if (onLoad) {
      onLoad(window.cv)
    }
    setLoaded(true)
  }, [])

  React.useEffect(() => {
    if (document.getElementById(scriptId) || window.cv) {
      setLoaded(true)
      return
    }

    // https://docs.opencv.org/3.4/dc/de6/tutorial_js_nodejs.html
    // https://medium.com/code-divoire/integrating-opencv-js-with-an-angular-application-20ae11c7e217
    // https://stackoverflow.com/questions/56671436/cv-mat-is-not-a-constructor-opencv
    moduleConfig.onRuntimeInitialized = handleOnLoad
    window.Module = moduleConfig

    const generateOpenCvScriptTag = () => {
      const js = document.createElement('script')
      js.id = scriptId
      js.src = openCvPath || 'https://docs.opencv.org/3.4.13/opencv.js'

      js.nonce = true
      js.defer = true
      js.async = true

      return js
    }

    document.body.appendChild(generateOpenCvScriptTag())
  }, [openCvPath, handleOnLoad])

  const memoizedProviderValue = React.useMemo(
    () => ({ loaded, cv: window.cv }),
    [loaded]
  )

  return <Provider value={memoizedProviderValue}>{children}</Provider>
}
