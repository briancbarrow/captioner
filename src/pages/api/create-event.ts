import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "@/types/supabase";

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const NewEventRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  // Create authenticated Supabase Client
  const supabase = createPagesServerClient({ req, res });
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
    console.log("req.body", req.body);
    // const body = JSON.parse(req.body);
    // console.log("body", body);
    const { title, startDate, totalDays, contactEmail } = req.body;
    const data = await supabase.from("events").insert([
      {
        title,
        start_date: startDate,
        total_days: totalDays,
        contact_email: contactEmail,
        user_id: session.user.id,
      },
    ]);
    // console.log("data", req.nexUrl);
    if (data.status === 201 && data.statusText === "Created") {
      res.redirect("/events");
    }
    // res.json(req);
  } catch (error) {
    console.log("error", error);
    res.json({ error });
  }
};

export default NewEventRoute;
