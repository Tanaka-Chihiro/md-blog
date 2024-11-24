import Link from "next/link";
import { PostItem } from "@/app/lib/types";

const PostCard = ({ post }: { post: PostItem }) => {
  return (
    <div
      className="flex mx-20"
    >
      {post.image && (
        <div className="scale-95 hover:scale-100 ease-in duration-100">
          <picture>
            <img
              src={`${post.image}`}
              width={600}
              height={300}
              alt={post.title}
              className="object-contain img-fluid img-thumbnail"
              style={{ height: "300px" }}
            />
          </picture>
        </div>
      )}
      <div className="px-2 py-3 mt-10">
        <Link href={`/posts/${post.slug}`}>
          <h1 className="font-bold text-lg hover:text-blue-300">{post.title}</h1>
        </Link>
        <span className="px-3">{post.date}</span>
        <div className="px-3">{post.preview}
        <Link href={`/posts/${post.slug}`}
              className="hover:text-blue-300">　…続きを読む≫</Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;