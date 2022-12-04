import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateMotivation = async (req, res) => {
  // Run first prompt
  const firstPrompt = `Write me a personal motivational speech that inspires me to workout in the style of ${req.body.userInput}. The speech must 1 paragraph in length.
  
  ${req.body.userInput}: `;

  const baseCompletion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${firstPrompt}`,
    temperature: 0.9,
    max_tokens: 500,
  });

  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ motivation: basePromptOutput });
};

export default generateMotivation;
