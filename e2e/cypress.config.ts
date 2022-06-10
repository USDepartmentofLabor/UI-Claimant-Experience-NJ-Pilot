import { defineConfig } from "cypress";
// @ts-ignore todo: figure out how to not have to do this
import { lighthouse, pa11y, prepareAudit } from "cypress-audit";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on(
        "before:browser:launch",
        (
          browser = {
            name: "",
            family: "chromium",
            channel: "",
            displayName: "",
            version: "",
            majorVersion: "",
            path: "",
            isHeaded: false,
            isHeadless: false,
          },
          launchOptions
        ) => {
          prepareAudit(launchOptions);
        }
      );

      on("task", {
        lighthouse: lighthouse((lighthouseReport: any) => {
          console.log(lighthouseReport); // raw lighthouse report
        }),
        pa11y: pa11y((pa11yReport: any) => {
          console.log(pa11yReport); // raw pa11y report
        }),
      });
    },
  },
});
