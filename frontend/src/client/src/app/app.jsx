import {CustomThemeProvider} from "./theme/index";
import {CustomRouterProvider} from "./router/index";

function App() {

  return (
    <>
      <CustomThemeProvider>
          <CustomRouterProvider />
      </CustomThemeProvider>
    </>
  )
}

export default App
