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
    callGenerateEndpoint(input);
    callGenerateImage(input);
  };

  const callGenerateEndpoint = async ({ input }) => {
    setIsGenerating(true);
    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });
    const data = await response.json();
    const { motivation, workout } = data;
    console.log("Got Response");
    setApiOutput(`${motivation.text}`);
    setWorkoutOutput(`${workout.text}`);
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

  const Page2 = () => (
    <div className="container">
      {isGenerating ? (
        <div className="vertical-center">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="row">
          <div className="col-xl-6">
            {apiOutput && (
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
            )}
          </div>
          <div className="col-xl-6">
            <div className="row">
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

            {imageURL && (
              <div className="center">
                <Image
                  loader={() => imageURL}
                  src={imageURL}
                  alt="https://imgs.search.brave.com/Si8uhmyIBL1ViEuU0tP09IR50M5aRclh05jsckdHUH4/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly92aWdu/ZXR0ZS53aWtpYS5u/b2Nvb2tpZS5uZXQv/ZHJhZ29uYmFsbHdo/YXRpZnMvaW1hZ2Vz/L2MvYzAvR29rdV9z/YWdhX3NhaXlhamlu/LnBuZy9yZXZpc2lv/bi9sYXRlc3Q_Y2I9/MjAxODA5MjkyMzU5/MjA"
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
                setPage(1);
              }}
            >
              <div className="generate ">
                <p>↩</p>
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
        <title>Custom Workouts | GPT-3</title>
      </Head>
      {page == 1 ? (
        <div className="container vertical-center">
          <div className="header">
            <div className="header-title">
              <h1>Workout Of The Day</h1>
            </div>
            <div className="header-subtitle">
              <h2>Choose a trainer and get a custom workout today</h2>
            </div>
            <div className="row center">
              <PresetButton person="Goku" />
              <PresetButton person="Schwarzenegger" />
              <PresetButton person="Superman" />
            </div>

            <div className="form-group ml-auto mr-auto">
              <p className="label label-text">Or bring your own!</p>
              <textarea
                placeholder="Enter a person here.
                Example: Goku"
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
