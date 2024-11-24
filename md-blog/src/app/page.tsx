import PostCard from "../../components/PostCard";
import Pagination from "../../components/Pagination";
import { PageData, createPageData, getPostData } from "./lib/functions";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default async function Home() {
  const posts = await getPostData();

  const pageData: PageData = createPageData(1, posts.length);

  return (
    <div className="container">
      <Header />
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