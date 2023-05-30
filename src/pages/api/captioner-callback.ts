import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Deepgram } from "@deepgram/sdk";
import { NextApiRequest, NextApiResponse } from "next";
type Event = {
  slug: string;
  publisher_key: string;
};

const callBackRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return res.status(401).json({
      error: "not_authenticated",
      description:
        "The user does not have an active session or is not authenticated",
    });
  }

  try {
    const body = req.body;
    const { eventId, key } = JSON.parse(body);

    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("id", eventId);
    if (data && data.length > 0) {
      if (key != data[0].publisher_key) {
        return res.json({ error: "Key is missing or incorrect" });
      }
      const deepgram = new Deepgram(data[0].dg_key);

      const newKey = await deepgram.keys.create(
        data[0].dg_project,
        "Temporary key - works for 10 secs",
        ["usage:write"],
        { timeToLive: 10 }
      );
      if ("key" in newKey) {
        res.json({ deepgramToken: newKey.key });
      }
    } else {
      res.json({ error: "Event not found" });
    }
  } catch (error) {
    console.log("error", error);
    res.json({ error });
  }
  // const { data } = await supabase.from("test").select("*");
  // res.json(data);
};

export default callBackRoute;
