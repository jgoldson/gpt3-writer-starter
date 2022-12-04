import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generatePlan = async (req, res) => {
  // I build Prompt #2.
  const secondPrompt = `
   Generate a workout plan for today from the perspective of the speeker below. Be specific with what excercises should be done, how many and for how long.
 
   Speeker: ${req.body.userInput}
 
   The workout plan should be in the following format: # Excercise | reps x sets OR time | Reason
   Todays Workout:`;

  const secondPromptCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${secondPrompt}`,
    temperature: 0.9,
    max_tokens: 500,
  });

  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ workout: secondPromptOutput });
};

export default generatePlan;
