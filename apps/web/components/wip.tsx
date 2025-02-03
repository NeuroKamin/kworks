const WIP = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">
        <g strokeWidth="2" fill="none" fillRule="evenodd">
          <path
            d="M20 48.875v-12.75c0-1.33.773-2.131 2.385-2.125h26.23c1.612-.006 2.385.795 2.385 2.125v12.75C51 50.198 50.227 51 48.615 51h-26.23C20.773 51 20 50.198 20 48.875zM37 40.505h9M37 44.492h6"
            stroke="#2088FF"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            stroke="#79B8FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 30h-4M16 35h-3M47 10H5M42 15H24M19 15h-9M16 25h-3M42 20h-2M42 20h-2M42 25h-2M16 20h-3"
          />
          <path
            stroke="#2088FF"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M31.974 25H24"
          />
          <path
            d="M22 20h12a2 2 0 012 2v6a2 2 0 01-2 2H22a2 2 0 01-2-2v-6a2 2 0 012-2z"
            stroke="#2088FF"
          />
          <path
            d="M5 33V7a2 2 0 012-2h38a2 2 0 012 2v23"
            stroke="#79B8FF"
            strokeLinecap="round"
          />
          <path
            d="M5 30v8c0 1.105.892 2 1.993 2H16"
            stroke="#79B8FF"
            strokeLinecap="round"
          />
          <g stroke="#2088FF" strokeLinecap="round">
            <path d="M26.432 37.933v7.07M26.432 37.933v9.07M24.432 40.433h7.07M24.432 40.433h8.07M24.432 44.433h7.07M24.432 44.433h8.07M30.432 37.933v9.07" />
          </g>
        </g>
      </svg>
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
