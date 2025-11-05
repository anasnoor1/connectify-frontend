import CryptoJS from "crypto-js";

const SECRET_KEY = "my_super_secret_key_123"; 

// Save token to localStorage
export const setToken = (token) => {
  const encrypted = CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
  localStorage.setItem("token", encrypted);
};


export const getToken = () => {
  const encrypted = localStorage.getItem("token");
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getToken();
};

// Remove token (logout)
export const logout = () => {
  localStorage.removeItem("token");
};

