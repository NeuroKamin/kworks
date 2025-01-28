import { auth } from "@/auth";

const MePage = async () => {
  const session = await auth();
  return <div>{session?.user?.name}</div>;
};

export default MePage;
