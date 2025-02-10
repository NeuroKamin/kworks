import { invitations, spaces, users } from "./schema";

export type TSpace = typeof spaces.$inferSelect;
export type TUser = typeof users.$inferSelect;
export type TUserWithRole = TUser & { role: string };
export type TInvitation = typeof invitations.$inferSelect;