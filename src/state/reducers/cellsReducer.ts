import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
	};
}

const initailState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};

const reducer = (
	state: CellsState = initailState,
	action: Action
): CellsState => {
	return state;
};

export default reducer;
