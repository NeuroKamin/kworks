export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Приглашение не найдено</h1>
      <p className="text-muted-foreground">
        Возможно, ссылка на приглашение неверна или устарела
      </p>
    </div>
  );
}
