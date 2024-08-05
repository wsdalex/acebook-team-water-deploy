import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect} from "vitest";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

import { AddComment } from "../../src/pages/AddComment/AddComment";
import { createComment } from "../../src/services/comments";

vi.mock("react-router-dom", () => {
    const navigateMock = vi.fn();
    const useNavigateMock = () => navigateMock; // Create a mock function for useNavigate
    return { useNavigate: useNavigateMock };
  });

vi.mock("../../src/services/comments", () => {
    const createCommentMock = vi.fn();
    return { createComment: createCommentMock};
})

const completeCommentForm = async () => {
    const user = userEvent.setup();
    
    const commentInput = screen.getByPlaceholderText("Add comment...");
    const submitButton = screen.getByRole("button");

    await user.type(commentInput, "Test Comment")
    await user.click(submitButton)
}

describe("AddComment", () => {

    beforeEach(() => {
        vi.resetAllMocks();
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("post_id");

      });

    test("form renders correctly", () => {
        
        render(<AddComment/>)

        const label = screen.getByLabelText("Add a comment:")
        expect(label).toBeDefined();

        const messageInput = screen.getByPlaceholderText("Add comment...");
        expect(messageInput).toBeDefined();

        const submitButton = screen.getByRole("button");
        expect(submitButton).toBeDefined();

        fireEvent.change(messageInput, { target: { value: "Test message" } });
        expect(messageInput.value).toBe("Test message");
    })

    test("allows user to create a comment and redirects to posts", async () => {
        window.localStorage.setItem("token", "testToken");
        window.localStorage.setItem("post_id", "testId");
        render(<AddComment/>)

        await completeCommentForm();

        expect(createComment).toHaveBeenCalledWith("testToken", "Test Comment", "testId")
        const navigateMock = useNavigate();
        expect(navigateMock).toHaveBeenCalledWith("/posts");


    })
})