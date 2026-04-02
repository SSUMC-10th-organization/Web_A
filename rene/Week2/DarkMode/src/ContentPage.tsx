import Navbar from "./components/Navbar";
import ThemeContent from "./components/ThemeContent";
import { ThemeProvider } from "./context/ThemeProvider";

export default function ContentPage() {
	return (
		<ThemeProvider>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-1 w-full">
					<ThemeContent />
				</main>
			</div>
		</ThemeProvider>
	);
}
