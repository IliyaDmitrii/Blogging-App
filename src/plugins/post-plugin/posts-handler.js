import { v4 as uuid } from 'uuid';
import {
  insert as insertToDb,
  getById as getByIdFromDb,
  getAll as getAllFromDb,
  remove as removeFromDb,
  update as updateFromDb,
  getByQuery as getByQueryFromDb,
} from '../../common/db.js';
import {
  TABLE_NAME,
  STATUS,
  ROLES
} from '../../common/constants.js';

export async function createPost(request, h) {
  const { title, content } = request.payload;
  const { id } = request.auth.credentials;

  const postId = uuid();
  const currentDate = new Date().toISOString();
  const newPostPayload = {
    id: postId,
    user_id: id,
    title,
    content,
    status: STATUS.PUBLIC,
    created_at: currentDate,
    updated_at: currentDate
  };

  try {
    const post = await insertToDb(TABLE_NAME.POSTS, newPostPayload);
    return h.response({ message: 'success', post }).code(202);
  } catch (e) {
    return h.response({ message: e }).code(500);
  }
}

export async function getPostById(request, h) {
  const { id } = request.params;
  const { role } = request.auth.credentials;

  try {
    const post = await getByIdFromDb(TABLE_NAME.POSTS, id);
    if (!post) {
      return h.response({ message: 'Post not found' }).code(404);
    }
    // if the post is hidden and the user is not an admin, return an error
    if (post.status === STATUS.HIDDEN && role !== ROLES.ADMIN) {
      return h.response({ message: 'Forbidden' }).code(403);
    }

    return h.response({ post }).code(202);
  } catch (e) {
    return h.response({ message: e }).code(500);
  }
}

export async function getAllPost(request, h) {
  const { id, role } = request.auth.credentials;

  try {
    const posts = await getAllFromDb(TABLE_NAME.POSTS);
    // if the user is an admin, return all posts
    if (role === ROLES.ADMIN) {
      return h.response({ posts }).code(202);
    }
    // if the user is a blogger, return only their own hidden posts and all public posts
    const bloggerPosts = await getByQueryFromDb(TABLE_NAME.POSTS, id, STATUS.PUBLIC);
    return h.response({ bloggerPosts }).code(202);
  } catch (e) {
    return h.response({ e }).code(500);
  }
}

export async function updatePost(request, h) {
  const { id } = request.params;
  const { title, content, status } = request.payload;

  const currentDate = new Date().toISOString();
  const updatePayloadPost = {
    title,
    content,
    status,
    updated_at: currentDate
  };

  try {
    const post = await getByIdFromDb(TABLE_NAME.POSTS, id);
    if (!post) {
      return h.response({ message: 'Post not found' }).code(404);
    }
    // If the user is owner of this post
    if (post.user_id !== request.auth.credentials.id) {
      return h.response({ message: 'Forbidden' }).code(403);
    }

    await updateFromDb(TABLE_NAME.POSTS, post.id, updatePayloadPost);

    return h.response({ success: 'Updated' }).code(202);
  } catch (e) {
    return h.response({ e }).code(500);
  }
}

export async function removePost(request, h) {
  const { id } = request.params;
  const { role } = request.auth.credentials;

  try {
    const post = await getByIdFromDb(TABLE_NAME.POSTS, id);
    if (!post) {
      return h.response({ message: 'Post not found' }).code(404);
    }

    // If the blogger and the post is not theirs or the user is not an admin and the post is hidden
    if (role === ROLES.BLOGGER && post.user_id !== request.auth.credentials.id) {
      return h.response({ message: 'Forbidden' }).code(403);
    } if (role !== ROLES.ADMIN && post.status === STATUS.HIDDEN) {
      return h.response({ message: 'Forbidden' }).code(403);
    }

    await removeFromDb(TABLE_NAME.POSTS, post.id);

    return h.response({ message: 'Deleted' }).code(202);
  } catch (e) {
    return h.response({ e }).code(500);
  }
}
