import { setupServer } from "msw/node";
import { mockTestsHandlers } from "./handlers";

const MswServer = setupServer(...mockTestsHandlers);

export { MswServer };
