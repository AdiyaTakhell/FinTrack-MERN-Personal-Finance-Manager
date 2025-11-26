import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import cookieStore from "cookie-store";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // Global states
  const [ExpenseData, setExpenseData] = useState([]);
  const [IncomeData, setIncomeData] = useState([]);
  const [token, setToken] = useState(Boolean(cookieStore.get("token")));

  const backend_url = "http://localhost:4000";
  const utoken = cookieStore.get('token')


  const fetchIncome=async () => {
    try {
      const decodedToken = jwtDecode(utoken)
      const userId = decodedToken?.id;

      if (userId){
        return
      }
      const {data} = await axios.get(``)      
    } catch (error) {
      
    }
  }
  // ========= REGISTER =========
  const handleRegister = async (name, email, password) => {
    try {
      const { data } = await axios.post(
        `${backend_url}/api/user/register`,
        { name, email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        cookieStore.set("token", data.token, { expires: 7 });
        setToken(true);
        toast.success(data.message || "Register Successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
      console.error(error);
    }
  };

  // ========= LOGIN =========
  const handleLogin = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${backend_url}/api/user/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success) {
        cookieStore.set("token", data.token, { expires: 7 });
        setToken(true);
        toast.success(data.message || "Login Successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
      console.error(error);
    }
  };

  // ========= LOGOUT =========
  const handleLogout = () => {
    cookieStore.remove("token");
    setToken(false);
    toast.success("Logged out");
    navigate("/login");
  };

  // ========= ATTACH TOKEN TO AXIOS =========
  axios.defaults.headers.common["Authorization"] =
    token ? `Bearer ${cookieStore.get("token")}` : "";

  // ========= PROVIDER CONTEXT VALUES =========
  const values = {
    backend_url,
    ExpenseData,
    IncomeData,
    setExpenseData,
    setIncomeData,
    token,
    handleRegister,
    handleLogin,
    handleLogout,
  };

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <AppContext.Provider value={values}>
      {children}
    </AppContext.Provider>
  );
};

// ========= PROPTYPES VALIDATION =========
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;
