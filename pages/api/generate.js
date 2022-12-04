import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
  // Run first prompt
  const firstPrompt = `Write me a personal motivational speech that inspires me to workout in the style of ${req.body.userInput}. The speech must be shorter than 3 paragraphs in length.
  
  ${req.body.userInput}: `;

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${firstPrompt}`,
    temperature: 0.9,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = `
   Generate a workout plan for today from the perspective of the speeker below. Be specific with what excercises should be done, how many and for how long.
 
   Speeker: ${req.body.userInput}
 
   The workout plan should be in the following format: # Excercise | reps x sets OR time | Reason
   Todays Workout:`;

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.9,
    // I also increase max_tokens.
    max_tokens: 500,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res
    .status(200)
    .json({ motivation: basePromptOutput, workout: secondPromptOutput });
};

export default generateAction;
