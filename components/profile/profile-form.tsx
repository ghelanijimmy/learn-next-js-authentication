import classes from "./profile-form.module.css";
import React, { useRef } from "react";

interface ProfileFormProps {
  onChangePassword: (options: {
    oldPassword: string;
    newPassword: string;
  }) => Promise<{ message: string }>;
}

function ProfileForm(props: ProfileFormProps) {
  const oldPasswordInputRef = useRef<HTMLInputElement>(null);
  const newPasswordInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const enteredOldPassword = oldPasswordInputRef.current!.value;
    const enteredNewPassword = newPasswordInputRef.current!.value;

    // add validation
    props
      .onChangePassword({
        oldPassword: enteredOldPassword,
        newPassword: enteredNewPassword,
      })
      .then(() => {
        oldPasswordInputRef.current!.value = "";
        newPasswordInputRef.current!.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input ref={newPasswordInputRef} type="password" id="new-password" />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input ref={oldPasswordInputRef} type="password" id="old-password" />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
