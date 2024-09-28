import axios from "axios";
import { error } from "console";
import { ActionType } from "../action-types";
import { Action } from "../actions";

const searchRepositories = (term: string) => {
	return async (dispatch: any) => {
		dispatch({
			type: ActionType.SEARCH_REPOSITORIES,
		});

		try {
		} catch (err: any) {
			dispatch({
				type: ActionType.SEARCH_REPOSITORIES_ERROR,
				payload: err.message,
			});
		}
	};
};
