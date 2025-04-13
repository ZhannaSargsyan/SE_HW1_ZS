module.exports = {
  [process.env.NODE_ENV || 'development']: {
    use_env_variable: 'POSTGRES_URL',
    dialect: 'postgres',
    logging: false
  }
};
