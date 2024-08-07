import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // maintains the navigation history in memory - good for testing when we don't want to manipulate the browser's URL
import Post from "../../src/components/Post/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = { _id: "123", message: "test message", user_id: {name: "test user"}};

    render(
      <MemoryRouter>
        <Post post={testPost} />
      </MemoryRouter>
    );

    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test message");
  });
});
