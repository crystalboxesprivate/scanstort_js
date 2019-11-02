import { Parameters } from './Parameters';

export function packState(parameters: Parameters):string {
  let arr = new TextEncoder().encode(JSON.stringify(parameters))
  arr.reverse()
  let packedState = ''
  for (let byte of arr) {
    packedState += byte + '|'
  }
  packedState = packedState.substring(0, packedState.length-1)
  return packedState
}

export function unpackState(state: string):string {
   let parts = state.split('|')
   let arr = new Uint8Array(parts.length)
   for (let x = 0; x < parts.length; x++) {
     arr[x] = parseInt(parts[x])
   }
   arr.reverse()
   return new TextDecoder().decode(arr)
}
