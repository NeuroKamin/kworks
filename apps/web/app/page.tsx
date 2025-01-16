
import Scheduler from "@/components/Scheduler";
import { getEvents } from "../actions/events";
import { getWeek } from "@workspace/ui/lib/utils";

export default async function Page() {
  const { startOfWeek, endOfWeek } = getWeek();
  const events = await getEvents(startOfWeek, endOfWeek);
  return (
    <div className="flex mx-auto">
      <Scheduler events={events} />
    </div>
  )
}
