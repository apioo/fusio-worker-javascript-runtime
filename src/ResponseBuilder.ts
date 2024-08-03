import {ResponseHTTP} from "./generated/ResponseHTTP";

export class ResponseBuilder {

    public build(statusCode: number, headers: Record<string, string>, body: any): ResponseHTTP {
        return {
            statusCode: statusCode,
            headers: headers,
            body: body,
        };
    }

}
