const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

export default isProduction;
export { isDevelopment };
