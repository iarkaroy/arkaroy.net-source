class Mat4 {

    constructor(arr) {
        this.array = new Float32Array(arr || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    translate(t) {
        var e = t.x
            , i = t.y
            , n = t.z;
        return this.array[12] += this.array[0] * e + this.array[4] * i + this.array[8] * n,
            this.array[13] += this.array[1] * e + this.array[5] * i + this.array[9] * n,
            this.array[14] += this.array[2] * e + this.array[6] * i + this.array[10] * n,
            this.array[15] += this.array[3] * e + this.array[7] * i + this.array[11] * n,
            this
    }

    scale(t) {
        return this.array[0] *= t.x,
            this.array[1] *= t.x,
            this.array[2] *= t.x,
            this.array[3] *= t.x,
            this.array[4] *= t.y,
            this.array[5] *= t.y,
            this.array[6] *= t.y,
            this.array[7] *= t.y,
            this.array[8] *= t.z,
            this.array[9] *= t.z,
            this.array[10] *= t.z,
            this.array[11] *= t.z,
            this
    }

    multiply(t) {
        var e = t.array
            , i = this.array[0]
            , n = this.array[1]
            , o = this.array[2]
            , s = this.array[3]
            , r = this.array[4]
            , a = this.array[5]
            , l = this.array[6]
            , c = this.array[7]
            , u = this.array[8]
            , h = this.array[9]
            , d = this.array[10]
            , f = this.array[11]
            , p = this.array[12]
            , g = this.array[13]
            , m = this.array[14]
            , v = this.array[15]
            , y = e[0]
            , w = e[1]
            , _ = e[2]
            , b = e[3];
        return this.array[0] = y * i + w * r + _ * u + b * p,
            this.array[1] = y * n + w * a + _ * h + b * g,
            this.array[2] = y * o + w * l + _ * d + b * m,
            this.array[3] = y * s + w * c + _ * f + b * v,
            y = e[4],
            w = e[5],
            _ = e[6],
            b = e[7],
            this.array[4] = y * i + w * r + _ * u + b * p,
            this.array[5] = y * n + w * a + _ * h + b * g,
            this.array[6] = y * o + w * l + _ * d + b * m,
            this.array[7] = y * s + w * c + _ * f + b * v,
            y = e[8],
            w = e[9],
            _ = e[10],
            b = e[11],
            this.array[8] = y * i + w * r + _ * u + b * p,
            this.array[9] = y * n + w * a + _ * h + b * g,
            this.array[10] = y * o + w * l + _ * d + b * m,
            this.array[11] = y * s + w * c + _ * f + b * v,
            y = e[12],
            w = e[13],
            _ = e[14],
            b = e[15],
            this.array[12] = y * i + w * r + _ * u + b * p,
            this.array[13] = y * n + w * a + _ * h + b * g,
            this.array[14] = y * o + w * l + _ * d + b * m,
            this.array[15] = y * s + w * c + _ * f + b * v,
            this
    }

    copy(t) {
        var e = t.array;
        return this.array[0] = e[0],
            this.array[1] = e[1],
            this.array[2] = e[2],
            this.array[3] = e[3],
            this.array[4] = e[4],
            this.array[5] = e[5],
            this.array[6] = e[6],
            this.array[7] = e[7],
            this.array[8] = e[8],
            this.array[9] = e[9],
            this.array[10] = e[10],
            this.array[12] = e[12],
            this.array[13] = e[13],
            this.array[14] = e[14],
            this.array[11] = e[11],
            this.array[15] = e[15],
            this
    }

    clone() {
        return new Mat4(this.array);
    }

}

export default Mat4;