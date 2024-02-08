import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";

describe("ReportsController", () => {
  let controller: ReportsController;
  let service: ReportsService;

  beforeEach(async () => {
    service = new ReportsService();
    controller = new ReportsController(service);
  });

  it("get general reports", async () => {
    expect(await controller.getReports()).toEqual({
      total_users: 2,
      total_cars: 10,
      total_bids: 34,
      total_purchases: 6,
    });
  });
});
