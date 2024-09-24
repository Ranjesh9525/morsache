
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function getSession() {

    const serverSession = await getServerSession(authOptions);
    return serverSession
}