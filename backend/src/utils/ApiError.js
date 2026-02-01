export default class ApiError extends Error{
constructor(statusCode, errorCode){
    super(errorCode);
    this.statusCode = statusCode;
}
}