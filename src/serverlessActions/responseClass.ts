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
