import { invitations, spaces, users } from "./schema";

export type TSpace = typeof spaces.$inferSelect;
export type TUser = typeof users.$inferSelect;
export type TInvitation = typeof invitations.$inferSelect;