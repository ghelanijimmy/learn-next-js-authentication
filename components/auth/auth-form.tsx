import { FormEvent, useCallback, useRef, useState } from "react";
import classes from "./auth-form.module.css";
import { signIn, useSession } from "next-auth/react";

async function createUser(email: string, password: string) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  return await response.json();
}

function AuthForm() {
  const { status } = useSession();
  const [isLogin, setIsLogin] = useState(true);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const email = emailInputRef.current!.value;
      const password = passwordInputRef.current!.value;

      if (isLogin) {
        try {
          await signIn("credentials", {
            redirect: true,
            email,
            password,
            callbackUrl: "/profile",
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          await createUser(email, password);
          setIsLogin(true);
        } catch (error) {
          console.log(error);
        }
      }
    },
    [isLogin]
  );

  if (status === "loading") {
    return <p className={classes.profile}>Loading...</p>;
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input ref={emailInputRef} type="email" id="email" required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            ref={passwordInputRef}
            type="password"
            id="password"
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
