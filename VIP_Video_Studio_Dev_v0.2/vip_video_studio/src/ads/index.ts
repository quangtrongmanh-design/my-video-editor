import { AdManager } from "./AdManager";
import { MockOwnAdProvider } from "./MockOwnAdProvider";
import { NetworkAdProvider } from "./NetworkAdProvider";

export const adManager = new AdManager(
  new MockOwnAdProvider(),
  new NetworkAdProvider()
);