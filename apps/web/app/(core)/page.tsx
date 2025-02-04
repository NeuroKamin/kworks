import { getWeek } from "@workspace/ui/lib/utils";

import { getEvents } from "@/actions/events";
import Scheduler from "@/components/Scheduler";

export default async function Page() {
  const { startOfWeek, endOfWeek } = getWeek();

  const events = await getEvents(startOfWeek, endOfWeek);

  return <Scheduler events={events} />;
}
