import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";
import { createComment } from "../../src/services/comments";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

createFetchMock(vi).enableMocks();

describe("comments services", () => {
  test("createComment", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "comment created", token: "newToken" }),
      {
        status: 201,
      }
    );

    await createComment("testToken", "test comment", "test id");

    // This is an array of the arguments that were last passed to fetch
    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/comments`);
    expect(options.method).toEqual("POST");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
  });
});
