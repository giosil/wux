declare interface JRPCError {
    code: number;
    message: string;
    data?: string;
}

declare class JRPC {
    urlEndPoint: string;
    authUserName: string;
    authPassword: string;
    authToken: string;
    callId: string;

    constructor(url: string);

    setURL(url: string): void;
    setUserName(userName: string): void;
    setPassword(password: string): void;
    setToken(token: string): void;

    execute(methodName: string, params: any[], successHandler?: (result: any) => void, exceptionHandler?: (error: JRPCError) => void): void;
    executeSync(methodName: string, params: any[]): any;
}

declare function _onRpcError(error: JRPCError): void;