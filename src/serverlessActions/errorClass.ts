export class ErrorClass extends Error {
    error: any;
    constructor(message: string, error: any) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.error = error;
        
    //     if (error instanceof ValidationError) {
    //         this.message = "Invalid input. Please check your data.";
    //     } else if (error instanceof DatabaseError) {
    //         this.message = "Database operation failed. Please try again later.";
    //     } else if (error instanceof AuthenticationError) {
    //         this.message = "Authentication failed. Please log in again.";
    //     } else if (error instanceof AuthorizationError) {
    //         this.message = "You are not authorized to perform this action.";
    //     } else if (error instanceof NetworkError) {
    //         this.message = "Network error. Please check your internet connection.";
    //     } else {
    //         this.message = "An unexpected error occurred. Please contact support.";
    //     }
    // }
}}