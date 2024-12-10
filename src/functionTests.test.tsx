import {describe, expect, test} from '@jest/globals';
import { render, screen, fireEvent } from "@testing-library/react";
import { ResultPage } from "./resultPage";
import { GptResponse } from "./gptResponse";
import { NotifBell } from "./notification";
import { QuizInterface } from './interface';
import { useNavigate } from 'react-router-dom';
import { HomeBackground } from './homeBackground';

jest.mock("./gptResponse", () => ({
  GptResponse: jest.fn(() => <div>Mocked GptResponse</div>),
}));

jest.mock("./db", () => ({
  Database: jest.fn(),
}));

beforeEach(() => {
  jest.spyOn(sessionStorage, 'getItem').mockImplementation(() =>
    JSON.stringify({
      1: "Test answer 1",
      2: "Test answer 2",
    })
  );
});

describe('resultTests', () => { 
  test("renders 'collect evidence' message when basicComplete is false", () => {
    render(<ResultPage basicComplete={false} detailedComplete={false} apiKey="test" answerVals={[]} />)
    const linkElement = screen.getByText(/Go collect some evidence, Detective!/i);
    expect(linkElement).toBe(true)
  })

  test("renders 'question witnesses' message when basicComplete is false", () => {
    render(<ResultPage basicComplete={false} detailedComplete={false} apiKey="test" answerVals={[]} />)
    const linkElement = screen.getByText(/You still have witnesses to question!/i);
    expect(linkElement).toBe(true)
  })

  test('should render the background image', () => {
    render(<ResultPage basicComplete={true} detailedComplete={false} apiKey="test" answerVals={[{ answer: 'test', tag: '1' }]}/>);
    const image = screen.getByAltText('Quiz Interface');
    expect(image).toHaveProperty('src', expect.stringContaining('resultsPage.png'));
  });

  test('should correctly parse and display sessionStorage answers', () => {
    render(<ResultPage basicComplete={true} detailedComplete={false} apiKey="test" answerVals={[{ answer: 'test', tag: '1' }]}/>);
    expect(sessionStorage.getItem).toHaveBeenCalled();
  });

  test("should render the GptResponse component with correct props", () => {
    const answerVals = [{ answer: "Test answer", tag: "1" }];
    const answers = [{ response: "Test answer 1", tag: 1 }, { response: "Test answer 2", tag: 2 }];

    render(<ResultPage basicComplete={true} detailedComplete={false} apiKey="test-api-key" answerVals={answerVals}/>);

    // Ensure GptResponse has been called with correct props
    expect(GptResponse).toHaveBeenCalledWith(expect.objectContaining({apiKey: "test-api-key", taggedAnswers: answerVals, detailedAnswers: answers}));
  });

});

describe("NotifBell", () => {
  const loggedUser = { username: "test",
    password: "password",
    remembered: false,
    loggedIn: "false",
    basicComplete: false,
    detailedComplete: false,
    quiz: [],
    progress: 0,
    detailedQuiz: [],
    ivUser: "",
    ivPass: "" };

  test("should show the bell icon initially", () => {
    render(<NotifBell basicComplete={true} detailedComplete={false} setDb={jest.fn()} loggedUser={loggedUser} db={new IDBDatabase()}/>);
    const bellIcon = screen.getByAltText("Bell here");
    expect(bellIcon).toBe(true);
  });

  test("should toggle the notification bar when bell icon is clicked", () => {
    render(<NotifBell basicComplete={true} detailedComplete={false} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    const bellIcon = screen.getByAltText("Bell here");
    fireEvent.click(bellIcon);
    expect(screen.getByText(/Basic Questions are complete!/)).toBe(true);
    fireEvent.click(bellIcon);
    expect(screen.queryByText(/Basic Questions are complete!/)).not.toBe(true);
  });

  test("should show the correct notification message when basicComplete is true", () => {
    render(<NotifBell basicComplete={true} detailedComplete={false} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    fireEvent.click(screen.getByAltText("Bell here"));
    expect(screen.getByText("Basic Questions are complete! Check out the results page!")).toBe(true);
  });

  test("should show the correct notification message when detailedComplete is true", () => {
    render(<NotifBell basicComplete={false} detailedComplete={true} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    fireEvent.click(screen.getByAltText("Bell here"));
    expect(screen.getByText("Detailed Questions are complete! Check out the results page!")).toBe(true);
  });

  test("should show 'No questions finished yet' when neither basicComplete nor detailedComplete are true", () => {
    render(<NotifBell basicComplete={false} detailedComplete={false} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    fireEvent.click(screen.getByAltText("Bell here"));
    expect(screen.getByText("No questions finished yet")).toBe(true);
  });

  test("should update notification icon when notification is true", () => {
    render(<NotifBell basicComplete={true} detailedComplete={false} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    const bellIcon = screen.getByAltText("Bell here");
    fireEvent.click(bellIcon);
    expect(screen.getByAltText("Bell here")).toHaveProperty("src", expect.stringContaining("notificationBell.png"));
  });

  test("should not show notification bar when notifBar is false", () => {
    render(<NotifBell basicComplete={true} detailedComplete={false} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    const bellIcon = screen.getByAltText("Bell here");
    expect(screen.queryByText("Basic Questions are complete! Check out the results page!")).not.toBe(true);
  });

  test("should store basicCount in sessionStorage when bell is clicked and notification is active", () => {
    render(<NotifBell basicComplete={true} detailedComplete={false} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    fireEvent.click(screen.getByAltText("Bell here"));
    expect(sessionStorage.getItem("basicCount")).toBe("1");
  });

  test("should store detailedCount in sessionStorage when detailed questions are complete", () => {
    render(<NotifBell basicComplete={false} detailedComplete={true} db={new IDBDatabase()} setDb={jest.fn()} loggedUser={loggedUser} />);
    fireEvent.click(screen.getByAltText("Bell here"));
    expect(sessionStorage.getItem("detailedCount")).toBe("1");
  });
});

describe("QuizInterface", () => {
  const mockPage = "Interface"
  const mockSetPage = jest.fn();
  const mockSetDb = jest.fn();
  const loggedUser = { username: "test",
    password: "password",
    remembered: false,
    loggedIn: "false",
    basicComplete: false,
    detailedComplete: false,
    quiz: [],
    progress: 0,
    detailedQuiz: [],
    ivUser: "",
    ivPass: "" };

  test("should render the QuizInterface component", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={true} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    expect(screen.getByText("Mocked NotifBell")).toBe(true);
    expect(screen.getByText("Collect Evidence")).toBe(true);
  });

  test("should disable 'Collect Evidence' button if no API Key entered", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={false} detailedComplete={false} setPage={mockSetPage} isKeyEntered={false} />);
    expect(screen.getByText("Please enter an API Key")).toBe(true);
    expect(screen.getByRole("button", { name: "Collect Evidence" })).toHaveProperty("disabled");
  });

  test("should enable 'Collect Evidence' button if API Key entered", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={false} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    expect(screen.getByRole("button", { name: "Collect Evidence" })).not.toHaveProperty("disabled");
  });

  test("should show 'Go Collect Some Evidence' message when loggedUser is null and basicComplete is false", () => {
    render(<QuizInterface page={mockPage} loggedUser={null} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={false} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    expect(screen.getByText("Go Collect Some Evidence, Detective!")).toBe(true);
  });

  test("should show 'Great work, detective...' when basicComplete is true", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={true} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    expect(screen.getByText("Great work, detective, we're getting closer. We've just gathered our leading witnesses, now we need you to go in there and question them in order to find out what they know. Report back ASAP.")).toBe(true);
  });

  test("should show 'Question Witnesses' button when loggedUser is logged in and basicComplete is true", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={true} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    expect(screen.getByRole("button", { name: "Question Witnesses" })).toBe(true);
  });

  test("should disable 'Question Witnesses' button when basicComplete is false", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={false} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    expect(screen.getByRole("button", { name: "Question Witnesses" })).toHaveProperty("disabled");
  });

  test("should navigate to basic-questions page when 'Collect Evidence' is clicked", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={true} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    fireEvent.click(screen.getByRole("button", { name: "Collect Evidence" }));
    expect(mockSetPage).toHaveBeenCalledWith("Basic-Questions");
  });

  test("should navigate to detailed-questions page when 'Question Witnesses' is clicked", () => {
    render(<QuizInterface page={mockPage} loggedUser={loggedUser} db={new IDBDatabase()} setDb={mockSetDb} basicComplete={true} detailedComplete={false} setPage={mockSetPage} isKeyEntered={true} />);
    fireEvent.click(screen.getByRole("button", { name: "Question Witnesses" }));
    expect(mockSetPage).toHaveBeenCalledWith("Detailed-Questions");
  });
});

describe("HomeBackground", () => {
  const mockSetPage = jest.fn();
  const navigate = jest.fn();
  const basicComplete = false;
  const page = "Home";
  const setPage = mockSetPage;

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(navigate);
  });

  test("should render the background and default text", () => {
    render(<HomeBackground basicComplete={basicComplete} page={page} setPage={setPage} />);
    expect(screen.getByText("Get to work, Detective")).toBe(true);
  });

  test("should render 'Show me your findings' when basicComplete is true", () => {
    render(<HomeBackground basicComplete={true} page={page} setPage={setPage} />);
    expect(screen.getByText("Show me your findings.")).toBe(true);
  });

  test("should navigate to the quiz page when ellipse is clicked", () => {
    render(<HomeBackground basicComplete={basicComplete} page={page} setPage={setPage} />);
    const ellipse = screen.getByRole("presentation");
    fireEvent.click(ellipse);
    expect(navigate).toHaveBeenCalledWith("/interface");
  });

  test("should navigate to the results page when rect is clicked", () => {
    render(<HomeBackground basicComplete={basicComplete} page={page} setPage={setPage} />);
    const rect = screen.getByRole("presentation");
    fireEvent.click(rect);
    expect(navigate).toHaveBeenCalledWith("/results-page");
  });

  test("should change text when hovering over rect", () => {
    render(<HomeBackground basicComplete={false} page={page} setPage={setPage} />);
    const rect = screen.getByRole("presentation");
    fireEvent.mouseEnter(rect);
    expect(screen.getByText("Get to work, Detective")).toBe(true);
    fireEvent.mouseLeave(rect);
    expect(screen.queryByText("Get to work, Detective")).not.toBe(true);
  });
});