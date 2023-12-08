const handleServerError = (res) => {
  return res.status(500).json({ message: 'Internal Server Error' });
};

const handleResponse = (res, status, data) => {
  return res.status(status).json(data);
};

module.exports = { handleServerError, handleResponse };
