import type { AttributePostPayload } from '$lib/validationSchemas/schemaPost';
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
    initial.map((attr) => {
      return {
        id: attr.id,
        current: { ...attr },
        modified: { ...attr },
        delete: false
      };
    })
  );

  function modifyAttribute(data: Partial<AttributeData>, index: number) {
    attributes[index] = { ...attributes[index], ...data };
    attributes = [...attributes];
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
    attributes[index].delete = true;
    attributes = [...attributes];
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
