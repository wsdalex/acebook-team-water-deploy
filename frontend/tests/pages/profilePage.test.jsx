import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { ProfilePage } from "../../src/pages/ProfilePage/ProfilePage";
import { getUserPosts } from "../../src/services/posts";
import { act } from "react-dom/test-utils";

// Mock the posts service
vi.mock("../../src/services/posts", () => ({
    getUserPosts: vi.fn(),
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
        <div data-testid="post">
            <p>{post.message}</p>
            <p>By: {post.user_id.name}</p>
            <img src={post.imageUrl} alt="Post" />
        </div>
    ),
}));

describe("Profile Page", () => {
    const mockPosts = [
        {
            _id: "12345",
            message: "Test User Post",
            user_id: { _id: "userId", name: "Test User", email: "test@example.com" },
            imageUrl: "testImage.jpg",
            comments: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem("user", JSON.stringify({ name: "Test User" }));
        vi.clearAllMocks();
    });

    test("It displays user posts from the backend", async () => {
        localStorage.setItem("token", "testToken");
        getUserPosts.mockResolvedValue(mockPosts);

        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            const post = screen.getByTestId("post");
            expect(post).toHaveTextContent("Test User Post");
            expect(post).toHaveTextContent("By: Test User");
            expect(post.querySelector('img')).toHaveAttribute('src', 'testImage.jpg');
        });
    });

    test("It displays a message when there are no posts", async () => {
        localStorage.setItem("token", "testToken");
        getUserPosts.mockResolvedValue([]);

        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            const message = screen.getByText("No posts to display");
            expect(message).toBeInTheDocument();
        });
    });

    test("It navigates to login if no token is present", async () => {
        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith("/login");
        });
    });

    test("It displays an error message when getUserPosts fails", async () => {
        localStorage.setItem("token", "testToken");
        getUserPosts.mockRejectedValue(new Error("Failed to fetch posts"));

        await act(async () => {
            render(<ProfilePage />);
        });

        await waitFor(() => {
            const errorMessage = screen.getByText("error:Failed to fetch posts");
            expect(errorMessage).toBeInTheDocument();
        });
    });
});