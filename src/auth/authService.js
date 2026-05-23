import axios from "axios";
import Cookies from "js-cookie";

const checkSession = async () => {
  try {
    const token = Cookies.get("token");
    if (!token) return { isAuth: false, session: null };

    const result = await axios.get("http://localhost:8000/session", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const userData = result.data.userData;
    return { isAuth: userData?.isAuth || false, session: userData?.session || null };
  } catch {
    return { isAuth: false, session: null };
  }
};
export default checkSession;
