import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  onPageChange
}) => {
  const maxButtons = 5;
  const half = Math.floor(maxButtons / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxButtons - 1);

  if (end - start < maxButtons - 1) {
    start = Math.max(1, end - maxButtons + 1);
  }

  const renderPageLinks = () => {
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>

        {renderPageLinks()}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
      <p className="text-sm text-muted-foreground ml-4 mt-1">
        Page {currentPage} of {totalPages}
      </p>
    </Pagination>
  );
};
