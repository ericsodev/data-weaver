import { getAllSchemas } from "$lib/db/schema";
import { listDataSchemas } from "$lib/models/schemaModel";
import type { LayoutServerLoad } from "../$types";

export const load: LayoutServerLoad = async () => {
    return { schemas: await listDataSchemas() };
};
