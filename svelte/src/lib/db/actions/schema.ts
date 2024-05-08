export type Schema = {
    id: string
    name: string
}

// NOTE: much thanks to https://byby.dev/js-slugify-string
function slugify(str: string) {
    return String(str)
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
}

const schemaDb: Schema[] = [
    { id: "introduction", name: "Introduction" },
    { id: "projects", name: "Projects" },
    { id: "experience", name: "Experience" },
]

export function insertSchema(name: string): Promise<Schema | null> {
    return new Promise(resolve => setTimeout(() => {
        // NOTE: Ensure name is unique -- case insensitive

        if (schemaDb.filter(s => s.name.toLowerCase() === name.toLowerCase()).some(Boolean)) {
            return resolve(null)
        }

        const newSchema = { name, id: slugify(name) }

        schemaDb.push(newSchema)

        return resolve(newSchema)


    }, 500))
}

export function getAllSchemas(): Promise<Schema[] | null> {
    return new Promise(resolve => setTimeout(() => {

        return resolve(schemaDb.map(s => ({ ...s }))) // Clone DB

    }, 500))
}

export function getSchema(id: string): Promise<Schema | null> {
    return new Promise(resolve => setTimeout(() => {

        return resolve(schemaDb.find(s => s.id === id) ?? null);


    }, 500))

}

