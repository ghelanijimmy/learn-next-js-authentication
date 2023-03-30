import AuthForm from "../components/auth/auth-form";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

function AuthPage() {
  return <AuthForm />;
}

export default AuthPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
