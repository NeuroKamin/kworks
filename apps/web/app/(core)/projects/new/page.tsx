import NewProject from "../components/new-project";

export default function Page() {
  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-full md:max-w-[500px] lg:max-w-lg">
        <NewProject />
      </div>
    </div>
  );
}
