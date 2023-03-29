import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const Home = () => {
  const [page, setPage] = useState(1);
  const [userInput, setUserInput] = useState("");
  const [coach, setCoach] = useState("");
  const [imageURL, setImageURL] = useState("");

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const [apiOutput, setApiOutput] = useState("");
  const [workoutOutput, setWorkoutOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const presetButtonPressed = async (text) => {
    callOpenAIEndpoints(text);
  };

  const callOpenAIEndpoints = (input) => {
    if (input < 2) {
      return;
    }
    setCoach(input);
    setPage(2);
    callAnswerQuestion(input);
  };

  const callGeneratePlan = async ({ input }) => {
    setIsGenerating(true);
    console.log("Calling OpenAI...");
    const response = await fetch("/api/generatePlan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    const { workout } = data;
    console.log("Got Response");
    setWorkoutOutput(`${workout.text}`);
    setIsGenerating(false);
    setPage(2);
  };

  const callAnswerQuestion = async (input) => {
    setIsGenerating(true);
    console.log("Calling OpenAI with input...", input);
    const response = await fetch("/api/answerQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    console.log(data);

    setApiOutput(`${data.answer}`);
    setIsGenerating(false);
    setPage(2);
  };

  const callGenerateImage = async (text) => {
    console.log("getting image");
    console.log(text);
    const response = await fetch("/api/generateImage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    console.log(data.image_url);
    setImageURL(data.image_url);
    setIsGenerating(false);
    setPage(2);
  };

  const GenerateButton = ({ title }) => (
    <div className="prompt-buttons">
      <a
        className="generate-button"
        onClick={() => callOpenAIEndpoints(userInput)}
      >
        <div className="generate">
          {isGenerating ? <span className="loader"></span> : <p>{title}</p>}
        </div>
      </a>
    </div>
  );

  const PresetButton = ({ person }) => (
    <div className="preset-buttons">
      <a
        className="generate-button"
        onClick={() => presetButtonPressed(person)}
      >
        <div className="generate">
          {isGenerating ? <span className="loader"></span> : <p>{person}</p>}
        </div>
      </a>
    </div>
  );

  const backButtonPressed = () => {
    setApiOutput("");
    setWorkoutOutput("");
    setUserInput("");
    setImageURL("");

    setPage(1);
  };

  const Page2 = () => (
    <div className="container">
      {isGenerating ? (
        <div className="vertical-center">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="row">
          <div className="col">
            {apiOutput ? (
              <div className="output">
                <div className="output-header-container">
                  <div className="output-header">
                    <h3>{coach}</h3>
                  </div>
                </div>
                <div className="output-content">
                  <p>{apiOutput}</p>
                </div>
              </div>
            ) : (
              <span className="loader"></span>
            )}
            {imageURL && (
              <div className="center">
                <Image
                  loader={() => imageURL}
                  src={imageURL}
                  alt="Coach"
                  height="256"
                  width="256"
                />
              </div>
            )}
          </div>

          <div className="badge-container grow me-auto">
            <a
              className="generate-button"
              onClick={() => {
                backButtonPressed();
              }}
            >
              <div className="generate ">
                <p>Back</p>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="root">
      <Head>
        <title>LoL GPT</title>
      </Head>
      {page == 1 ? (
        <div className="container vertical-center">
          <div className="header">
            <div className="header-title">
              <h1>Ask any question about League of Legends</h1>
            </div>

            <div className="form-group ml-auto mr-auto">
              <textarea
                placeholder="Enter question here.
                Example: Who is an easy jungler to learn?"
                className="prompt-box"
                value={userInput}
                onChange={onUserChangedText}
              />

              <GenerateButton title="Generate" />
            </div>
          </div>
        </div>
      ) : (
        <Page2 />
      )}
    </div>
  );
};

export default Home;
