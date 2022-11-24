import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react"

// 2. Add your color mode config
const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
}

// 3. extend the theme
const theme = extendTheme({ config })

export default theme

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<App />
		</ChakraProvider>
	</React.StrictMode>
)
