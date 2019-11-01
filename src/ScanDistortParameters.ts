import { ICurve, CurvePoint } from "./interfaces/ICurve"


class DistortParameterGroup {
  weight: number
  weightByTime: ICurve
}

class SineDistort extends DistortParameterGroup {

}

class DirectionalDistort extends DistortParameterGroup {

}

class NoiseDistort extends DistortParameterGroup {

}

export class ScanDistortParameters {
  sine: SineDistort
  dir: DirectionalDistort
  noise: NoiseDistort
}
