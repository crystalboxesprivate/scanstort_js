export interface IValueUpdatable {
  setValue(name: string, value: any): void
  getValue(name: string): void
  setDirty(): void
}
