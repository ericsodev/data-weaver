import { getAllSchemas } from "$lib/db/schema";
import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async () => {
	return { schemas: await getAllSchemas() }
}
