declare interface JRPCError {
    code: number;
    message: string;
    data?: string;
}

declare interface JRPC {
    urlEndPoint: string;
    authUserName: string;
    authPassword: string;
    callId: string;

    new (url: string): JRPC;

    setURL(url: string);
    setUserName(userName: string);
    setPassword(password: string);

    execute(methodName: string, params: any[], successHandler?: (result: any) => void, exceptionHandler?: (error: JRPCError) => void, modal?: string, textModal?: string): void;
    executeSync(methodName: string, params: any[]): any;
}

declare var jrpc: JRPC;

declare function _onRpcError(error: JRPCError);