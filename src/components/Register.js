import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

//State variable

//Register fun
const Register = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const url = config.endpoint + "/auth/register";
  const { enqueueSnackbar } = useSnackbar();
  // e.preventDefault();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async () => {
    console.log(formData);
    if (validateInput(formData)) {
      setLoading(true);

      const { username, password, confirmPassword } = formData;
      // const newFormData = { ...formData };
      // console.log(e.target.id);
      // newFormData[e.target.id] = e.target.value;
      // setFormData(newFormData);
      // console.log(newFormData);
      axios
        .post(url, {
          username,
          password,
        })
        .then((res) => {
          console.log('false');
          setLoading(false);
          console.log(res);
          if (res.status === 201) {
            enqueueSnackbar("Registered successfully", { variant: "success" });
            history.push("/login");
          }
        })
        .catch((err) => {
         // history.push("/register");
          console.log('false');
          setLoading(false);
          if (err.response.status === 400) {
            enqueueSnackbar(err.response.data.message, { variant: "error" });
            //console.log(err.response);
          } else {
            enqueueSnackbar(
              "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
              { variant: "error" }
            );
            // setLoading(false);
          }
        });
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    console.log("Data", data);
    // return true;
    if (data.username == "") {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (data.username.length <= 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (data.password == "") {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    if (data.password.length <= 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }

    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              // console.log(formData.username);
            }}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              // console.log(formData.username);
            }}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              // console.log(formData.username);
            }}
          />
          {loading ? (
            <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress />
            </Box>
          ) : (
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="/login">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
