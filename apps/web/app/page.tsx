
import Scheduler from "@/components/Scheduler";
import { getEvents } from "../actions/events";


export default async function Page() {
  const events = await getEvents();
  return (
    <div className="flex mx-auto">
      <Scheduler events={events} /> 
    </div>
  )
}
