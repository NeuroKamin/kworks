import { createTransport } from "nodemailer";
import { render } from "@react-email/render";
import ConfirmEmailTemplate from "./emails/templates/confirmEmail";
import RecoveryPasswordTemplate from "./emails/templates/recoveryPassword";
import UserInviteTemplate from "./emails/templates/userInviteEmail";

const transport = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: +process.env.EMAIL_SERVER_PORT!,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    }
})

export const sendVerificationEmail = async (email: string, code: string) => {
    console.log(email, code);


    try {
        await transport.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `Код подтверждения`,
            html: render(<ConfirmEmailTemplate code={code} />),
        })
    } catch (error) {
        console.error(error)
    }

}

export const sendForgotPasswordEmail = async (email: string, url: string) => {

    try {
        await transport.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `Восстановление доступа`,
            html: render(<RecoveryPasswordTemplate url={url} />),
        })
    } catch (error) {
        console.error(error)
    }

}

export const sendInviteUserEmail = async ({
  email,
  inviteLink,
  invitedByUsername,
  invitedByEmail,
  spaceName,
}: {
  email: string;
  inviteLink: string;
  invitedByUsername: string;
  invitedByEmail: string;
  spaceName?: string;
}) => {

    try {
        await transport.sendMail({
            to: email,
            from: process.env.EMAIL_FROM,
            subject: `Приглашение`,
            html: render(<UserInviteTemplate inviteLink={inviteLink} invitedByUsername={invitedByUsername} invitedByEmail={invitedByEmail} spaceName={spaceName} />),
        })
    } catch (error) {
        console.error(error)
    }

}