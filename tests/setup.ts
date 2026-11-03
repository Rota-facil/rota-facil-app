import { MswServer } from "./mocks/server";

beforeAll(() => {
  MswServer.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  MswServer.resetHandlers();
});

afterAll(() => {
  MswServer.close();
});
