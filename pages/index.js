import Head from "next/head";
import Image from "next/image";
import buildspaceLogo from "../assets/buildspace-logo.png";
import { useState } from "react";

const Home = () => {
  const [page, setPage] = useState(1);
  const [userInput, setUserInput] = useState("");

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  const [apiOutput, setApiOutput] = useState("");
  const [workoutOutput, setWorkoutOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput }),
    });

    const data = await response.json();
    const { motivation, workout } = data;
    console.log("Got Response");
    setApiOutput(`${motivation.text}`);
    setWorkoutOutput(`${workout.text}`);
    setIsGenerating(false);
    setPage(2);
  };

  const GenerateButton = () => (
    <div className="prompt-buttons">
      <a className="generate-button" onClick={callGenerateEndpoint}>
        <div className="generate">
          {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
        </div>
      </a>
    </div>
  );

  const Page2 = () => (
    <div className="container vertical-center">
      <div className="row">
        <div className="col">
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>{userInput}</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
        <div className="col">
          {workoutOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Todays Workout</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{workoutOutput}</p>
              </div>
            </div>
          )}
        </div>
        <div className="badge-container grow me-auto">
          <a
            className="generate-button"
            onClick={() => {
              setPage(1);
            }}
          >
            <div className="generate ">
              <p>↩</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="root">
      <Head>
        <title>Custom Workouts | GPT-3</title>
      </Head>
      {console.log(page)}
      {page == 1 ? (
        <div className="container vertical-center">
          <div className="row">
            <div className="header">
              <div className="header-title">
                <h1>Workout Of The Day</h1>
              </div>
              <div className="header-subtitle">
                <h2>Choose a trainer and get a custom workout today</h2>
              </div>
            </div>

            <div className="form-group ml-auto mr-auto">
              <input
                placeholder="Enter a person here. Example: Goku"
                className="prompt-box"
                value={userInput}
                onChange={onUserChangedText}
              />

              <GenerateButton />
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
