export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isTokenValid = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  try {
    const tokenParts = token.split(".");

    if (tokenParts.length !== 3) {
      clearAuthSession();
      return false;
    }

    const payloadPart = tokenParts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const paddedPayload = payloadPart.padEnd(
      Math.ceil(payloadPart.length / 4) * 4,
      "="
    );

    const payload = JSON.parse(atob(paddedPayload));

    if (!payload.exp) {
      return true;
    }

    const isExpired = payload.exp * 1000 <= Date.now();

    if (isExpired) {
      clearAuthSession();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid authentication token:", error);

    clearAuthSession();
    return false;
  }
};