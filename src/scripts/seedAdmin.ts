import { email } from "better-auth/*";
import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "Admin Hasan ",
      email: "admin@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
    //check user exist on database or not
    const exitingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (exitingUser) {
        throw new Error("User already exists !!")
    }
    const signUpAdmin=await fetch("http://localhost:5000/api/auth/sign-up/email",{
        method:"POST",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify(adminData)
    })
  } catch (error) {
    console.error(error);
  }
}
