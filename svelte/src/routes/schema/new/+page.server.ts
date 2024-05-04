import { redirect, type Action, type Actions, error } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";
import { insertSchema } from "$lib/db/schema";
import { schemaFormSchema } from "../schema";

export const load: PageServerLoad = async ({ request }) => {
	const params = new URLSearchParams(request.url.toString())
	const name = params.get("name")


	const form = await superValidate(request, zod(schemaFormSchema));
	form.data.name = name ? name : "";
	return { form }


}

const createSchemaHandler: Action = async ({ request }) => {
	const form = await superValidate(request, zod(schemaFormSchema));
	console.log(form)
	if (!form.valid) {
		return error(400, "Invalid form")
	}

	// TODO: access DB, create, redirect to schema page
	const data = form.data;
	const schema = await insertSchema(data.name);

	if (schema) {
		return redirect(300, `/schema/schema_${schema.id}`)
	}
	return error(409, "Schema exists")

}
export const actions: Actions = {
	default: createSchemaHandler
}


