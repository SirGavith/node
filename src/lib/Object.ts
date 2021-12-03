interface Object {

    Log(): object
}

Object.prototype.Log = function() {
    console.log(this)
    return this.valueOf()
}