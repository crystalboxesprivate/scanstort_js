export interface IValueUpdatable {
  setValue(name: string, value: any): void
  setDirty(): void
}
