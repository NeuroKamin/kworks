import { Skeleton } from "./skeleton";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center page-animation">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
