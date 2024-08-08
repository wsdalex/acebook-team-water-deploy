import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // maintains the navigation history in memory - good for testing when we don't want to manipulate the browser's URL
import Post from "../../src/components/Post/Post";

describe("Post", () => {

  const testProps = {
    _id: "123",
    message: "test message",
    user_id: { name: "test user", profileImage: "https://example.com/profile.jpg" },
    createdAt: new Date().toISOString(),
    numberOfLikes: 0,
    isLikedByUser: false,
    comments: []
  };

  test("displays the message as an article", () => {

    render(
      <MemoryRouter>
        <Post post={testProps} />
      </MemoryRouter>
    );

    const article = screen.getByRole("article");
    expect(article.textContent).toBe("test message");
  });

  test("displays the profile image", () => {
    render(
      <MemoryRouter>
        <Post post={testProps} />
      </MemoryRouter>
    );

    const profileImage = screen.getByAltText("Profile");
    expect(profileImage.src).toBe("https://example.com/profile.jpg");
  });

  test("displays default image when profile image is not provided", () => {
    const postWithoutProfileImage = {
      ...testProps,
      user_id: { ...testProps.user_id, profileImage: null }
    };

    render(
      <MemoryRouter>
        <Post post={postWithoutProfileImage} />
      </MemoryRouter>
    );

    const profileImage = screen.getByAltText("Profile");
    expect(profileImage.src).toContain("holder.js/20x20?text=%20");
  });
});
