import { XY } from "./XY";

export class Cx extends XY {
    get Re() { return this.X }
    set Re(re: number) { this.a = re }
    get Im() { return this.Y }
    set Im(im: number) { this.b = im }


}