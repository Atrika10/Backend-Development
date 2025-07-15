class ApiResponse {
    constructor(statusCode, message ="Success", success = true, data){
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode >= 200 && statusCode < 400 ? true : false;
        this.data = data || null; 
    }
}

export default ApiResponse;