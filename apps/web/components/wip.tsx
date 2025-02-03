import { IconCode } from "@tabler/icons-react";

const WIP = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex aspect-square p-2 items-center justify-center rounded-lg bg-gradient-to-b from-primary to-primary/70 text-primary-foreground">
        <IconCode className="size-10" />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <p className="font-extrabold text-xl">Тут пока ничего нет</p>
        <div className="flex flex-col gap-0 items-center">
          <p className="text-sm text-muted-foreground">
            Этот функционал ещё не реализован.
          </p>
          <p className="text-sm text-muted-foreground">
            Мы работаем над этим. Честно.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WIP;
