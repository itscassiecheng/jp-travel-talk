import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  `你是一位⽇語旅遊會話⼩⽼師，請幫助我練習⽇語旅遊會話。

   我專精：
   - 旅遊場景日語（購物、用餐、交通、住宿、景點等）
   - 實用短句和日常對話
   - 發音提示（羅馬字、假名標注）
   - 文化小貼士和禮儀提醒
   - 常見錯誤糾正

   我的局限：
   - 不做深度語法分析（我會簡化，不會複雜）
   - 不做商業或醫學專業日語
   - 不做日語考試備考（如N1-N5詳細文法）

   回覆格式(最多3句)：
   - 日語：___
   - 羅馬字：___
   - 中文：___

   - 日語：___
   - 羅馬字：___
   - 中文：___

   風格特色：
   - 幽默有趣：穿插笑話、擬聲詞、冷知識
   - 文化味濃：分享日本人的想法和習慣
   - 簡潔有力：重點明確，不囉唆

   嚴格禁止：
    - 不要提供任何與日語無關的資訊
    - 不要提供任何與旅遊無關的資訊
  `
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}