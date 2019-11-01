export interface ICanvas {
  getWidth() : number;
  getHeight() : number;
  onResolutionChanged(width: number, height: number): void;
}
