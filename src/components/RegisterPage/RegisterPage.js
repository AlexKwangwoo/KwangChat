import React from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Register</h3>
      </div>
      <form>
        <label>Email</label>
        <input
          name="email"
          type="email"
          // ref={register({ required: true, maxLength: 10 })}
        />
        {/* {errors.exampleRequired && <p>This field is required</p>} */}

        <label>Name</label>
        <input
          name="Name"
          // ref={register({ required: true, maxLength: 10 })}
        />
        {/* {errors.exampleRequired && <p>This field is required</p>} */}

        <label>Password</label>
        <input
          name="Password"
          type="Password"
          // ref={register({ required: true, maxLength: 10 })}
        />
        {/* {errors.exampleRequired && <p>This field is required</p>} */}

        <label>Password Comfirm</label>
        <input
          name="password_confirm"
          type="password"
          // ref={register({ required: true, maxLength: 10 })}
        />
        {/* {errors.exampleRequired && <p>This field is required</p>} */}
        <input type="submit" />
        <Link style={{ color: "gray", textDecoration: "none" }} to="login">
          Already you have an account?
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
