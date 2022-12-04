import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateImage = async (req, res) => {
  console.log("GENERATING IMAGE");
  console.log(req.body.text);
  try {
    const response = await openai.createImage({
      prompt: `${req.body.text} in the style of a fitness coach with a black background`,
      n: 1,
      size: "256x256",
    });
    const image_url = response.data.data[0].url;
    console.log("GOT IMAGE");
    console.log(image_url);

    // Send over the Prompt #2's output to our UI instead of Prompt #1's.

    res.status(200).json({ image_url: image_url });
  } catch (e) {
    //console.log(e);
  }
};

export default generateImage;
