export function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="block p-6 bg-card border rounded-lg animate-pulse">
      <div className="flex items-start gap-3">
        {/* Иконка скелетон */}
        <div className="flex-shrink-0 p-2 bg-gray-200 rounded-lg">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Заголовок скелетон */}
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>

          {/* Описание скелетон */}
          <div className="space-y-1 mb-3">
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-2/3"></div>
          </div>

          {/* Дата скелетон */}
          <div className="h-3 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
