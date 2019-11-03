import { IStateLoadable } from "../components/IStateLoadable";

export interface IValueUpdatable {
  setValue(name: string, value: any): void
  getValue(name: string): any
  registerMe(obj: IStateLoadable): any
  setDirty(): void
}
