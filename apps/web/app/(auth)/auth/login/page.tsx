import { Input } from "@workspace/ui/components/input";
import { sendVerificationEmail } from "@workspace/mailer";
import { SubmitButton } from "@workspace/ui/components/form/submit-button";

const LoginPage = () => {
  console.log("LoginPage");

  return (
    <div className="w-full max-w-sm">
      <form
        action={async (formData) => {
          "use server";
          await sendVerificationEmail(
            formData.get("email") as string,
            "123456",
          );
        }}
      >
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl text-center font-bold">Вход в систему</h1>
          <div className="flex flex-col gap-2">
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              required
            />

            <SubmitButton>Отправить код</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
