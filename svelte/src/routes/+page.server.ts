import { type Actions, type Action, redirect } from "@sveltejs/kit";

const logout: Action = async ({ cookies }) => {
	// TODO: delete session from database
	console.log("this doesnt work")
	if (cookies.get("data-weaver-session")) {
		cookies.set("data-weaver-session", "", { path: "/" });
	}
	return redirect(303, "/");
}
export const actions: Actions = {
	logout
};

