import ContentPage from "./ContentPage";
import { ThemeProvider } from "./context/ThemeProvider";

function App() {
	return (
		<ThemeProvider>
			<div>
				<main className="flex-1">
					<ContentPage />
				</main>
			</div>
		</ThemeProvider>
	);
}

export default App;
