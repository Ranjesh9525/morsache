export class ResponseClass {
  message: string;
  statusCode: number;
  success: boolean;
  data: any;
  constructor(
    message: string,
    statusCode: number,
    success: boolean,
    data?: any,
  ) {
    this.success = success;
    this.message = message;
    this.statusCode = statusCode;
      this.data = data;
    
  }
}

export function Response(
  message: string,
  statusCode: number,
  success: boolean,
  data?: any,){
    return JSON.parse(JSON.stringify(new ResponseClass(message, statusCode, success, data)))
  }
export function ErrorResponse(error:{message:string,statusCode:number}):{ success: boolean,data:any}{
  return { success:false, data:{error: { message: error.message, statusCode: error.statusCode} } }
}
  export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
  
    constructor(message: string, statusCode?: number) {
      super(message);
      this.statusCode = statusCode || 400;
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
// export class HttpException extends Error {
//     message: string;
//     errorCode: ErrorCode;
//     statusCode: number;
//     errors: any;
//     constructor(
//       message: string,
//       errorCode: ErrorCode,
//       statusCode: number,
//       errors?: any
//     ) {
//       super(message);
//       this.message = message;
//       this.statusCode = statusCode;
//       this.errorCode = errorCode;
//       this.errors = errors;
//     }
//   }
