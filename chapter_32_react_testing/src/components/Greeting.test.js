import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Greeting from "./Greeting";
describe("Greeting component", () => {
  test("renders 'hello world' as a text", () => {
    //Arrange
    render(<Greeting />);

    //Act
    //... if we have anything

    //Assert
    const helloWorldElement = screen.getByText("Hello World!"); //second argument tells we want exact match or not, by default it is true
    expect(helloWorldElement).toBeInTheDocument(); //testing result value is passed whether dom node , string etc to expect is okay
  });

  test("renders 'good to see you' if the button was NOT clicked", () => {
    render(<Greeting />);
    const outputElement = screen.getByText("good to see you", { exact: false });
    expect(outputElement).toBeInTheDocument();
  });

  test("renders 'Changed!' if the button was clicked", () => {
    //Arrange
    render(<Greeting />);
    //Act -- button click is an ction
    const buttonElement = screen.getByRole('button');
    userEvent.click(buttonElement); //click event need one argument selector to select element
    //Assert
    const outputElement = screen.getByText('Changed!');
    expect(outputElement).toBeInTheDocument();
  });

  test("does not render 'good to see you' if the button was clicked", () => {
    //Arrange
    render(<Greeting />);
    //Act -- button click is an ction
    const buttonElement = screen.getByRole('button');
    userEvent.click(buttonElement); //click event need one argument selector to select element
    //Assert
    const outputElement = screen.queryByText("good to see you", { exact: false }); //since getter throw error, even if we check not found still test fails -- so instead of getter we will use query, query return null if not found
    expect(outputElement).not.toBeInTheDocument();
    //expect(outputElement).toBeNull();
  });
});
