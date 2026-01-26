export default async function handler(req, res) {
  {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    // console.log(BASE_URL);
    if (req.method === "POST") {
      const { username, name, email, password, role } = req.body;

      const body = JSON.stringify({
        username,
        name,
        email,
        password,
        role,
      });
      // console.log(body);

      try {
        const apiRes = await fetch(`${BASE_URL}/api/register`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: body,
        });
        const data = await apiRes.json();

        if (apiRes.status === 201) {
          return res.status(201).json({ success: data.success });
        } else {
          return res.status(apiRes.status).json({
            success: false,
            error: data?.error || "Registration failed",
          });
        }
      } catch (err) {
        console.error("Signup API error:", err);
        return res.status(500).json({
          success: false,
          error: "Something went wrong. Try again.",
        });
      }
    }
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
