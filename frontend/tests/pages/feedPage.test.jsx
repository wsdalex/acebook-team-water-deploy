import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { FeedPage } from "../../src/pages/Feed/FeedPage";
import { getPosts } from "../../src/services/posts";
import { act } from "react-dom/test-utils";

// Mock the posts service
vi.mock("../../src/services/posts", () => ({
  getPosts: vi.fn(),
}));

// Mock the navigation
const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => navigateMock,
}));

// Mock the Post component
vi.mock("../../components/Post/Post", () => ({
  default: ({ post }) => (
    <div className="d-flex justify-content-center">
      <div className="fade toast show" role="alert" style={{ width: "60%" }}>
        <div className="toast-header">
          <img src={post.user_id.profileImage} className="rounded me-2 profile-image" alt="Profile" />
          <strong className="me-auto">{post.user_id.name}</strong>
        </div>
        <div className="toast-body">
          <article>{post.message}</article>
        </div>
      </div>
    </div>
  ),
}));

describe("Feed Page", () => {
  const mockPosts = [
    {
      _id: "12345",
      message: "Test Post 1",
      user_id: { 
        name: "test user",
        profileImage: "https://example.com/test-image.jpg"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify({ name: "Test User" }));
    vi.clearAllMocks();
  });

  test("It displays posts from the backend", async () => {
    localStorage.setItem("token", "testToken");
    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });
  
    await act(async () => {
      render(<FeedPage />);
    });
  
    await waitFor(() => {
      const postElement = screen.getByRole("article");
      expect(postElement).toHaveTextContent("Test Post 1");
      
      const userName = screen.getByText("test user");
      expect(userName).toBeInTheDocument();
      
      const profileImage = screen.getByAltText("Profile");
      expect(profileImage).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    });
  });

  test("It navigates to login if no token is present", async () => {
    await act(async () => {
      render(<FeedPage />);
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/login");
    });
  });

  test("It displays the user's profile image", async () => {
    localStorage.setItem("token", "testToken");
    getPosts.mockResolvedValue({ posts: mockPosts, token: "newToken" });

    await act(async () => {
      render(<FeedPage />);
    });

    await waitFor(() => {
      const profileImage = screen.getByAltText("Profile");
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    });
  });

  test("It displays the default profile image when user has no custom image", async () => {
    localStorage.setItem("token", "testToken");
    const postsWithoutImage = [
      {
        ...mockPosts[0],
        user_id: {
          ...mockPosts[0].user_id,
          profileImage: null
        }
      }
    ];
    getPosts.mockResolvedValue({ posts: postsWithoutImage, token: "newToken" });

    await act(async () => {
      render(<FeedPage />);
    });

    await waitFor(() => {
      const profileImage = screen.getByAltText("Profile");
      expect(profileImage).toBeInTheDocument();
      expect(profileImage).toHaveAttribute('src', 'holder.js/20x20?text=%20');
    });
  });
});