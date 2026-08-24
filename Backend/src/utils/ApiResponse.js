class ApiResponse {
    constructor(data = null, message = "Request Successful"){
        this.success = true;
        this.data = data;
        this.message = message;
    };
};

module.exports = ApiResponse;