class ApiResponse {
    constructor(data = null, message = "Request Successfull"){
        this.success = true;
        this.data = data;
        this.message = message;
    };
};

module.exports = ApiResponse;