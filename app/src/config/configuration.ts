export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  jwt: {
    access_token: {
      key: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    },
    refresh_token: {
      key: process.env.REFRESH_TOKEN_KEY,
      cookie_name: process.env.REFRESH_TOKEN_COOKIE_NAME,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    },
  },
});
