import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const answerQuestion = async (req, res) => {
  console.log("Received question: ", req.body.input);
  const message = [
    {
      role: "system",
      content: `You are an expert league of legends player and coach who is helping answer questions about the game to a player.`,
    },
    {
      role: "user",
      content: `${req.body.input}`,
    },
  ];
  let GPT35Turbo = async (message) => {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: message,
    });

    return response.data.choices[0].message.content;
  };

  try {
    await GPT35Turbo(message).then((response) => {
      console.log("### I'm GPT-3.5-TURBO. ####", response);

      res.status(200).json({ answer: response });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default answerQuestion;
