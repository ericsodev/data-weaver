export class InstanceData {
  public id!: string;
  public instanceId!: string;
  public attributes!: Record<string, boolean | number | string | null>;
}

type NonFunctionProperty<T> = Pick<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
>;
export type InstanceDataDTO = NonFunctionProperty<InstanceData>;
