import { render, screen } from "@testing-library/react";
import Async from "./Async";
describe("Async Test", () => {
  test("renders posts if rquest succeeds", async () => {
    window.fetch = jest.fn();
    window.fetch.mockResolvedValueOnce({
        json : async () => [{id : "p1", title : "Welcome first page!"}]
    });
    render(<Async />);

    //Assert
    const listItemElements = await screen.findAllByRole("listitem", {}, {timeout : 2000});
    expect(listItemElements).not.toHaveLength(0);
  });
});
