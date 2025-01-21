import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import { signIn } from "@/auth";

const LoginPage = () => {
    return (
        <div className="w-full max-w-sm">
            <form action={async () => {
                "use server"
                await signIn()
            }}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Войти
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;