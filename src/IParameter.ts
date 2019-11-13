export interface IParameter {
   setDirty() : void;
   isChanged() : boolean;

   get(option?:any): any
   set(value: any): void 
}
