import type { AttributePostPayload } from '$lib/validationSchemas/api/schema';
import type { PageData } from './$types';

export type AttributeData = Omit<AttributePostPayload, 'id'>;

export type AttributeFormState = {
  id?: string;
  current: AttributeData;
  modified: AttributeData;
  delete: boolean;
};
export function createAttributeState(initial: PageData['schema']['attributes']) {
  let attributes: AttributeFormState[] = $state(
    initial?.map((attr) => {
      return {
        id: attr.id,
        current: { ...attr },
        modified: { ...attr },
        delete: false
      };
    }) ?? []
  );

  function modifyAttribute(data: Partial<AttributeData>, index: number) {
    if (!attributes[index]) return;
    attributes[index].modified = { ...attributes[index].modified, ...data };
  }

  function addAttribute() {
    const blankAttr: AttributePostPayload = { name: '', type: 'string', required: false };
    attributes.push({
      current: blankAttr,
      modified: blankAttr,
      delete: false
    });
  }
  attributes = [...attributes];

  function toggleDelete(index: number) {
    // If entry is not in database, remove locally
    if (attributes[index].id) {
      attributes[index].delete = !attributes[index].delete;
      return;
    }

    attributes.splice(index, 1);
  }

  return {
    get attributes() {
      return attributes;
    },
    addAttribute,
    modifyAttribute,
    toggleDelete
  };
}
