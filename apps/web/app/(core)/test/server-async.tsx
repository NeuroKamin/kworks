export default async function TestAsyncServer() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
  const data = await res.json();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <div className="p-4 border border-blue-500">
      TestAsyncServer: {data.title}
    </div>
  );
}
