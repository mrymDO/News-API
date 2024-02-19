import User from "../models/user";
import { generateAccessToken } from "../utils/jwt";



async function login(req, res) {
  const { username, password } = req.body
  const errors = {}

  if (!username) {
    errors.username = "Username required"
  }

  if (!password) {
    errors.password = "Password required";
  }

  if (errors) {
    return res.status(400).json({
      errors
    })
  }

  const user = await User.find({ username });
  if (!user) {
    return res.status(400).json({
      message: "username or password wrong"
    });
  }
  const isValidPassord = await bcrypt.compare(password, user.password);

  if (!isValidPassord) {
    return res.status(400).json({
      message: "username or password wrong"
    })
  }

  const token = generateAccessToken(user._id);
  user.password = undefined
  return res.status(200).json({
    message: "User logged successfully",
    user,
    token
  })
}