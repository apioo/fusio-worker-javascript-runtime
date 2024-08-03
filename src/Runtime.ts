import {About} from "./generated/About";
import {Execute} from "./generated/Execute";
import {Response} from "./generated/Response";
import {Connector} from "./Connector";
import {Dispatcher} from "./Dispatcher";
import {Logger} from "./Logger";
import {ResponseBuilder} from "./ResponseBuilder";
import {ResponseHTTP} from "./generated/ResponseHTTP";

export class Runtime {

    public async get(): Promise<About> {
        return {
            apiVersion: "1.0.0",
            language: "javascript"
        };
    }

    public async run(actionFile: string, payload: Execute): Promise<Response> {
        const connector = new Connector(payload.connections || {});
        const dispatcher = new Dispatcher();
        const logger = new Logger();
        const responseBuilder = new ResponseBuilder();

        const callback = await Promise.resolve(require(actionFile));
        if (typeof callback !== 'function') {
            throw new Error('Provided action does not return a function');
        }

        const result = await callback(payload.request, payload.context, connector, responseBuilder, dispatcher, logger);

        let response: ResponseHTTP;
        if ('statusCode' in result) {
            response = result;
        } else {
            response = {
                statusCode: 204
            };
        }

        return {
            events: dispatcher.getEvents(),
            logs: logger.getLogs(),
            response: response,
        };
    }
}
