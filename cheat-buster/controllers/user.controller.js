const User = require('../models/user.model');
const { z } = require('zod');

const searchQuerySchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
  name: z.string().min(1, "Name cannot be empty").optional()
});

exports.searchUser = async (req, res) => {
  try {
    const validationResult = searchQuerySchema.safeParse(req.query);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.issues[0].message });
    }

    const { email, name } = validationResult.data;

    if (!email && !name) {
      return res.status(400).json({ error: "Please provide at least an email or name." });
    }

    const query = {
      $or: []
    };

    if (email) query.$or.push({ email });
    if (name) query.$or.push({ firstName: new RegExp(name, 'i') });

    const foundUser = await User.findOne(query);

    if (!foundUser) {
      return res.status(404).json({ message: "Phew! Your partner is not on the list." });
    }

    res.status(200).json(foundUser);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "An unexpected server error occurred." });
  }
};
