import { getDataSchemaById } from "$lib/models/schemaModel";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async ({ params }) => {
    // Load a single data schema

    if (!params || isNaN(Number(params.schema))) {
        console.log(`Invalid schema path: ${params.schema}`);
        error(400, { message: "Invalid schema path" });
    }

    const s = await getDataSchemaById(Number(params.schema));
    console.log(s);
    return s;
};
