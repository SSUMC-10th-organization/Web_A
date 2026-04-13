import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(
// 	<StrictMode>
// 		<App />
// 	</StrictMode>,
// );

// 수정 후 (더 안전한 방식)
const container = document.getElementById("root");
if (container) {
	createRoot(container).render(
		<StrictMode>
			<App />
		</StrictMode>,
	);
}
