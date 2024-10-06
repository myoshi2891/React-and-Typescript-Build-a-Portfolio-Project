import "bulmaswatch/superhero/bulmaswatch.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import CellList from "./components/cell-list";
import { store } from "./state";

const App = () => {
	return (
		<Provider store={store}>
			<div>
				<CellList />
			</div>
		</Provider>
	);
};

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
