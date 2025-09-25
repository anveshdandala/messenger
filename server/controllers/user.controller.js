export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({
    user: {
      id: req.user.userId,
      fullname: req.user.fullname,
      email: req.user.email,
      phone: req.user.phone,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    },
  });
};
