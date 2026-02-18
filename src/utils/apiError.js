class apiError extends Error {
    constructor(
        statusCode,
        message = "Something went wronng",
        errors = [],
        statck = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
        if(statck){
            this.ststck
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export{apiError}