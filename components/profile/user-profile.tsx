import ProfileForm from "./profile-form";
import classes from "./user-profile.module.css";

function UserProfile() {
  const changePasswordHandler = async (passwordData: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
      return res.json() as Promise<{ message: string }>;
    });
  };
  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
