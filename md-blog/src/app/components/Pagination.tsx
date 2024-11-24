import Link from "next/link";

interface PageProps {
  type: string;
  pages: number[];
  currentPage?: number;
}

const Pagination = ({ type, pages, currentPage = 1 }: PageProps) => {

  return (
    <div className="ml-20 mb-10">
      {pages.map((page) => (
        <Link href={`/${type}/${page}`} key={page}
            className={`px-4 py-2 border mx-2`}>
            {page}
        </Link>
      ))}
    </div>
  );
};

export default Pagination;