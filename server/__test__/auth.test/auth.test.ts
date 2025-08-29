import {
  Register,
  updateProfile,
  getProfile,
} from "../../src/controllers/auth.conroller";
import prisma from "../../src/utils/client";
import { getAuth, clerkClient } from "@clerk/express";
import { Request, Response } from "express";
import { describe, expect, it } from "@jest/globals";


// 🔹 Mock Prisma + Clerk
jest.mock("../src/utils/client", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock("@clerk/express", () => ({
  getAuth: jest.fn(),
  clerkClient: {
    users: {
      getUser: jest.fn(),
    },
  },
}));

// 🔹 Helper for mock res
const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.json = jest.fn().mockReturnValue(res);
  res.status = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAuth as jest.Mock).mockReturnValue({ userId: "test_user_123" });
  });

  it("should register a new user if not exists", async () => {
    const req = { body: { extraField: "test" } } as Partial<Request>;
    const res = mockResponse() as Response;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (clerkClient.users.getUser as jest.Mock).mockResolvedValue({
      emailAddresses: [{ emailAddress: "test@example.com" }],
      firstName: "John",
      lastName: "Doe",
      imageUrl: "https://example.com/image.jpg",
    });
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "123",
      clerkId: "test_user_123",
      email: "test@example.com",
    });

    await Register(req as Request, res, next);

    expect(prisma.user.create).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "User registered",
      })
    );
  });

  it("should return existing user if already registered", async () => {
    const req = {} as Partial<Request>;
    const res = mockResponse() as Response;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      clerkId: "test_user_123",
      email: "test@example.com",
    });

    await Register(req as Request, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "User already registered",
      })
    );
  });

  it("should fetch user profile", async () => {
    const req = {} as Partial<Request>;
    const res = mockResponse() as Response;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      clerkId: "test_user_123",
      email: "test@example.com",
    });

    await getProfile(req as Request, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "User found",
      })
    );
  });

  it("should update user profile", async () => {
    const req = { body: { username: "New Name" } } as Partial<Request>;
    const res = mockResponse() as Response;
    const next = jest.fn();

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      clerkId: "test_user_123",
    });
    (prisma.user.update as jest.Mock).mockResolvedValue({
      id: "123",
      username: "New Name",
    });

    await updateProfile(req as Request, res, next);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { clerkId: "test_user_123" },
      data: { username: "New Name" },
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 200,
        message: "User updated",
      })
    );
  });
});
