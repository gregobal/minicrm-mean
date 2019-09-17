module.exports = (res, error) => {
  res.status(500).json({
    success: false,
    message: 'message' in error ? error.message : error
  })
};
