import PostCard from "../../../../components/PostCard";
import Pagination from "../../../../components/Pagination";
import { Metadata, ResolvingMetadata } from "next";
import { POSTS_PER_PAGE } from "@/app/lib/contents";
import { PageData, createPageData, getPostData } from "../../lib/functions";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

type Props = {
  params: { page: number };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const title = `${params.page}ページ目`;
  return {
    title: `${title} | ブログタイトル`,
    description: `${title}`,
  };
}

// 静的ルートの作成
export async function generateStaticParams() {
  const posts = await getPostData();

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);

  const pages = Array.from({ length: totalPages }, (_, i) => {
    return {
      path: `/page/${i + 1}`,
      page: `${i + 1}`,
    };
  });

  return pages;
}

export default async function Page({ params }: { params: { page: number } }) {
  const posts = await getPostData();

  const pageData: PageData = createPageData(params.page, posts.length);

  return (
    <div className="container">
      <Header/>
      <div className="row">
        {posts.slice(pageData.start, pageData.end).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="mb-3">
        <Pagination
          type="page"
          pages={pageData.pages}
          currentPage={pageData.currentPage}
        />
      </div>
      <Footer />
    </div>
  );
}