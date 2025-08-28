import { useSession } from "next-auth/react";

const useCurrentUser = () => {
  const { data: session } = useSession();

  return {
    user: session?.user,
    isLoading: !session,
  };
};

export default useCurrentUser;
