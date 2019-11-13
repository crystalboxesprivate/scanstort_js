import { IValueUpdatable } from "../interfaces/IValueUpdatable";

export abstract class IStateLoadable {
  constructor(obj: IValueUpdatable) {
    obj.registerMe(this)
  }
  abstract refreshState(): void
}
