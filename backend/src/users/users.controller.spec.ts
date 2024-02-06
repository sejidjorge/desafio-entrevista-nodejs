import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
	let usersController: UsersController;
	let usersService: UsersService;

	beforeEach(async () => {
		usersService = new UsersService();
		usersController = new UsersController();
	});

	describe("findAll", () => {})
	describe("findOne", () => {})
	describe("create", () => {})
	describe("update", () => {})
	describe("remove", () => {})
	describe("login", () => {})
});
