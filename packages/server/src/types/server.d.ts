// declare interface Context<T> {
//   data: T;
//   socket: Socket
// }

declare interface RouteHandler {
  (ctx: Context<any>): string | any;
}

declare type MiddlewareArgs = Array<any>;

declare type Routes = Record<string, RouteHandler | null>;

declare type MiddlewareNext = (err?: ExtendedError | undefined) => void;
