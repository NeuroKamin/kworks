import { invitations, organizations, users } from "./schema";

export type TOrganization = typeof organizations.$inferSelect;
export type TUser = typeof users.$inferSelect;
export type TInvitation = typeof invitations.$inferSelect;