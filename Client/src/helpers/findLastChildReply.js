function findLastChildReply(messages, replyId) {
  for (let message of messages) {
    if (message._id === replyId) {
      return message
    }
    if (message.replies && message.replies.length > 0) {
      let found = findLastChildReply(message.replies, replyId)
      if (found) {
        return found
      }
    }
  }
  return null
}

export { findLastChildReply }
