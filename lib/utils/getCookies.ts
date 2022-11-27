export const getCookies = (cookies: string): Record<string, string> => {
  const cookieObject: Record<string, string> = {};
  const cookieArray = cookies.split(";");
  cookieArray.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookieObject[key.trim()] = value;
  });
  return cookieObject;
};
