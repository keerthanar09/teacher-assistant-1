export default async function handler(req, res) {
  {
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (req.method === "POST") {
      const { email, password, role } = req.body;
      const body = JSON.stringify({
        email,
        password,
        role,
      });
      console.log(body);

      try {
        const apires = await fetch(`${BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: body,
        });
        const data = await apires.json();

        if (apires.status === 201) {
          return res.status(201).json({ success: data.success });
        } else {
          return res.status(apires.status).json({
            success: false,
            error: data?.error || "Registration Failed",
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
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({'error':`Method ${req.method} not allowed`});
}
