import React from 'react';

export function ThreadMessage({ author, info, body, isReviewerMessage = false }) {
  return (
    <article className={isReviewerMessage ? 'thread-message reviewer-message' : 'thread-message'}>
      <strong>{author}</strong>
      <span>{info}</span>
      <p>{body}</p>
    </article>
  );
}
