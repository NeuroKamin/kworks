import { getWeek } from "@workspace/ui/lib/utils";

import { getEvents } from "../actions/events";

import Scheduler from "@/components/Scheduler";
import { auth } from "@/auth";

export default async function Page() {
  const { startOfWeek, endOfWeek } = getWeek();

  const session = await auth();

  const events = await getEvents(startOfWeek, endOfWeek);
  console.log(events);
  return (
    <div className="flex mx-auto">
      <Scheduler events={events} />
    </div>
  );
}
